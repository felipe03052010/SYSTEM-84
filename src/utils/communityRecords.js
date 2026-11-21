import { useEffect, useState } from 'react'
import { accessRequest } from './auth'

/**
 * Registros publicados pela comunidade e aprovados pela moderação.
 *
 * O catálogo oficial é estático (src/data); os envios aprovados chegam da
 * API e entram aqui como registros extras, com o mesmo formato das fichas.
 * Cada envio recebe uma marca geométrica própria (glyph "com-…"), resolvida
 * no Chassis como qualquer outra logo do acervo.
 */

let cache = null
let ready = false
let inflight = null
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function youtubeIdOf(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null
    const host = url.hostname.toLowerCase()
    let id
    if (host === 'youtu.be') id = url.pathname.slice(1)
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'www.youtube-nocookie.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)$/)?.[1]
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null
  } catch { return null }
}

function toRecord(submission) {
  const kind = submission.media_kind === 'video' ? 'video' : submission.media_kind === 'text' ? 'text' : null
  const youtubeId = kind === 'video' && youtubeIdOf(submission.media_url)
  const media = submission.media_url && kind
    ? [{
        title: kind === 'video' ? 'Arquivo indicado pelo envio' : 'Texto indicado pelo envio',
        kind,
        path: `media/community-${submission.id}.${kind === 'video' ? 'mp4' : 'txt'}`,
        sourceUrl: submission.media_url,
        remoteUrl: submission.media_url,
        ...(youtubeId ? { kind: 'youtube', youtubeId, link: 'https://www.youtube.com/watch?v=' + youtubeId } : {}),
        license: 'Link indicado pelo autor do envio; direitos conforme a fonte.',
        language: 'Português',
      }]
    : []
  const year = Number.isFinite(submission.year) ? submission.year : new Date(submission.created_at).getUTCFullYear()
  return {
    id: submission.id,
    title: submission.title,
    year,
    type: submission.type,
    code: `ENVIO_${year}_${String(submission.id).slice(-4).toUpperCase()}`,
    author: submission.author_name || 'Comunidade SYSTEM 84',
    description: submission.description,
    tags: submission.tags || [],
    availability: 'available',
    language: 'Português',
    rightsNote: 'Publicado pela comunidade e aprovado pela moderação do arquivo.',
    sources: submission.sources || [],
    media,
    article: submission.article ? [submission.article] : undefined,
    glyph: `com-${submission.id}`,
    isNew: true,
    fromCommunity: true,
  }
}

export async function refreshCommunityRecords() {
  if (inflight) return inflight
  inflight = (async () => {
    try {
      const data = await accessRequest('/submissions')
      cache = (data.submissions || []).map(toRecord)
    } catch {
      cache = cache || []
    }
    ready = true
    inflight = null
    emit()
    return cache
  })()
  return inflight
}

/** { items, ready } — registros aprovados da comunidade (atualiza ao montar). */
export function useCommunityRecords() {
  const [state, setState] = useState({ items: cache || [], ready })
  useEffect(() => {
    const update = () => setState({ items: cache || [], ready })
    listeners.add(update)
    if (cache === null) refreshCommunityRecords()
    else update()
    return () => listeners.delete(update)
  }, [])
  return state
}
