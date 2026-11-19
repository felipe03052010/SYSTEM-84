import catalogo from './analog-catalogo.json'
import { ANALOG_CATALOGO_GLYPHS } from './analog-catalogo-glifos.js'

/* Catálogo de analog horror: apenas links para os canais oficiais dos criadores.
   O SYSTEM 84 não hospeda nem reenvia estes vídeos. Itens com urlType "search"
   ainda não têm link de canal confirmado e abrem uma busca no YouTube. */
const KIND_LABEL = {
  'analog-horror': 'ANALOG HORROR',
  'found-footage': 'FOUND FOOTAGE',
  'game-horror': 'GAME HORROR',
  arg: 'ARG',
}

export const analogCatalogoMeta = catalogo.meta

export const analogCatalogo = catalogo.items.map((item, index) => ({
  ...item,
  id: 'ahc-' + item.slug,
  code: 'AH-CAT-' + String(index + 1).padStart(3, '0'),
  glyph: ANALOG_CATALOGO_GLYPHS[item.slug],
  kindLabel: KIND_LABEL[item.kind] || 'ANALOG HORROR',
  unconfirmed: item.urlType === 'search',
}))
