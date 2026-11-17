/**
 * Resolução de mídia do SYSTEM 84.
 *
 * Cada arquivo pode existir em até três lugares, tentados nesta ordem:
 *   1. cópia local do site (public/media, preparada por scripts/download-media.mjs);
 *   2. espelho público do GitHub Pages (mesmos arquivos, com CORS liberado);
 *   3. fonte original (Internet Archive, Project Gutenberg...).
 * Vídeos já hospedados no acervo de origem (remoteUrl) vão direto para lá.
 * Partes de um mesmo filme usam fragmentos de mídia (#t=início,fim) quando
 * precisam cair para a fonte original, para não recomeçar do zero.
 */

export const MIRROR = 'https://felipe03052010.github.io/SYSTEM-84/'

const SAFE_PATH = /^media\/[a-zA-Z0-9/_.-]+$/

function base() {
  try { return import.meta.env?.BASE_URL || '/' } catch { return '/' }
}

function timeFragment(media) {
  const t = media.transform
  if (!t || (t.start == null && t.duration == null)) return ''
  const start = Number(t.start || 0)
  return t.duration ? `#t=${start},${start + Number(t.duration)}` : `#t=${start}`
}

export function mediaCandidates(media) {
  const list = []
  const safe = media.path && SAFE_PATH.test(media.path) && !media.path.includes('..')
  if (media.remoteUrl?.startsWith('https://')) {
    list.push({ url: media.remoteUrl, origin: 'remote' })
    return list
  }
  if (safe) {
    list.push({ url: `${base()}${media.path}`, origin: 'local' })
    if (typeof window === 'undefined' || !window.location.href.startsWith(MIRROR)) {
      list.push({ url: `${MIRROR}${media.path}`, origin: 'mirror' })
    }
  }
  if (media.sourceUrl?.startsWith('https://')) {
    list.push({ url: media.kind === 'video' ? media.sourceUrl + timeFragment(media) : media.sourceUrl, origin: 'remote' })
  }
  return list
}

/** Converte uma página HTML (Gutenberg Austrália, Wikisource) em texto corrido. */
export function htmlToText(html) {
  if (typeof DOMParser === 'undefined') return html.replace(/<[^>]+>/g, ' ')
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, nav, header, footer, noscript').forEach((node) => node.remove())
  const blocks = [...doc.body.querySelectorAll('h1, h2, h3, h4, p, pre, blockquote, li')]
  const text = (blocks.length ? blocks.map((node) => node.textContent.trim()) : [doc.body.textContent])
    .filter(Boolean)
    .join('\n\n')
  return text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
}

const looksLikeHtml = (text) => /^\s*(<!doctype html|<html)/i.test(text)

/** Busca um texto tentando cada origem. Devolve { text, origin } ou lança erro. */
export async function fetchText(media, signal) {
  let lastError = new Error('Arquivo indisponível')
  for (const candidate of mediaCandidates(media)) {
    try {
      const response = await fetch(candidate.url, { signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const raw = await response.text()
      if (looksLikeHtml(raw)) {
        // A cópia local inexistente devolve a página do próprio site: ignorar.
        if (candidate.origin !== 'remote') throw new Error('Cópia local ausente')
        const text = htmlToText(raw)
        if (text.length < 500) throw new Error('Página sem texto legível')
        return { text, origin: candidate.origin }
      }
      if (raw.trim().length < 50) throw new Error('Arquivo vazio')
      return { text: raw, origin: candidate.origin }
    } catch (error) {
      if (error.name === 'AbortError') throw error
      lastError = error
    }
  }
  throw lastError
}

/** Divide um texto longo em páginas de ~650 palavras sem quebrar parágrafos. */
export function paginate(text, limit = 650) {
  const pages = []
  let current = ''
  let words = 0
  for (const paragraph of text.replace(/\r\n/g, '\n').split(/\n\s*\n/).filter((part) => part.trim())) {
    if (words > limit) {
      pages.push(current)
      current = ''
      words = 0
    }
    current += `${paragraph}\n\n`
    words += paragraph.split(/\s+/).length
  }
  if (current) pages.push(current)
  return pages
}
