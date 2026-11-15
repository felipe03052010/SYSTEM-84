#!/usr/bin/env node
/**
 * Monta o catálogo visual do SYSTEM 84: um PDF 1440×900 (formato de slide, que
 * o Canva abre como apresentação) com TODAS as telas do site, capturadas de
 * verdade num navegador:
 *
 *   capa · sumário · sistema visual (cores, tipografia, componentes)
 *   cada página, quadro a quadro · cada tela de carregamento, quadro a quadro
 *   entrada (BIOS, terminais, cadastro) · filtros de computador antigo · mobile
 *
 * Uso: node scripts/build-catalogo-visual.mjs
 * Saída: canva/system84-catalogo-visual.html  →  PDF pelo deck_export_pdf
 */
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, basename } from 'node:path'

const root = process.argv[2] || '.'
const shotsDir = join(root, 'work/site-capture/clean')
const out = join(root, 'canva/system84-catalogo-visual.html')

if (!existsSync(shotsDir)) {
  console.error('faltam as capturas em', shotsDir)
  process.exit(1)
}

const shots = new Set(await readdir(shotsDir))
const img = (name) => {
  if (!shots.has(name)) return null
  return `file:///${join(shotsDir, name).replace(/\\/g, '/')}`
}
const dataUri = async (name) => {
  if (!shots.has(name)) return null
  const buffer = await readFile(join(shotsDir, name))
  return `data:image/png;base64,${buffer.toString('base64')}`
}

/* ─────────────────────── o que existe no site ─────────────────────── */

const SECTIONS = [
  {
    group: 'Páginas',
    items: [
      { slug: 'capa', name: 'Capa — Estação', route: '/', frames: 4, note: 'Herói "MEMÓRIA FORA DO TEMPO.", objeto óptico de 512 px, fita ácida de categorias (ASSISTIR · LER · DESCOBRIR · PRESERVAR), acervo em destaque com filtros, frequências perdidas, canal aberto, console de busca e rodapé.' },
      { slug: 'filmes', name: 'Filmes', route: '/filmes', frames: 8, note: 'Cabeçalho de diretório, painel de status, console de filtros (período, década, ordem), modo de vídeo, efeitos de tela e grade de 22 cartões.' },
      { slug: 'series', name: 'Séries', route: '/series', frames: 3, note: 'Mesma estrutura, 5 seriados.' },
      { slug: 'livros', name: 'Livros', route: '/livros', frames: 17, note: '63 livros em domínio público, com leitor interno.' },
      { slug: 'lost-media', name: 'Lost media', route: '/lost-media', frames: 8, note: '22 dossiês de obras perdidas, com estado de recuperação.' },
      { slug: 'pesquisa', name: 'Pesquisa', route: '/pesquisa?q=dracula', frames: 2, note: 'Busca global; aqui procurando "dracula".' },
      { slug: 'comunidade', name: 'Comunidade — BBS', route: '/comunidade', frames: 2, note: 'Canais do quadro de avisos, painel de conexão 2400 baud e fila de envios.' },
      { slug: 'obra-2', name: 'Ficha de obra — Metropolis', route: '/obra/2', frames: 2, note: 'Capa, player, ficha técnica, procedência e fontes.' },
      { slug: 'obra-505', name: 'Ficha de obra — acervo internacional', route: '/obra/505', frames: 2, note: 'Registro do acervo estrangeiro, mídia lida direto da fonte pública.' },
      { slug: 'admin', name: 'Administração', route: '/admin-financeiro', frames: 1, note: 'Área restrita: pede credenciais antes de mostrar qualquer coisa.' },
      { slug: '404', name: 'Página não encontrada', route: '/rota-inexistente', frames: 2, note: 'Rota inexistente, na mesma linguagem do resto.' },
    ],
  },
]

const LOADERS = [
  { kind: 'post', route: '/', label: 'LIGANDO TERMINAL', detail: 'POST · memória 640K OK', sound: 'energia', ms: 900, art: 'linhas de POST descendo, cursor piscando' },
  { kind: 'tape', route: '/filmes', label: 'ALINHANDO FOTOGRAMAS', detail: 'DECK VHS · TRACKING', sound: 'fita', ms: 1100, art: 'dois carretéis tracejados e barras de tracking' },
  { kind: 'static', route: '/series', label: 'SINTONIZANDO CANAIS', detail: 'ANTENA · CANAL 84', sound: 'estática', ms: 950, art: 'chuvisco de antena com linha de varredura' },
  { kind: 'floppy', route: '/livros', label: 'LENDO DISQUETE', detail: 'DISCO A: · 1.44 MB', sound: 'disquete', ms: 1000, art: 'disquete com obturador e blocos de leitura' },
  { kind: 'modem', route: '/pesquisa', label: 'CONECTANDO MODEM', detail: 'ATDT 084-1984', sound: 'modem', ms: 1150, art: 'quatro luzes de modem e onda de linha' },
  { kind: 'disk', route: '/lost-media', label: 'RECUPERANDO FRAGMENTOS', detail: 'SETOR 84 · SETORES RUINS', sound: 'erro de disco', ms: 1200, art: 'grade de 24 setores sendo recuperados' },
  { kind: 'bulletin', route: '/comunidade', label: 'ENTRANDO NO BBS', detail: 'NÓ 84 · 2400 BAUD', sound: 'modem', ms: 1000, art: 'linhas de quadro de avisos e cursor' },
  { kind: 'scan', route: '/admin-financeiro', label: 'VERIFICANDO CREDENCIAIS', detail: 'ACESSO RESTRITO', sound: 'disquete', ms: 800, art: 'barra de varredura' },
]

const FILTERS = [
  { slug: 'fosforo', name: 'Fósforo verde', note: 'Modo padrão: saturação 1,45, contraste 1,14, halo verde no texto.' },
  { slug: 'ambar', name: 'Âmbar', note: 'Sepia + rotação de matiz: o fósforo âmbar dos monitores de 1980.' },
  { slug: 'papel', name: 'Papel', note: 'Preto e branco com contraste 1,6: leitura de arquivo impresso.' },
  { slug: 'vhs', name: 'VHS', note: 'Aberração RGB, faixa de tracking correndo e saturação 2,1.' },
  { slug: 'extremo', name: 'Sinal extremo', note: 'O botão "⚡ FILTRO EXTRA FORTE": liga os oito efeitos de uma vez — varredura, curvatura, ruído, cintilação, sangramento de cor, rasgo de sincronia, persiana e o modo extremo.' },
]

const PALETTE = [
  { token: '--fig-acid', hex: '#A8FF60', name: 'Verde ácido', use: 'Destaque, rótulos, CTA primário' },
  { token: '--fig-paper', hex: '#EBEDDF', name: 'Papel', use: 'Títulos e texto forte' },
  { token: '--fig-muted', hex: '#9CAA9D', name: 'Cinza-esverdeado', use: 'Texto corrido' },
  { token: '--fig-void', hex: '#090D0B', name: 'Vazio', use: 'Fundo' },
  { token: '--fig-panel', hex: '#101813', name: 'Painel', use: 'Painéis e capas' },
  { token: '--fig-line', hex: '#344638', name: 'Linha', use: 'Bordas de 1 px' },
  { token: '--fig-ember', hex: '#FF6332', name: 'Brasa', use: 'Alerta e figura' },
]

const TYPE = [
  { family: 'Syncopate 700', size: '64 / 60 px', use: 'Títulos de página e herói', sample: 'MEMÓRIA' },
  { family: 'Space Grotesk', size: '20 / 29 px', use: 'Corpo de texto', sample: 'Cinema, literatura e fragmentos fora de órbita.' },
  { family: 'IBM Plex Mono', size: '12 / 17 px', use: 'Rótulos, botões, dados', sample: 'ARQUIVO CULTURAL / VOL. 084' },
  { family: 'VT323', size: '96–240 px', use: 'Números gigantes', sample: '84' },
]

/* ─────────────────────────── montagem ─────────────────────────── */

const pages = []

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const cover = async () => {
  const hero = await dataUri('page-capa-01.png')
  pages.push(`
  <section class="slide cover">
    <img class="cover-bg" src="${hero}" alt="">
    <div class="cover-veil"></div>
    <div class="cover-content">
      <span class="kicker">SYSTEM 84 / CATÁLOGO VISUAL / VOL. 084</span>
      <h1>TUDO O QUE<br>SE VÊ<br>NO SITE.</h1>
      <p>Cada página, cada quadro de cada tela de carregamento, cada filtro de computador antigo e a versão de celular — capturados no navegador, um por um.</p>
      <div class="cover-meta">
        <span><b>11</b> páginas</span>
        <span><b>8</b> telas de carregamento × 4 quadros</span>
        <span><b>5</b> filtros de vídeo</span>
        <span><b>4</b> telas de entrada</span>
      </div>
    </div>
  </section>`)
}

const index = () => {
  const rows = []
  for (const section of SECTIONS) {
    rows.push(`<div class="idx-group">${esc(section.group)}</div>`)
    for (const item of section.items) {
      rows.push(`<div class="idx-row"><span class="idx-name">${esc(item.name)}</span><span class="idx-route">${esc(item.route)}</span><span class="idx-count">${item.frames} quadro${item.frames > 1 ? 's' : ''}</span></div>`)
    }
  }
  rows.push(`<div class="idx-group">Telas de carregamento (4 quadros cada)</div>`)
  for (const loader of LOADERS) {
    rows.push(`<div class="idx-row"><span class="idx-name">${esc(loader.label)}</span><span class="idx-route">${esc(loader.route)}</span><span class="idx-count">${loader.ms} ms</span></div>`)
  }
  rows.push(`<div class="idx-group">Filtros de computador antigo</div>`)
  for (const filter of FILTERS) {
    rows.push(`<div class="idx-row"><span class="idx-name">${esc(filter.name)}</span><span class="idx-route">modo de vídeo</span><span class="idx-count">1 quadro</span></div>`)
  }
  rows.push(`<div class="idx-group">Entrada e celular</div>`)
  rows.push(`<div class="idx-row"><span class="idx-name">BIOS, terminais e cadastro</span><span class="idx-route">/</span><span class="idx-count">4 quadros</span></div>`)
  rows.push(`<div class="idx-row"><span class="idx-name">Capa e Filmes no celular</span><span class="idx-route">390 × 844</span><span class="idx-count">27 quadros</span></div>`)

  pages.push(`
  <section class="slide">
    <header class="slide-head"><span>SUMÁRIO</span><span>CATÁLOGO VISUAL / SYSTEM 84</span></header>
    <h2 class="slide-title">O que está neste documento.</h2>
    <div class="idx">${rows.join('')}</div>
  </section>`)
}

const identity = () => {
  pages.push(`
  <section class="slide">
    <header class="slide-head"><span>SISTEMA VISUAL</span><span>01 / COR</span></header>
    <h2 class="slide-title">Sete cores, nenhuma inventada.</h2>
    <p class="slide-lead">Toda a paleta vem do arquivo do Figma "SYSTEM 84 — Identidade &amp; Web" (Homepage Desktop). O site inteiro usa só estas.</p>
    <div class="swatches">
      ${PALETTE.map((color) => `
        <div class="swatch">
          <div class="swatch-chip" style="background:${color.hex}"></div>
          <div class="swatch-name">${esc(color.name)}</div>
          <div class="swatch-hex">${color.hex}</div>
          <div class="swatch-token">${esc(color.token)}</div>
          <div class="swatch-use">${esc(color.use)}</div>
        </div>`).join('')}
    </div>
  </section>`)

  pages.push(`
  <section class="slide">
    <header class="slide-head"><span>SISTEMA VISUAL</span><span>02 / TIPOGRAFIA</span></header>
    <h2 class="slide-title">Quatro fontes, quatro trabalhos.</h2>
    <div class="types">
      ${TYPE.map((type) => `
        <div class="type">
          <div class="type-meta"><b>${esc(type.family)}</b><span>${esc(type.size)}</span></div>
          <div class="type-sample">${esc(type.sample)}</div>
          <div class="type-use">${esc(type.use)}</div>
        </div>`).join('')}
    </div>
    <p class="slide-foot">Botões têm 48 px de altura, borda de 1 px em #344638 e cantos retos. Cartões usam capa 310×350 sobre #101813 com título Syncopate 20/21.</p>
  </section>`)
}

const pageSections = async () => {
  for (const section of SECTIONS) {
    for (const item of section.items) {
      const frames = []
      for (let i = 1; i <= item.frames; i += 1) {
        const name = `page-${item.slug}-${String(i).padStart(2, '0')}.png`
        const uri = await dataUri(name)
        if (uri) frames.push(uri)
      }
      if (!frames.length) continue

      pages.push(`
      <section class="slide">
        <header class="slide-head"><span>PÁGINA</span><span>${esc(item.route)}</span></header>
        <h2 class="slide-title small">${esc(item.name)}</h2>
        <p class="slide-lead">${esc(item.note)}</p>
        <div class="frames pages">
          ${frames.map((uri, index) => `
            <figure class="frame">
              <img src="${uri}" alt="">
              <figcaption>${index + 1} / ${frames.length}</figcaption>
            </figure>`).join('')}
        </div>
      </section>`)
    }
  }
}

const loaderSections = async () => {
  for (const loader of LOADERS) {
    const frames = []
    for (let i = 1; i <= 4; i += 1) {
      const uri = await dataUri(`loader-${loader.kind}-${i}.png`)
      if (uri) frames.push(uri)
    }
    if (!frames.length) continue

    pages.push(`
    <section class="slide">
      <header class="slide-head"><span>CARREGAMENTO</span><span>${esc(loader.route)}</span></header>
      <h2 class="slide-title small">${esc(loader.label)}</h2>
      <p class="slide-lead">${esc(loader.detail)} · ${loader.ms} ms · som de ${esc(loader.sound)} · ${esc(loader.art)}</p>
      <div class="frames quad">
        ${frames.map((uri, index) => `
          <figure class="frame">
            <img src="${uri}" alt="">
            <figcaption>quadro ${index + 1}</figcaption>
          </figure>`).join('')}
      </div>
    </section>`)
  }
}

const entranceSections = async () => {
  const pairs = [
    ['entrada-01-bios.png', 'entrada-02-bios.png', 'Entrada — BIOS', 'POST do computador, linha por linha: CPU i486 DX2 @ 66MHz, teste de memória 640K/16384K, disco ARCHIVE_84, adaptador VGA/CRT e montagem dos volumes. À esquerda, o quadro antes de ligar, com 11%; à direita, a sequência já em 78%.', 'BIOS / 2 quadros'],
    ['entrada-03b-terminais.png', 'entrada-04b-form.png', 'Entrada — terminais e cadastro', 'Três canais: CRIADOR, ADMINISTRADOR e ASSINAR O ARQUIVO (R$ 15/mês por Pix). Ao escolher um terminal, abre o painel do canal com o formulário de convite e senha pessoal.', 'ACESSO / 2 quadros'],
  ]
  for (const [a, b, title, note, tag] of pairs) {
    const left = await dataUri(a)
    const right = await dataUri(b)
    if (!left || !right) continue
    pages.push(`
    <section class="slide">
      <header class="slide-head"><span>ENTRADA</span><span>${esc(tag)}</span></header>
      <h2 class="slide-title small">${esc(title)}</h2>
      <p class="slide-lead">${esc(note)}</p>
      <div class="frames half">
        <figure class="frame"><img src="${left}" alt=""></figure>
        <figure class="frame"><img src="${right}" alt=""></figure>
      </div>
    </section>`)
  }
}

const filterSections = async () => {
  for (const filter of FILTERS) {
    const uri = await dataUri(`filtro-${filter.slug}.png`)
    if (!uri) continue
    pages.push(`
    <section class="slide">
      <header class="slide-head"><span>FILTRO DE COMPUTADOR ANTIGO</span><span>${esc(filter.name)}</span></header>
      <h2 class="slide-title small">${esc(filter.name)}</h2>
      <p class="slide-lead">${esc(filter.note)}</p>
      <div class="frames tall">
        <figure class="frame"><img src="${uri}" alt=""></figure>
      </div>
    </section>`)
  }
}

const mobileSections = async () => {
  for (const [slug, name, total] of [['capa', 'Capa no celular', 8], ['filmes', 'Filmes no celular', 19]]) {
    const frames = []
    for (let i = 1; i <= total; i += 1) {
      const uri = await dataUri(`mobile-${slug}-${String(i).padStart(2, '0')}.png`)
      if (uri) frames.push(uri)
    }
    if (!frames.length) continue
    const chunks = []
    for (let i = 0; i < frames.length; i += 6) chunks.push(frames.slice(i, i + 6))
    for (const [index, chunk] of chunks.entries()) {
      pages.push(`
      <section class="slide">
        <header class="slide-head"><span>RESPONSIVO · 390 × 844</span><span>${esc(name)}</span></header>
        <h2 class="slide-title small">${esc(name)}${chunks.length > 1 ? ` — parte ${index + 1}` : ''}</h2>
        <p class="slide-lead">O mesmo conteúdo reordenado em uma coluna: cabeçalho compacto, fita de categorias em pilha e cartões de largura inteira.</p>
        <div class="frames phones">
          ${chunk.map((uri, i) => `<figure class="frame phone"><img src="${uri}" alt=""><figcaption>${index * 6 + i + 1}</figcaption></figure>`).join('')}
        </div>
      </section>`)
    }
  }
}

const closing = () => {
  pages.push(`
  <section class="slide closing">
    <span class="kicker">FIM DO CATÁLOGO</span>
    <h1>112 REGISTROS.<br>UM SINAL.</h1>
    <p>22 filmes, 5 séries, 63 livros e 22 lost media — todos apontando para a fonte pública original (Project Gutenberg, Gutenberg Australia, Internet Archive, Wikimedia Commons, Wikisource). Nenhum conteúdo gerado por IA.</p>
    <div class="closing-line"></div>
    <span class="closing-foot">SYSTEM 84 · ARQUIVO CULTURAL INDEPENDENTE · VOL. 084</span>
  </section>`)
}

await cover()
index()
identity()
await pageSections()
await loaderSections()
await entranceSections()
await filterSections()
await mobileSections()
closing()

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>SYSTEM 84 — Catálogo visual</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Syncopate:wght@400;700&family=VT323&display=swap');

  @page { size: 1440px 900px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #090d0b; }
  body { font-family: 'Space Grotesk', sans-serif; color: #ebeddf; -webkit-font-smoothing: antialiased; }

  .slide {
    position: relative;
    width: 1440px;
    height: 900px;
    padding: 48px 56px 40px;
    background: #090d0b;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 18px;
    break-after: page;
    page-break-after: always;
  }

  .slide-head {
    display: flex;
    justify-content: space-between;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #9caa9d;
    border-bottom: 1px solid #344638;
    padding-bottom: 14px;
  }

  .slide-head span:last-child { color: #a8ff60; }

  .slide-title {
    font-family: 'Syncopate', sans-serif;
    font-weight: 700;
    font-size: 40px;
    line-height: 1.1;
    letter-spacing: -0.01em;
    color: #ebeddf;
  }

  .slide-title.small { font-size: 28px; }

  .slide-lead {
    max-width: 1100px;
    font-size: 16px;
    line-height: 1.55;
    color: #9caa9d;
  }

  .slide-foot {
    margin-top: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    color: #9caa9d;
    border-top: 1px solid #344638;
    padding-top: 12px;
  }

  /* capa */
  .cover { padding: 0; justify-content: flex-end; background: #090d0b; }
  .cover-bg { position: absolute; inset: 0; width: 1440px; height: 900px; object-fit: cover; opacity: 0.26; }
  .cover-veil { position: absolute; inset: 0; background: linear-gradient(100deg, #090d0b 30%, rgba(9,13,11,0.94) 55%, rgba(9,13,11,0.7) 100%); }
  .cover-content { position: relative; padding: 0 56px 64px; display: flex; flex-direction: column; gap: 22px; }
  .kicker { font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: #a8ff60; text-transform: uppercase; }
  .cover h1 { font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 74px; line-height: 1.02; letter-spacing: -0.02em; }
  .cover p { max-width: 640px; font-size: 18px; line-height: 1.6; color: #9caa9d; }
  .cover-meta { display: flex; gap: 34px; margin-top: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.08em; color: #9caa9d; text-transform: uppercase; }
  .cover-meta b { color: #a8ff60; font-size: 22px; margin-right: 8px; }

  /* sumário */
  .idx { columns: 2; column-gap: 48px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
  .idx-group { break-after: avoid; margin: 14px 0 6px; color: #a8ff60; letter-spacing: 0.14em; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #344638; padding-bottom: 4px; }
  .idx-row { display: flex; gap: 12px; align-items: baseline; padding: 4px 0; border-bottom: 1px dotted #22301f; }
  .idx-name { flex: 1; color: #ebeddf; }
  .idx-route { color: #6f8272; font-size: 10px; }
  .idx-count { color: #a8ff60; font-size: 10px; white-space: nowrap; }

  /* cores */
  .swatches { display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; margin-top: 6px; }
  .swatch { display: flex; flex-direction: column; gap: 6px; }
  .swatch-chip { height: 150px; border: 1px solid #344638; }
  .swatch-name { font-size: 14px; color: #ebeddf; }
  .swatch-hex { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #a8ff60; }
  .swatch-token { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: #6f8272; }
  .swatch-use { font-size: 11px; color: #9caa9d; line-height: 1.4; }

  /* tipografia */
  .types { display: flex; flex-direction: column; gap: 16px; }
  .type { border-top: 1px solid #344638; padding-top: 12px; }
  .type-meta { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #9caa9d; letter-spacing: 0.1em; text-transform: uppercase; }
  .type-meta b { color: #a8ff60; font-weight: 500; }
  .type-sample { font-size: 34px; line-height: 1.2; color: #ebeddf; margin: 6px 0; }
  .type:nth-child(1) .type-sample { font-family: 'Syncopate', sans-serif; font-weight: 700; }
  .type:nth-child(2) .type-sample { font-family: 'Space Grotesk', sans-serif; font-size: 26px; }
  .type:nth-child(3) .type-sample { font-family: 'IBM Plex Mono', monospace; font-size: 22px; }
  .type:nth-child(4) .type-sample { font-family: 'VT323', monospace; font-size: 64px; color: #a8ff60; }
  .type-use { font-size: 12px; color: #6f8272; }

  /* quadros */
  .frames { flex: 1; display: grid; gap: 14px; min-height: 0; }
  .frames { grid-template-columns: repeat(2, 1fr); align-content: start; }
  .frames.quad { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 1fr; }
  .frames.half { grid-template-columns: repeat(2, 1fr); align-items: start; }
  .frames.tall { grid-template-columns: 1fr; }
  .frames.phones { grid-template-columns: repeat(6, 1fr); align-items: start; }

  .frame { position: relative; border: 1px solid #344638; background: #101813; overflow: hidden; }
  .frame img { display: block; width: 100%; height: auto; }
  .frames.pages { grid-template-columns: repeat(2, 1fr); align-content: start; }
  .frames.pages .frame img { width: 100%; height: auto; }
  .frames.pages .frame { border-color: #2a3a2e; }
  .frame figcaption {
    position: absolute; right: 8px; bottom: 8px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
    color: #a8ff60; background: rgba(9,13,11,0.82); padding: 3px 7px; border: 1px solid #344638;
  }
  .frames.quad .frame { background: #060a08; overflow: hidden; position: relative; }
  .frames.quad .frame img {
    position: absolute;
    width: 186%;
    height: auto;
    left: -43%;
    top: 50%;
    transform: translateY(-50%);
  }
  .frames.tall .frame img { max-height: 640px; width: auto; margin: 0 auto; }
  .frames.tall .frame { display: flex; justify-content: center; background: #060a08; }
  .frame.phone figcaption { right: 4px; bottom: 4px; font-size: 9px; padding: 2px 5px; }

  /* fecho */
  .closing { justify-content: center; gap: 26px; }
  .closing h1 { font-family: 'Syncopate', sans-serif; font-weight: 700; font-size: 64px; line-height: 1.05; }
  .closing p { max-width: 760px; font-size: 17px; line-height: 1.65; color: #9caa9d; }
  .closing-line { width: 100%; height: 1px; background: #344638; }
  .closing-foot { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.16em; color: #a8ff60; }
</style>
</head>
<body>
${pages.join('\n')}
</body>
</html>`

await writeFile(out, html, 'utf8')
console.log('html:', out, '·', pages.length, 'slides')
