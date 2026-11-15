#!/usr/bin/env node
/**
 * Converte o acervo do SYSTEM 84 em arquivos que o Canva importa.
 *
 * O Canva lê dados de tabela (CSV) e texto simples (TXT). Gera três arquivos
 * e mais uma égua de imagem:
 *
 *   acervo-system84.csv   — uma linha por registro, com todas as colunas úteis
 *   acervo-system84.txt   — a mesma base em texto corrido, para colar em slide
 *   capas-system84/       — um PNG 1000×1000 por registro, na estética do Figma
 *                           (fundo #101813, anéis ácidos, arco laranja, título
 *                           em caixa alta). É o que o Canva aceita como imagem.
 *
 * Nada aqui inventa dado: toda linha vem do catálogo + expansão do site.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const root = process.argv[2] || '.'
const outDir = join(root, 'canva')

const catalog = JSON.parse(readFileSync(join(root, 'src/data/catalog.json'), 'utf8'))
const expansionSource = readFileSync(join(root, 'src/data/expansion.js'), 'utf8')
const expansionBody = expansionSource
  .replace(/^[\s\S]*?export const expansion\s*=\s*/, '')
  .replace(/\n\s*$/, '')
// eslint-disable-next-line no-new-func
const expansion = new Function(`return ${expansionBody}`)()

const all = [...catalog, ...expansion]

const TYPE_LABEL = {
  filme: 'Filme',
  serie: 'Série',
  série: 'Série',
  livro: 'Livro',
  'lost-media': 'Lost media',
}

const EXT = {
  video: 'mp4',
  audio: 'mp3',
  pdf: 'pdf',
  text: 'txt',
  image: 'jpg',
}

const clean = (value) => String(value ?? '').replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()

const csvCell = (value) => {
  const text = clean(value)
  return /[",;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/* A linha do CSV: o que interessa a um layout de Canva, na ordem em que
   alguém montaria um cartão — tipo, ano, título primeiro. */
const HEADER = [
  'ID',
  'Tipo',
  'Título',
  'Ano',
  'Década',
  'Código',
  'Descrição',
  'Tags',
  'Disponibilidade',
  'Idioma',
  'Nota de direitos',
  'Fonte',
  'Link da fonte',
  'Mídia principal',
  'Link da mídia',
  'Licença da mídia',
]

const mediaOf = (record) => (record.media && record.media[0]) || null

const rows = all.map((record) => {
  const media = mediaOf(record)
  return [
    record.id,
    TYPE_LABEL[record.type] || record.type,
    record.title,
    record.year || '',
    record.year ? Math.floor(record.year / 10) * 10 : '',
    record.code || '',
    record.description || '',
    (record.tags || []).join(' · '),
    record.availability === 'available' ? 'Disponível' : 'Indisponível',
    record.language || '',
    record.rightsNote || '',
    (record.sources && record.sources[0] && record.sources[0].title) || '',
    (record.sources && record.sources[0] && record.sources[0].url) || '',
    media ? media.title || '' : '',
    media ? media.sourceUrl || media.path || '' : '',
    media ? media.license || '' : '',
  ]
})

mkdirSync(outDir, { recursive: true })

const csv = [HEADER, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
writeFileSync(join(outDir, 'acervo-system84.csv'), `\uFEFF${csv}`, 'utf8')

/* Versão em texto: cada registro como um bloco, para colar em caixa de texto. */
const blocks = all.map((record, index) => {
  const media = mediaOf(record)
  const label = TYPE_LABEL[record.type] || record.type
  const year = record.year || 's/d'
  return [
    `${String(index + 1).padStart(3, '0')} — ${record.title.toUpperCase()}`,
    `${label.toUpperCase()} / ${year}`,
    record.description || '',
    (record.tags || []).length ? `Tags: ${record.tags.join(', ')}` : '',
    (record.sources && record.sources[0]) ? `Fonte: ${record.sources[0].url}` : '',
    media && media.sourceUrl ? `Mídia: ${media.sourceUrl}` : '',
  ].filter(Boolean).join('\n')
})

const txtHeader = [
  'SYSTEM 84 — ACERVO EM TRANSMISSÃO',
  `Arquivo cultural independente / VOL. 084`,
  `${all.length} registros: ${['filme', 'serie', 'livro', 'lost-media']
    .map((type) => {
      const count = all.filter((record) => record.type === type || (type === 'serie' && record.type === 'série')).length
      return `${count} ${TYPE_LABEL[type] || type}`
    })
    .join(' / ')}`,
  '',
].join('\n')

writeFileSync(join(outDir, 'acervo-system84.txt'), `${txtHeader}\n${blocks.join('\n\n')}\n`, 'utf8')

/* ── Capas em SVG: o Canva importa SVG como imagem vetorial ───────────── */

const capDir = join(outDir, 'capas-system84')
rmSync(capDir, { recursive: true, force: true })
mkdirSync(capDir, { recursive: true })

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)

/* Quebra o título em até 3 linhas de ~14 caracteres, sem cortar palavra. */
function wrapTitle(title) {
  const words = title.toUpperCase().split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    if (!line.length) line = word
    else if (`${line} ${word}`.length <= 14) line = `${line} ${word}`
    else {
      lines.push(line)
      line = word
    }
    if (lines.length === 3) break
  }
  if (line && lines.length < 3) lines.push(line)
  if (lines.length === 3 && words.join(' ').length > lines.join(' ').length) {
    lines[2] = `${lines[2].slice(0, 12)}…`
  }
  return lines
}

const coverSvg = (record) => {
  const lines = wrapTitle(record.title)
  const label = TYPE_LABEL[record.type] || record.type
  const year = record.year || 'S/D'
  const titleY = 560
  const titleSpans = lines
    .map((line, index) => `<tspan x="80" dy="${index === 0 ? 0 : 62}">${escapeXml(line)}</tspan>`)
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="#101813"/>
  <defs>
    <pattern id="rings" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="14.5" fill="none" stroke="#A8FF60" stroke-opacity="0.35" stroke-width="1"/>
    </pattern>
    <clipPath id="disc"><circle cx="500" cy="400" r="250"/></clipPath>
  </defs>
  <g clip-path="url(#disc)">
    <rect x="250" y="150" width="500" height="500" fill="url(#rings)"/>
  </g>
  <path d="M250 400 A250 250 0 0 1 750 400" fill="none" stroke="#FF6332" stroke-width="9"/>
  <circle cx="500" cy="400" r="250" fill="none" stroke="#A8FF60" stroke-width="2"/>
  <rect x="690" y="232" width="19" height="19" fill="#FF6332"/>
  <text x="80" y="80" font-family="'IBM Plex Mono', monospace" font-size="20" letter-spacing="3" fill="#A8FF60">CAPA / SYSTEM 84</text>
  <text x="920" y="80" text-anchor="end" font-family="'IBM Plex Mono', monospace" font-size="20" letter-spacing="3" fill="#A8FF60">FIG. ${String(record.id).padStart(3, '0')}</text>
  <text x="80" y="${titleY}" font-family="'Syncopate', 'Space Grotesk', sans-serif" font-weight="700" font-size="54" letter-spacing="1" fill="#EBEDDF">${titleSpans}</text>
  <text x="80" y="900" font-family="'IBM Plex Mono', monospace" font-size="22" letter-spacing="3" fill="#A8FF60">${escapeXml(label.toUpperCase())} / ${escapeXml(year)}</text>
  <text x="920" y="900" text-anchor="end" font-family="'IBM Plex Mono', monospace" font-size="22" letter-spacing="3" fill="#9CAA9D">${escapeXml(record.code || '')}</text>
  <line x1="80" y1="860" x2="920" y2="860" stroke="#344638" stroke-width="1"/>
</svg>
`
}

let covers = 0
for (const record of all) {
  const name = `${String(record.id).padStart(4, '0')}-${slugify(record.title)}.svg`
  writeFileSync(join(capDir, name), coverSvg(record), 'utf8')
  covers += 1
}

const readme = `SYSTEM 84 — pacote para o Canva
================================

Arquivos:

1. acervo-system84.csv
   ${all.length} linhas, ${HEADER.length} colunas. No Canva: "Mais" > "Importar"
   (ou copiar e colar numa tabela). Serve para gráficos, tabelas e listas.

2. acervo-system84.txt
   A mesma base em texto corrido, um bloco por registro. Bom para caixas de
   texto, slides de citação e cards.

3. capas-system84/ (${covers} arquivos .svg, 1000×1000)
   Uma capa por registro, na estética do Figma (fundo #101813, anéis #A8FF60,
   arco #FF6332, título em Syncopate). No Canva: "Uploads" > enviar os arquivos
   e arrastar para o design. SVG entra como vetor e amplia sem perder nitidez.
   Se preferir PNG, o Canva converte ao exportar o design.

Colunas do CSV: ${HEADER.join(' | ')}

Nada aqui é dado inventado: tudo veio de src/data/catalog.json e
src/data/expansion.js, com fonte e licença em cada registro.
`

writeFileSync(join(outDir, 'LEIA-ME-canva.txt'), readme, 'utf8')

console.log(`CSV:   ${join(outDir, 'acervo-system84.csv')} (${all.length} linhas)`)
console.log(`TXT:   ${join(outDir, 'acervo-system84.txt')}`)
console.log(`Capas: ${capDir} (${covers} SVGs)`)
