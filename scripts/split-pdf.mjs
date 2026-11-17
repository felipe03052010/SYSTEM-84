#!/usr/bin/env node
/**
 * Divide PDFs grandes em PDFs pequenos, cada um com no máximo 10 MB,
 * que é o limite de importação do Canva.
 *
 * Os pedaços usam cópia de página (pdf-lib): as imagens e as fontes
 * são reaproveitadas sem recomprimir nada.
 *
 * Uso: node scripts/split-pdf.mjs <arquivo.pdf> [limite-em-MB] [saída-dir]
 * Saída: <saída-dir>/<nome>--parte-01-de-04.pdf ...
 */
import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { basename, join, extname } from 'node:path'

const require = createRequire(import.meta.url)
const { PDFDocument } = require('C:/Users/felip/AppData/Local/Temp/nodecli/node_modules/pdf-lib')

const input = process.argv[2]
const limitMb = Number(process.argv[3] || 9.5)
if (!input) {
  console.error('uso: node scripts/split-pdf.mjs <arquivo.pdf> [limite-em-MB] [saída]')
  process.exit(1)
}
const outDir = process.argv[4] || join(input, '..', 'canva-lotes')
const limit = limitMb * 1024 * 1024

const source = await PDFDocument.load(await readFile(input))
const total = source.getPageCount()
const base = basename(input, extname(input))
await mkdir(outDir, { recursive: true })

/* Mede o tamanho real de um pedaço antes de gravar. */
async function sizeOf(indices) {
  const doc = await PDFDocument.create()
  const pages = await doc.copyPages(source, indices)
  pages.forEach((page) => doc.addPage(page))
  const bytes = await doc.save()
  return bytes
}

const parts = []
let start = 0
while (start < total) {
  let end = total - 1
  let bytes = null
  /* cresce enquanto couber: busca binária pelo maior fim possível */
  let low = start, high = total - 1, best = null
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const indices = Array.from({ length: mid - start + 1 }, (_, i) => start + i)
    const candidate = await sizeOf(indices)
    if (candidate.length <= limit) {
      best = { end: mid, bytes: candidate }
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  if (!best) {
    /* uma única página maior que o limite: vai sozinha, avisada */
    const single = await sizeOf([start])
    best = { end: start, bytes: single }
    console.warn(`aviso: a página ${start + 1} sozinha tem ${(single.length / 1024 / 1024).toFixed(1)} MB`)
  }
  parts.push({ from: start + 1, to: best.end + 1, bytes: best.bytes })
  start = best.end + 1
}

const width = String(parts.length).length
for (const [index, part] of parts.entries()) {
  const number = String(index + 1).padStart(width, '0')
  const file = join(outDir, `${base}--parte-${number}-de-${String(parts.length).padStart(width, '0')}.pdf`)
  await writeFile(file, part.bytes)
  console.log(
    `parte ${number}/${parts.length}: páginas ${part.from}–${part.to} · ` +
    `${(part.bytes.length / 1024 / 1024).toFixed(2)} MB · ${basename(file)}`,
  )
}

const totalSize = (await stat(input)).size
console.log(
  `\n${total} páginas em ${parts.length} partes · ` +
  `${(totalSize / 1024 / 1024).toFixed(1)} MB → maior parte ` +
  `${(Math.max(...parts.map((p) => p.bytes.length)) / 1024 / 1024).toFixed(1)} MB`,
)
console.log('pasta:', outDir)
