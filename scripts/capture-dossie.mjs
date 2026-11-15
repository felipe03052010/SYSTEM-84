#!/usr/bin/env node
/**
 * Captura as páginas do dossier visual para conferência de fidelidade.
 * Uso: node scripts/capture-dossie.mjs
 * Saída: work/dossie-shots/*.png
 */
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/felip/AppData/Local/Temp/nodecli/node_modules/playwright-core')
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'

const root = process.argv[2] || '.'
const dist = join(root, 'dist')
const out = join(root, 'work/dossie-shots')
await mkdir(out, { recursive: true })

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
  } catch { /* index */ }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(await readFile(join(dist, 'index.html')))
})
await new Promise((resolve) => server.listen(4327, '127.0.0.1', resolve))
const base = 'http://127.0.0.1:4327'

const FREEZE = '*,*::before,*::after{animation:none !important;transition:none !important;caret-color:transparent !important}.route-content,.route-content.ready{opacity:1 !important;filter:none !important;transform:none !important;animation:none !important}'

const PAGES = [
  ['home', '/#/?loader=0'],
  ['filmes', '/#/filmes?loader=0'],
  ['livros', '/#/livros?loader=0'],
  ['lost-media', '/#/lost-media?loader=0'],
  ['pesquisa', '/#/pesquisa?q=dracula&loader=0'],
  ['comunidade', '/#/comunidade?loader=0'],
  ['obra', '/#/obra/5?loader=0'],
]

const browser = await chromium.launch({ executablePath: EDGE })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.8 })
await context.addInitScript(() => {
  sessionStorage.setItem('system84-bios-v2', 'true')
  sessionStorage.setItem('system84-admitted', 'true')
})

const page = await context.newPage()
for (const [name, path] of PAGES) {
  await page.goto(base + path, { waitUntil: 'networkidle' })
  const skip = await page.$('.bios-skip, [data-testid="bios-skip"]')
  if (skip) { await skip.click().catch(() => {}) ; await page.waitForTimeout(600) }
  await page.addStyleTag({ content: FREEZE + ',.route-content{animation:none !important;opacity:1 !important;filter:none !important}' })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: join(out, `${name}-top.png`) })
  await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }))
  await page.waitForTimeout(200)
  await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
  await page.evaluate(() => {
    const target = document.querySelector('.collection-copy, .hero-copy, .search-copy, .community-copy, .record-copy') || document.querySelector('.prancha-collection, .prancha-search, .prancha-record, .prancha-community')
    const top = target ? target.getBoundingClientRect().top + window.scrollY - 120 : 0
    const max = document.documentElement.scrollHeight - window.innerHeight
    const y = Math.max(0, Math.min(top, max))
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'
    window.scrollTo({ top: y, left: 0, behavior: 'instant' })
    document.documentElement.style.scrollBehavior = prev
  })
  await page.waitForTimeout(700)
  console.log('probe', name, await page.evaluate(() => {
    const grid = document.querySelector('.collection-grid, .hero-grid, .record-grid, .community-grid, .search-grid')
    const box = grid ? grid.getBoundingClientRect() : null
    const el = document.elementFromPoint(600, 400)
    return { y: window.scrollY, box: box && { top: Math.round(box.top), h: Math.round(box.height) }, at: el && el.tagName + '.' + (el.className || '').toString().slice(0, 50) }
  }))
  console.log('state', name, await page.evaluate(() => {
    const rc = document.querySelector('.route-content')
    const grid = document.querySelector('.collection-grid')
    const h1 = document.querySelector('h1')
    return {
      y: window.scrollY,
      rc: rc && getComputedStyle(rc).cssText.slice(0, 0) + getComputedStyle(rc).opacity + '|' + getComputedStyle(rc).transform + '|' + getComputedStyle(rc).filter,
      rcClass: rc && rc.className,
      gridTop: grid && Math.round(grid.getBoundingClientRect().top),
      h1: h1 && h1.textContent.slice(0, 20),
      h1Top: h1 && Math.round(h1.getBoundingClientRect().top),
      hit: (() => { const el = document.elementFromPoint(400, 300); return el ? el.tagName + '.' + (el.className||'').toString().slice(0,40) : null })(),
    }
  }))
  await page.screenshot({ path: join(out, `${name}-hero.png`) })
  console.log(name, 'scroll', await page.evaluate(() => ({ y: window.scrollY, probe: window.__probe, h: document.documentElement.scrollHeight })))
  await page.evaluate(() => window.scrollBy({ top: window.innerHeight - 60, behavior: 'instant' }))
  await page.waitForTimeout(400)
  await page.screenshot({ path: join(out, `${name}-catalogue.png`) })
  console.log('ok', name)
}

// mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true })
await mobile.addInitScript(() => {
  sessionStorage.setItem('system84-bios-v2', 'true')
  sessionStorage.setItem('system84-admitted', 'true')
})
const mpage = await mobile.newPage()
await mpage.goto(base + '/#/?loader=0', { waitUntil: 'networkidle' })
await mpage.addStyleTag({ content: FREEZE })
await mpage.waitForTimeout(1200)
await mpage.screenshot({ path: join(out, 'mobile-home.png'), fullPage: true })
console.log('ok mobile')

await browser.close()
server.close()
