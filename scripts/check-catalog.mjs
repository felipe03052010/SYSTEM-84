import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
const catalog = JSON.parse(await fs.readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'))
const files = new Set(), ids = new Set()
let bytes = 0
for (const record of catalog) {
  assert(!ids.has(record.id), 'ID duplicado'); ids.add(record.id)
  assert(record.title && record.code && (record.media.length || record.article?.length), 'Obra sem arquivo')
  for (const media of record.media) {
    assert(/^media\/[a-z0-9_.-]+\.(mp4|txt)$/.test(media.path), 'A mídia deve estar no site')
    assert(['video', 'text'].includes(media.kind))
    assert(media.license && media.sourceUrl.startsWith('https://'), 'Mídia sem procedência')
    if (media.remoteUrl) {
      const url = new URL(media.remoteUrl)
      assert(url.protocol === 'https:' && ['archive.org', 'download.blender.org'].includes(url.hostname), 'Origem remota não permitida')
      assert(media.kind === 'video' && record.sources?.length, 'Vídeo remoto sem fontes')
      continue
    }
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

// Fichas de expansão e acervo ampliado: mesma forma do catálogo, mídia remota.
const { expansion } = await import(new URL('../src/data/expansion.js', import.meta.url))
const { ampliado } = await import(new URL('../src/data/acervo-ampliado.js', import.meta.url))
const TYPES = ['filme', 'série', 'livro', 'lost-media', 'analog-horror', 'arg']
const titles = new Set(catalog.map(r => `${r.type}:${r.title.toLowerCase()}`))
for (const record of [...expansion, ...ampliado]) {
  assert(!ids.has(record.id), `ID duplicado: ${record.id}`); ids.add(record.id)
  assert(TYPES.includes(record.type), `Tipo inválido: ${record.id}`)
  assert(record.title && record.code && Number.isFinite(record.year) && record.description, `Ficha incompleta: ${record.id}`)
  const key = `${record.type}:${record.title.toLowerCase()}`
  assert(!titles.has(key), `Título repetido: ${record.title}`); titles.add(key)
  assert((record.media || []).length || record.article?.length, `Obra sem conteúdo: ${record.id}`)
  assert(record.sources?.length && record.sources.every(source => source.url.startsWith('https://')), `Fonte ausente: ${record.id}`)
  for (const media of record.media || []) {
    assert(/^media\/[a-z0-9_.-]+\.(mp4|txt)$/.test(media.path), `Caminho inválido: ${media.path}`)
    assert(media.license && media.sourceUrl?.startsWith('https://'), `Mídia sem procedência: ${record.id}`)
    if (media.kind === 'video') assert(media.remoteUrl?.startsWith('https://archive.org/'), `Vídeo remoto fora do Internet Archive: ${record.id}`)
  }
  if (record.type === 'arg') assert(record.puzzle?.question && record.puzzle.answer && record.puzzle.hint && record.puzzle.ending, `Enigma incompleto: ${record.id}`)
}
// Arquivos externos: IDs verificados, licença própria e glifo exclusivo.
const { analogYoutube } = await import(new URL('../src/data/analog-youtube.js', import.meta.url))
const ytGlyphs = new Set()
for (const item of analogYoutube) {
  assert(!ids.has(item.id), 'ID externo duplicado'); ids.add(item.id)
  const media = item.media?.[0]
  assert(media?.kind === 'youtube' && /^[\w-]{11}$/.test(media.youtubeId), 'ID do YouTube inválido')
  assert(media.link === 'https://www.youtube.com/watch?v=' + media.youtubeId, 'URL externa não confere')
  assert(item.author && item.rightsNote && item.sources?.[0]?.url === media.link, 'Crédito externo ausente')
  assert(item.glyph && !ytGlyphs.has(item.glyph), 'Glifo externo repetido'); ytGlyphs.add(item.glyph)
}
console.log('Analog horror externo validado: '+analogYoutube.length+' registros independentes.')

// Catálogo de criadores de analog horror: só links oficiais, um glifo único por título.
const catalogoAH = JSON.parse(await fs.readFile(new URL('../src/data/analog-catalogo.json', import.meta.url), 'utf8'))
const { ANALOG_CATALOGO_GLYPHS } = await import(new URL('../src/data/analog-catalogo-glifos.js', import.meta.url))
const tapeSource = await fs.readFile(new URL('../src/components/tapeGlyphs.jsx', import.meta.url), 'utf8')
const tapeKeys = new Set([...tapeSource.matchAll(/^  '(fita-[a-z0-9-]+)': base\(/gm)].map((match) => match[1]))
const glyphsInUse = new Set([...analogYoutube.map((item) => item.glyph), 'fita-01', 'fita-02', 'fita-03', 'fita-04', 'fita-05', 'fita-06'])
const slugsAH = new Set(), glyphsAH = new Set()
assert(catalogoAH.items.length === Object.keys(ANALOG_CATALOGO_GLYPHS).length, 'Mapa de glifos do catálogo não confere com os itens')
for (const item of catalogoAH.items) {
  assert(item.slug && !slugsAH.has(item.slug), `Slug duplicado no catálogo de analog horror: ${item.slug}`); slugsAH.add(item.slug)
  assert(item.title && item.creator && item.description, `Item incompleto no catálogo: ${item.slug}`)
  assert(['channel', 'playlist', 'search'].includes(item.urlType), `urlType inválido: ${item.slug}`)
  assert(new URL(item.url).protocol === 'https:' && new URL(item.url).hostname === 'www.youtube.com', `Link fora do YouTube: ${item.slug}`)
  assert(item.embed === false, `Item do catálogo não deve ser incorporado: ${item.slug}`)
  const glyph = ANALOG_CATALOGO_GLYPHS[item.slug]
  assert(glyph && tapeKeys.has(glyph), `Glifo inexistente: ${item.slug}`)
  assert(!glyphsAH.has(glyph) && !glyphsInUse.has(glyph), `Glifo repetido: ${glyph}`); glyphsAH.add(glyph)
}
console.log('Catálogo de analog horror validado: ' + catalogoAH.items.length + ' títulos, ' + glyphsAH.size + ' glifos únicos.')

console.log(`${expansion.length + ampliado.length} fichas extras verificadas; ${ids.size} registros no total.`)
console.log(`${catalog.length} obras verificadas; ${files.size} arquivos; ${(bytes / 1024 / 1024).toFixed(1)} MiB locais.`)
