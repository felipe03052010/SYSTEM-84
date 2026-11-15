#!/usr/bin/env node
/**
 * Fotografa o site inteiro para o catálogo visual em PDF:
 *
 *   1. cada página, do topo ao fim (pedaços de 1440×900)
 *   2. cada tela de carregamento, quadro a quadro (4 quadros por tela)
 *   3. a entrada: BIOS, escolha de terminal e formulário
 *   4. a mesma página em cada filtro de computador antigo + filtro extra forte
 *   5. o modo responsivo (390×844), quando faz diferença
 *
 * O site usa HashRouter, então as rotas são /#/filmes.
 *
 * Uso: node scripts/capture-site.mjs .
 * Saída: work/site-capture/shots/*.png e work/site-capture/manifest.json
 */
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/felip/AppData/Local/Temp/nodecli/node_modules/playwright-core')
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const root = process.argv[2] || '.'
const dist = join(root, 'dist')
const work = join(root, 'work/site-capture')
const shots = join(work, 'shots')

await rm(shots, { recursive: true, force: true })
await mkdir(shots, { recursive: true })

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.woff': 'font/woff',
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  const file = join(dist, path)
  try {
    if (existsSync(file) && extname(file)) {
      res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' })
      res.end(await readFile(file))
      return
    }
  } catch { /* cai no index */ }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(await readFile(join(dist, 'index.html')))
})

await new Promise((resolve) => server.listen(4325, '0.0.0.0', resolve))
const base = 'http://localhost:4325'

const FREEZE = '*,*::before,*::after{animation-play-state:paused !important;transition:none !important;caret-color:transparent !important}'

const browser = await chromium.launch({ executablePath: EDGE })
const manifest = { pages: [], loaders: [], filters: [], entrance: [], mobile: [] }

async function open(route, { width = 1440, height = 900, admitted = true } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.addInitScript((isAdmitted) => {
    try {
      sessionStorage.setItem('system84-bios-v2', 'true')
      if (isAdmitted) sessionStorage.setItem('system84-admitted', 'true')
      else sessionStorage.removeItem('system84-admitted')
      localStorage.setItem('system84-sound', 'off')
    } catch { /* opcional */ }
  }, admitted)
  await page.goto(base + route, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1600)
  return { context, page }
}

async function capturePage(route, slug, { width = 1440, height = 900, admitted = true, wait = 1600 } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript((isAdmitted) => {
    try {
      sessionStorage.setItem('system84-bios-v2', 'true')
      if (isAdmitted) sessionStorage.setItem('system84-admitted', 'true')
      else sessionStorage.removeItem('system84-admitted')
      localStorage.setItem('system84-sound', 'off')
    } catch { /* opcional */ }
  }, admitted)
  const url = base + route + (route.includes('?') ? '&' : '?') + 'loader=0'
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(wait)
  await page.addStyleTag({ content: FREEZE })
  await page.waitForTimeout(150)

  const totalHeight = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, window.innerHeight))
  const slices = []
  const count = Math.max(1, Math.ceil(totalHeight / height))
  for (let i = 0; i < count; i += 1) {
    await page.evaluate((offset) => window.scrollTo(0, offset), i * height)
    await page.waitForTimeout(220)
    const file = join(shots, `page-${slug}-${String(i + 1).padStart(2, '0')}.png`)
    await page.screenshot({ path: file })
    slices.push({ file, index: i })
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await context.close()
  return { route, slug, slices, totalHeight }
}

/* ───────────────── 1. páginas ───────────────── */

const PAGES = [
  { route: '/#/', slug: 'capa', name: 'Capa — Estação', note: 'Herói, fita de categorias, acervo em destaque, frequências perdidas, canal aberto, console de busca e rodapé.' },
  { route: '/#/filmes', slug: 'filmes', name: 'Filmes — diretório', note: 'Cabeçalho do diretório, painel de diagnóstico, filtros de período, modo de vídeo, efeitos de tela e grade de cartões.' },
  { route: '/#/series', slug: 'series', name: 'Séries — diretório', note: 'Mesmo desenho, acervo de seriados históricos.' },
  { route: '/#/livros', slug: 'livros', name: 'Livros — diretório', note: 'Diretório de textos integrais com leitor interno.' },
  { route: '/#/lost-media', slug: 'lost-media', name: 'Lost media — diretório', note: 'Dossiês de obras perdidas.' },
  { route: '/#/pesquisa?q=dracula', slug: 'pesquisa', name: 'Pesquisa', note: 'Busca global no acervo.' },
  { route: '/#/comunidade', slug: 'comunidade', name: 'Comunidade — BBS', note: 'Canais, painel de conexão e fila de envios.' },
  { route: '/#/obra/2', slug: 'obra-2', name: 'Ficha de obra — Metropolis', note: 'Cabeçalho, player, procedência e fontes.' },
  { route: '/#/obra/505', slug: 'obra-505', name: 'Ficha de obra — acervo internacional', note: 'Registro de expansão, mídia lida direto da fonte pública.' },
  { route: '/#/admin-financeiro', slug: 'admin', name: 'Administração', note: 'Área restrita: o portal pede credenciais.' },
  { route: '/#/rota-inexistente', slug: '404', name: 'Página não encontrada', note: 'Rota inexistente.' },
]

for (const target of PAGES) {
  const result = await capturePage(target.route, target.slug)
  manifest.pages.push({ ...target, ...result })
  console.log('página', target.route, result.slices.length, 'quadros')
}

/* ───────────────── 2. telas de carregamento ───────────────── */

const LOADERS = [
  { route: '#/', kind: 'post', label: 'LIGANDO TERMINAL', detail: 'POST · memória 640K OK', ms: 900 },
  { route: '#/filmes', kind: 'tape', label: 'ALINHANDO FOTOGRAMAS', detail: 'DECK VHS · TRACKING', ms: 1100 },
  { route: '#/series', kind: 'static', label: 'SINTONIZANDO CANAIS', detail: 'ANTENA · CANAL 84', ms: 950 },
  { route: '#/livros', kind: 'floppy', label: 'LENDO DISQUETE', detail: 'DISCO A: · 1.44 MB', ms: 1000 },
  { route: '#/pesquisa', kind: 'modem', label: 'CONECTANDO MODEM', detail: 'ATDT 084-1984', ms: 1150 },
  { route: '#/lost-media', kind: 'disk', label: 'RECUPERANDO FRAGMENTOS', detail: 'SETOR 84 · SETORES RUINS', ms: 1200 },
  { route: '#/comunidade', kind: 'bulletin', label: 'ENTRANDO NO BBS', detail: 'NÓ 84 · 2400 BAUD', ms: 1000 },
  { route: '#/admin-financeiro', kind: 'scan', label: 'VERIFICANDO CREDENCIAIS', detail: 'ACESSO RESTRITO', ms: 800 },
]

for (const loader of LOADERS) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('system84-bios-v2', 'true')
      sessionStorage.setItem('system84-admitted', 'true')
      localStorage.setItem('system84-sound', 'off')
    } catch { /* opcional */ }
  })
  await page.goto(base + '/#/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)

  const frames = []
  const offsets = [0.05, 0.35, 0.65, 0.95]
  for (const [index, ratio] of offsets.entries()) {
    const ms = Math.round(loader.ms * ratio)
    await page.evaluate(() => { window.location.hash = '#/' })
    await page.waitForTimeout(1200)
    await page.evaluate((hash) => { window.location.hash = hash }, loader.route)
    const started = Date.now()
    await page.waitForTimeout(Math.max(40, ms - (Date.now() - started)))
    const file = join(shots, `loader-${loader.kind}-${index + 1}.png`)
    await page.screenshot({ path: file, animations: 'allow' })
    frames.push({ ms, file })
  }
  await context.close()
  manifest.loaders.push({ ...loader, frames })
  console.log('loader', loader.kind, frames.length, 'quadros')
}

/* ───────────────── 3. entrada / BIOS ───────────────── */

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(() => {
    try {
      sessionStorage.removeItem('system84-bios-v2')
      sessionStorage.removeItem('system84-admitted')
      localStorage.setItem('system84-sound', 'off')
    } catch { /* opcional */ }
  })
  await page.goto(base + '/#/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  const bios1 = join(shots, 'entrada-01-bios.png')
  await page.screenshot({ path: bios1 })
  const powerOn = page.locator('.bios-audio-controls button').nth(1)
  if (await powerOn.count()) { await powerOn.click(); await page.waitForTimeout(2200) }
  const bios2 = join(shots, 'entrada-02-bios-progresso.png')
  await page.screenshot({ path: bios2 })
  const skip = page.locator('.bios-audio-controls button').last()
  if (await skip.count()) { await skip.click(); await page.waitForTimeout(1800) }
  await page.addStyleTag({ content: FREEZE })
  const entrance1 = join(shots, 'entrada-03-terminais.png')
  await page.screenshot({ path: entrance1 })
  const creator = page.locator('.terminal-creator, .terminal-card, button').first()
  if (await creator.count()) { await creator.click(); await page.waitForTimeout(900) }
  const entrance2 = join(shots, 'entrada-04-formulario.png')
  await page.screenshot({ path: entrance2 })
  manifest.entrance = [
    { file: bios1, name: 'Entrada — BIOS', note: 'POST do computador, linha por linha, com as opções de ligar com som, ligar sem som e pular.' },
    { file: bios2, name: 'Entrada — BIOS em progresso', note: 'Sequência de inicialização avançando com a barra de progresso.' },
    { file: entrance1, name: 'Entrada — terminais', note: 'Escolha do canal de acesso.' },
    { file: entrance2, name: 'Entrada — cadastro', note: 'Formulário de convite e senha pessoal.' },
  ]
  await context.close()
  console.log('entrada ok')
}

/* ───────────────── 4. filtros de computador antigo ───────────────── */

{
  const modes = [
    { slug: 'fosforo', label: 'Fósforo verde' },
    { slug: 'ambar', label: 'Âmbar' },
    { slug: 'papel', label: 'Papel' },
    { slug: 'vhs', label: 'VHS' },
  ]
  for (const mode of modes) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem('system84-bios-v2', 'true')
        sessionStorage.setItem('system84-admitted', 'true')
        localStorage.setItem('system84-sound', 'off')
      } catch { /* opcional */ }
    })
    await page.goto(`${base}/#/filmes?loader=0&modo=${mode.slug}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1900)
    await page.addStyleTag({ content: FREEZE })
    await page.waitForTimeout(150)
    const target = page.locator('#filme-browser')
    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(250)
    const file = join(shots, `filtro-${mode.slug}.png`)
    await target.screenshot({ path: file })
    manifest.filters.push({ slug: mode.slug, name: `Modo de vídeo — ${mode.label}`, file })
    await context.close()
    console.log('filtro', mode.slug)
  }

  /* filtro extra forte: liga os oito efeitos de uma vez */
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('system84-bios-v2', 'true')
      sessionStorage.setItem('system84-admitted', 'true')
      localStorage.setItem('system84-sound', 'off')
    } catch { /* opcional */ }
  })
  await page.goto(`${base}/#/filmes?loader=0`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1900)
  const boost = page.locator('button.boost-filter')
  if (await boost.count()) {
    await boost.click()
    await page.waitForTimeout(900)
    await page.addStyleTag({ content: FREEZE })
    const target = page.locator('#filme-browser')
    await target.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    const file = join(shots, 'filtro-extremo.png')
    await target.screenshot({ path: file })
    manifest.filters.push({ slug: 'extremo', name: 'Modo de vídeo — Sinal extremo (filtro extra forte)', file })
    console.log('filtro extremo')
  }
  await context.close()
}

/* ───────────────── 5. responsivo ───────────────── */

for (const target of [{ route: '/#/', slug: 'capa' }, { route: '/#/filmes', slug: 'filmes' }]) {
  const result = await capturePage(target.route, `${target.slug}-mobile`, { width: 390, height: 844 })
  manifest.mobile.push({ ...target, ...result })
  console.log('mobile', target.route, result.slices.length)
}

await browser.close()
server.close()

await writeFile(join(work, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8')
console.log('ok:', manifest.pages.length, 'páginas,', manifest.loaders.length, 'loaders,', manifest.filters.length, 'filtros')
