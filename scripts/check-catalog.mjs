import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
const catalog = JSON.parse(await fs.readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'))
const files = new Set(), ids = new Set()
let bytes = 0
for (const record of catalog) {
  assert(!ids.has(record.id), 'ID duplicado'); ids.add(record.id)
  assert(record.title && record.code && record.media.length, 'Obra sem arquivo')
  for (const media of record.media) {
    assert(/^media\/[a-z0-9_.-]+\.(mp4|txt)$/.test(media.path), 'A mídia deve estar no site')
    assert(['video', 'text'].includes(media.kind))
    assert(media.license && media.sourceUrl.startsWith('https://'), 'Mídia sem procedência')
    if (process.argv.includes('--files') && !files.has(media.path)) {
      const file = new URL('../public/' + media.path, import.meta.url)
      const stat = await fs.stat(file); assert(stat.size > 1000, 'Arquivo vazio'); bytes += stat.size
      if (media.kind === 'video') {
        const handle = await fs.open(file)
        const header = Buffer.alloc(32); await handle.read(header, 0, 32, 0); await handle.close()
        assert(header.includes(Buffer.from('ftyp')), 'MP4 inválido')
      }
    }
    files.add(media.path)
  }
}
assert(bytes < 950_000_000, 'Arquivos excedem a margem de tamanho para GitHub Pages')
console.log(`${catalog.length} obras verificadas; ${files.size} arquivos; ${(bytes / 1024 / 1024).toFixed(1)} MiB locais.`)
