#!/usr/bin/env node
/**
 * Monta o catálogo completo do SYSTEM 84 como UM único PDF, em páginas
 * 1440×900 (16:10, formato de slide — o Canva importa cada página como uma
 * página própria), no desenho do Figma (node 2:28).
 *
 * Estrutura:
 *   capa · índice · faixa de tipos · fichas ilustradas · listas por tipo ·
 *   ficha técnica (fontes e licenças)
 *
 * Uso: node scripts/build-canva-pdf.mjs .
 * Saída: canva/system84-acervo-completo.pdf (+ o HTML que o gerou)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] || '.'
const workDir = join(root, 'work/canva-pdf')
const outDir = join(root, 'canva')
mkdirSync(workDir, { recursive: true })
mkdirSync(outDir, { recursive: true })

const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const expansionSource = readFileSync(join(root, 'src/data/expansion.js'), 'utf8')
const expansion = new Function(
  `return ${expansionSource.replace(/^[\s\S]*?export const expansion\s*=\s*/, '').replace(/\n\s*$/, '')}`,
)()
const all = [...catalog, ...expansion]

const TYPE_LABEL = { filme: 'Filme', serie: 'Série', série: 'Série', livro: 'Livro', 'lost-media': 'Lost media' }
const labelOf = (record) => TYPE_LABEL[record.type] || record.type
const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
const pad = (n, size = 3) => String(n).padStart(size, '0')

/* Título em até duas linhas, sem cortar palavra. */
function wrap(text, max) {
  const words = String(text).split(/\s+/)
  const lines = ['']
  words.forEach((word) => {
    const current = lines[lines.length - 1]
    if (!current.length) lines[lines.length - 1] = word
    else if (`${current} ${word}`.length <= max) lines[lines.length - 1] = `${current} ${word}`
    else if (lines.length < 3) lines.push(word)
    else lines[2] = `${lines[2]} ${word}`
  })
  return lines
}

/* Título da ficha: até 3 linhas de 15 caracteres. Se passar, o excedente é
   cortado e a ficha mostra o título completo no texto da descrição. */
const cardTitle = (record) => {
  const title = String(record.title)
  if (title.length <= 45) return title
  const cut = title.slice(0, 45)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 15 ? cut.lastIndexOf(' ') : 45)}…`
}

const shortLabel = (record) => {
  const label = labelOf(record)
  return label === 'Lost media' ? 'LOST' : label.slice(0, 4).toUpperCase()
}

const byType = (type) => all.filter((record) => record.type === type || (type === 'serie' && record.type === 'série'))
const films = byType('filme')
const series = byType('serie')
const books = byType('livro')
const lost = byType('lost-media')
const groups = [
  { label: 'FILMES', records: films },
  { label: 'SÉRIES', records: series },
  { label: 'LIVROS', records: books },
  { label: 'LOST MEDIA', records: lost },
]

/* Ordem de leitura do índice: cronológica, como um arquivo. */
const indexOrder = [...all].sort((a, b) => (a.year || 9999) - (b.year || 9999) || a.title.localeCompare(b.title, 'pt-BR'))

const sourceOf = (record) => (record.sources && record.sources[0]) || null
const mediaOf = (record) => (record.media && record.media[0]) || null

const pages = []
const page = (html, cls = '') => pages.push(`<section class="page ${cls}">${html}</section>`)

/* ─────────────────────────── capa ─────────────────────────── */
const total = all.length
page(
  `
  <div class="pad cover-top">
    <span class="label">ARQUIVO CULTURAL INDEPENDENTE / VOL. 084</span>
    <span class="label">SISTEMA ONLINE <span style="color:#A8FF60">■</span></span>
  </div>
  <div class="cover-main pad" style="padding-top:0;padding-bottom:0">
    <div>
      <h1>MEMÓRIA<br>FORA DO<br>TEMPO.</h1>
      <p>Cinema, literatura e fragmentos fora de órbita.<br>Um arquivo vivo para tudo que merece continuar existindo.</p>
    </div>
    <figure class="optical">
      <div class="rings"></div>
      <div class="arc"></div>
      <div class="node"></div>
      <div class="ring2"></div>
    </figure>
  </div>
  <div class="pad cover-foot">
    <span>FIG. 084 — MEMÓRIA EM TRANSMISSÃO</span>
    <span>${pad(total)} REGISTROS / ${pad(films.length, 2)} FILMES / ${pad(books.length, 2)} LIVROS</span>
    <span>SYSTEM 84 © 2026</span>
  </div>
  `,
  'cover',
)

/* ───────────────────────── índice (2 páginas) ───────────────── */
const PER_PAGE_TOC = 32
const tocPages = Math.ceil(indexOrder.length / PER_PAGE_TOC)
for (let i = 0; i < tocPages; i += 1) {
  const slice = indexOrder.slice(i * PER_PAGE_TOC, (i + 1) * PER_PAGE_TOC)
  const half = Math.ceil(slice.length / 2)
  const column = (items) =>
    items
      .map(
        (record) =>
          `<div class="toc-row"><span class="n mono">${pad(record.id)}</span><span class="t">${wrap(record.title, 34).map(esc).join('<br>')}</span><span class="y mono">${shortLabel(record)}<br>${record.year || 'S/D'}</span></div>`,
      )
      .join('')
  page(`
    <div class="pad wrap">
      <div class="head">
        <span class="label">ÍNDICE / ${pad(i + 1, 2)} DE ${pad(tocPages, 2)}</span>
        <span class="label">${pad(total)} REGISTROS</span>
      </div>
      <h2 class="section">Tudo que o arquivo guarda.</h2>
      <div class="toc-grid">
        <div>${column(slice.slice(0, half))}</div>
        <div>${column(slice.slice(half))}</div>
      </div>
      <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
    </div>
  `)
}

/* ───────────────── faixa de tipos + números ───────────────── */
page(
  `
  <div class="strip mono">
    <span style="font-size:16px">ASSISTIR ↗</span>
    <span style="font-size:16px">LER ↗</span>
    <span style="font-size:16px">DESCOBRIR ↗</span>
    <span style="font-size:16px">PRESERVAR ↗</span>
  </div>
  <div class="pad wrap" style="justify-content:center">
    <span class="label">01 / ACERVO EM DESTAQUE</span>
    <h2 class="section" style="margin-top:16px">Memórias em circulação.</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:40px">
      ${groups
        .map(
          (group) => `<div class="stat"><b>${pad(group.records.length, 3)}</b><span>${group.label}</span></div>`,
        )
        .join('')}
    </div>
    <p style="margin-top:40px;font-family:'Space Grotesk',sans-serif;font-size:20px;line-height:1.5;color:#9CAA9D;max-width:900px">
      Todo registro deste catálogo aponta para uma fonte pública conhecida — Project Gutenberg,
      Gutenberg Austrália, Internet Archive, Wikimedia Commons ou Wikisource — com a licença
      declarada. Nada aqui foi gerado por inteligência artificial.
    </p>
    <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
  </div>
  `,
)

/* ───────────────────── fichas ilustradas ───────────────────── */
const PER_SHEET = 6
for (const group of groups) {
  const records = group.records
  const sheets = Math.max(1, Math.ceil(records.length / PER_SHEET))
  for (let s = 0; s < sheets; s += 1) {
    const slice = records.slice(s * PER_SHEET, (s + 1) * PER_SHEET)
    if (!slice.length) continue
    page(`
      <div class="pad wrap">
        <div class="head">
          <span class="label">FICHAS / ${group.label}</span>
          <span class="label">${pad(s + 1, 2)} DE ${pad(sheets, 2)} · ${pad(records.length, 2)} REGISTROS</span>
        </div>
        <div class="sheet">
          ${slice
            .map(
              (record) => `
            <article class="card">
              <div class="card-cover">
                <span class="rings"></span><span class="arc"></span><span class="ring2"></span>
              </div>
              <div class="card-body">
                <span class="card-meta">${esc(labelOf(record).toUpperCase())} / ${record.year || 'S/D'}</span>
                <h3>${wrap(cardTitle(record), 15).map(esc).join('<br>')}</h3>
                <p class="desc">${esc((record.description || '').slice(0, 118))}${(record.description || '').length > 108 ? '…' : ''}</p>
                <span class="tags">${(record.tags || []).slice(0, 3).map((tag) => esc(String(tag).slice(0, 22))).join(' · ')}</span>
                <span class="src">${esc(record.code || '')}${sourceOf(record) ? ` · ${esc((sourceOf(record).url.match(/^https?:\/\/([^/]+)/) || [, sourceOf(record).url])[1])}` : ''}</span>
              </div>
            </article>`,
            )
            .join('')}
        </div>
        <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
      </div>
    `)
  }
}

/* ─────────────────── listas completas por tipo ─────────────── */
const ROWS_PER_PAGE = 20
for (const group of groups) {
  const rows = [...group.records].sort((a, b) => (a.year || 9999) - (b.year || 9999))
  const parts = Math.ceil(rows.length / ROWS_PER_PAGE)
  for (let p = 0; p < parts; p += 1) {
    const slice = rows.slice(p * ROWS_PER_PAGE, (p + 1) * ROWS_PER_PAGE)
    page(`
      <div class="pad wrap">
        <div class="head">
          <span class="label">LISTA COMPLETA / ${group.label}</span>
          <span class="label">${pad(p + 1, 2)} DE ${pad(parts, 2)}</span>
        </div>
        <div>
          ${slice
            .map(
              (record) => `<div class="list-row">
                <span class="n mono">${pad(record.id)}</span>
                <span class="t">${wrap(record.title, 96).map(esc).join(' ')}</span>
                <span class="y mono">${record.year || 'S/D'}</span>
                <span class="c mono">${esc(record.code || '')}</span>
              </div>`,
            )
            .join('')}
        </div>
        <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
      </div>
    `)
  }
}

/* ─────────────── frequências perdidas + ficha técnica ─────────────── */
const sources = new Map()
all.forEach((record) => {
  const source = sourceOf(record)
  if (!source) return
  const host = (source.url.match(/^https?:\/\/([^/]+)/) || [, ''])[1]
  sources.set(host, (sources.get(host) || 0) + 1)
})
const licenseCount = new Map()
all.forEach((record) => {
  const media = mediaOf(record)
  const key = (media && media.license) || record.rightsNote || 'Sem nota'
  licenseCount.set(key, (licenseCount.get(key) || 0) + 1)
})

page(`
  <div class="pad wrap">
    <span class="label label-ember">02 / FREQUÊNCIAS PERDIDAS</span>
    <h2 class="section" style="margin-top:16px;font-family:'Syncopate',sans-serif;text-transform:uppercase;font-size:64px">NEM TUDO<br>DESAPARECE<br>POR COMPLETO.</h2>
    <p style="margin-top:20px;font-family:'Space Grotesk',sans-serif;font-size:20px;color:#9CAA9D">Rastreie fragmentos. Cruze fontes. Reconstrua a história.</p>
    <div style="display:flex;gap:64px;margin-top:40px;align-items:center">
      <span style="font-family:'VT323',monospace;font-size:160px;line-height:1;color:#FF6332">[ ? ]</span>
      <div>
        <span class="label">SINAL NÃO IDENTIFICADO</span><br>
        <span class="label">AGUARDANDO NOVAS PISTAS_</span>
      </div>
      <div class="stat" style="margin-left:auto"><b>${pad(lost.length, 2)}</b><span>DOSSIÊS ABERTOS</span></div>
    </div>
    <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
  </div>
`)

page(`
  <div class="pad wrap">
    <span class="label">03 / PROCEDÊNCIA</span>
    <h2 class="section" style="margin-top:16px">De onde vem cada registro.</h2>
    <div class="two-col" style="margin-top:32px">
      <div>
        <span class="label" style="display:block;margin-bottom:12px">HOSTS DAS FONTES</span>
        ${[...sources.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(
            ([host, count]) =>
              `<div class="list-row"><span class="t">${esc(host)}</span><span class="y mono">${pad(count, 2)}</span></div>`,
          )
          .join('')}
      </div>
      <div>
        <span class="label" style="display:block;margin-bottom:12px">LICENÇAS DECLARADAS</span>
        ${[...licenseCount.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(
            ([license, count]) =>
              `<div class="list-row"><span class="t" style="font-size:13px">${esc(license.slice(0, 70))}${license.length > 70 ? '…' : ''}</span><span class="y mono">${pad(count, 2)}</span></div>`,
          )
          .join('')}
      </div>
    </div>
    <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
  </div>
`)

page(`
  <div class="pad wrap" style="justify-content:center;align-items:center;text-align:center">
    <span class="label">SYSTEM 84 / VOL. 084</span>
    <h2 class="section" style="margin-top:24px;font-family:'Syncopate',sans-serif;text-transform:uppercase">Toda memória<br>precisa de alguém.</h2>
    <p style="margin-top:24px;font-family:'Space Grotesk',sans-serif;font-size:22px;color:#9CAA9D;max-width:760px">
      Compartilhe descobertas, documente pistas e encontre outras pessoas na mesma frequência.
    </p>
    <div style="margin-top:48px;display:flex;gap:16px">
      <span class="strip mono" style="padding:16px 24px;font-size:13px">ENTRAR NA COMUNIDADE ↗</span>
      <span class="mono" style="padding:16px 24px;border:1px solid #344638;color:#EBEDDF;font-size:13px">MEMÓRIA CULTURAL EM TRANSMISSÃO</span>
    </div>
    <span class="page-num">PÁG. ${pad(pages.length + 1, 2)}</span>
  </div>
`)

const template = readFileSync(join(root, 'scripts/canva-pdf/template.html'), 'utf8')
const html = template.replace('__PAGES__', pages.join('\n'))
const htmlPath = join(workDir, 'catalogo.html')
writeFileSync(htmlPath, html, 'utf8')

console.log(JSON.stringify({ htmlPath, pages: pages.length, records: all.length }))
