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
    assert(/^media\/[a-z0-9_.-]+\.(mp4|webm|ogv|txt)$/.test(media.path), 'A mídia deve estar no site')
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
const { cinema } = await import('../src/data/cinema.js')
const { livrosPerdidos } = await import('../src/data/livros-perdidos.js')
const { fitasArg } = await import('../src/data/fitas-arg.js')
const { enigmas } = await import('../src/data/enigmas.js')
const novas = [...cinema, ...livrosPerdidos, ...fitasArg, ...enigmas]
const tiposEsperados = { filme: 20, 'série': 20, livro: 20, 'lost-media': 20, 'analog-horror': 20, arg: 40 }
assert.equal(novas.length, 140)
for (const [tipo, total] of Object.entries(tiposEsperados)) {
  assert.equal(novas.filter(ficha => ficha.type === tipo).length, total, tipo)
}
const TYPES = ['filme', 'série', 'livro', 'lost-media', 'analog-horror', 'arg']
const titles = new Set(catalog.map(r => `${r.type}:${r.title.toLowerCase()}`))
for (const record of [...expansion, ...ampliado, ...novas]) {
  assert(!ids.has(record.id), `ID duplicado: ${record.id}`); ids.add(record.id)
  assert(TYPES.includes(record.type), `Tipo inválido: ${record.id}`)
  assert(record.title && record.code && Number.isFinite(record.year) && record.description, `Ficha incompleta: ${record.id}`)
  const key = `${record.type}:${record.title.toLowerCase()}`
  assert(!titles.has(key), `Título repetido: ${record.title}`); titles.add(key)
  assert((record.media || []).length || record.article?.length, `Obra sem conteúdo: ${record.id}`)
  assert(record.sources?.length && record.sources.every(source => source.url.startsWith('https://')), `Fonte ausente: ${record.id}`)
  for (const media of record.media || []) {
    if (media.kind === 'youtube') {
      assert(/^[a-zA-Z0-9_-]{11}$/.test(media.youtubeId) && media.link === 'https://www.youtube.com/watch?v=' + media.youtubeId && media.title, 'Vídeo sem identificação')
      continue
    }
    assert(/^media\/[a-z0-9_.-]+\.(mp4|webm|ogv|txt)$/.test(media.path), `Caminho inválido: ${media.path}`)
    assert(media.license && media.sourceUrl?.startsWith('https://'), `Mídia sem procedência: ${record.id}`)
    if (media.kind === 'video') {
      const source = new URL(media.remoteUrl)
      assert.equal(source.protocol, 'https:')
      assert(['archive.org', 'upload.wikimedia.org', 'download.blender.org'].includes(source.hostname), 'Origem de vídeo inesperada: ' + source.hostname)
    }
  }
  if (['filme','série','arg','analog-horror'].includes(record.type)) {
    assert(record.media.some(item => ['video','youtube','archive'].includes(item.kind)), 'Reprodução interna ausente: ' + record.id)
  }
  if (record.type === 'arg' || record.type === 'analog-horror') {
    assert(!record.puzzle && record.author && !/^SYSTEM\s*84$/i.test(record.author), 'Ficção própria no catálogo: ' + record.id)
  }
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

console.log(`Atualização conferida: ${novas.length} fichas novas, incluindo 40 registros de ARG.`)
console.log(`${catalog.length} obras verificadas; ${files.size} arquivos; ${(bytes / 1024 / 1024).toFixed(1)} MiB locais.`)
