import fabula84001 from './fabulas/84001.json'
import fabula84002 from './fabulas/84002.json'
import fabula84003 from './fabulas/84003.json'
import catalog from './catalog.json'
import { expansion } from './expansion.js'
import { ampliado } from './acervo-ampliado.js'
import { autores } from './autores.js'
import { analogYoutube } from './analog-youtube.js'

/**
 * Acervo completo: o catálogo histórico (com mídia baixada para o site),
 * as fichas de expansão e o acervo ampliado (mídia lida da fonte pública,
 * dossiês e ficções originais). A autoria vem de autores.js quando o
 * registro não a traz.
 */
const withAuthor = (record) => (record.author || !autores[record.id] ? record : { ...record, author: autores[record.id] })

const newIds = new Set([...ampliado, ...analogYoutube].map((record) => record.id))

const fabulas = [
  fabula84003,
  fabula84002,
  fabula84001,
]

export const records = [...catalog, ...expansion, ...ampliado, ...analogYoutube, ...fabulas].map((record) => ({
  ...withAuthor(record),
  isNew: newIds.has(record.id),
}))

export const catalogRecords = catalog
export const expansionRecords = expansion
export const extendedRecords = ampliado
export const analogYoutubeRecords = analogYoutube

/** Coleções do acervo: rota, rótulo e tipo de registro. */
export const COLLECTIONS = [
  { type: 'filme', label: 'Filmes', path: '/filmes' },
  { type: 'série', label: 'Séries', path: '/series' },
  { type: 'livro', label: 'Livros', path: '/livros' },
  { type: 'lost-media', label: 'Lost media', path: '/lost-media' },
  { type: 'analog-horror', label: 'Analog Horror', path: '/analog-horror' },
  { type: 'arg', label: 'ARG', path: '/arg' },
]
