import catalog from './catalog.json'
import { expansion } from './expansion.js'

/**
 * Acervo completo: o catálogo histórico (com mídia baixada para o site)
 * mais as fichas de expansão (mídia lida direto da fonte pública).
 */
const merged = [...catalog, ...expansion]

export const records = merged
export const catalogRecords = catalog
export const expansionRecords = expansion
