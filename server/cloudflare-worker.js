import { handleApi, allowedMedia } from './api.js'

// Os arquivos grandes continuam no acervo do GitHub Pages.
// A Cloudflare hospeda o aplicativo e a API; o acesso à mídia passa pelo Worker.
const mediaOrigin = 'https://felipe03052010.github.io/SYSTEM-84'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env)
    }

    if (url.pathname.startsWith('/media/')) {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Método não permitido.', { status: 405 })
      }

      if (!/^\/media\/[a-zA-Z0-9/_.-]+$/.test(url.pathname) || url.pathname.includes('..')) {
        return new Response('Arquivo não encontrado.', { status: 404 })
      }

      if (!(await allowedMedia(request, env))) {
        return Response.json(
          { error: 'Assinatura necessária ou vencida.' },
          { status: 402, headers: { 'Cache-Control': 'no-store' } },
        )
      }

      const headers = new Headers({ 'Accept-Encoding': 'identity' })
      const book = url.pathname.match(/^\/media\/gutenberg\/(\d{1,6})\.txt$/)
      if (book) {
        const text = await fetch(`https://www.gutenberg.org/cache/epub/${book[1]}/pg${book[1]}.txt`, {
          method: request.method, redirect: 'error',
        })
        if (!text.ok) return new Response(null, { status: text.status })
        if (!text.headers.get('Content-Type')?.toLowerCase().startsWith('text/plain')) {
          return new Response(null, { status: 502 })
        }
        return new Response(text.body, { headers: {
          'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'private, no-store',
          'X-Content-Type-Options': 'nosniff',
        } })
      }
      if (request.headers.has('Range') && !url.pathname.endsWith('.txt')) {
        headers.set('Range', request.headers.get('Range'))
      }

      const upstream = await fetch(mediaOrigin + url.pathname, {
        method: request.method,
        headers,
        redirect: 'follow',
      })
      const responseHeaders = new Headers(upstream.headers)
      responseHeaders.delete('Set-Cookie')
      responseHeaders.set('Cache-Control', 'private, no-store')
      responseHeaders.set('X-Content-Type-Options', 'nosniff')

      return new Response(request.method === 'HEAD' ? null : upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      })
    }

    // Arquivos do React, CSS, imagens e rotas SPA são servidos pelo Assets.
    return env.ASSETS.fetch(request)
  },
}
