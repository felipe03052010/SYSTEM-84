import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import React, { act } from 'react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
const dom = new JSDOM('<div id="root"></div>', { url: 'https://system84.test/' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.localStorage = dom.window.localStorage
globalThis.sessionStorage = dom.window.sessionStorage
globalThis.IS_REACT_ACT_ENVIRONMENT = true
window.matchMedia = () => ({ matches: true })
window.scrollTo = () => {}
sessionStorage.setItem('system84-bios-v2', 'true')
sessionStorage.setItem('system84-admitted', 'true')
let paidMode=false
globalThis.fetch=async path=>new Response(JSON.stringify(String(path).endsWith('/config')?{ready:paidMode,paymentReady:false,requireSubscription:paidMode}:{user:null}),{status:200,headers:{'Content-Type':'application/json'}})
const { createRoot } = await import('react-dom/client')
let root
async function open(path) {
  if(root) await act(async()=>root.unmount())
  root = createRoot(document.getElementById('root'))
  await act(async()=>root.render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>))
  await act(async()=>new Promise(resolve=>setTimeout(resolve,20)))
}
await open('/series')
assert(document.querySelectorAll('.record-card').length > 0)
await open('/enviar')
assert.match(document.body.textContent, /NOVO REGISTRO/)
await open('/admin-financeiro')
assert.match(document.body.textContent, /Acesso administrativo/i)
await open('/endereco-inexistente')
assert.match(document.body.textContent, /404/)
await open('/filmes')
assert(document.querySelectorAll('.record-card').length > 0)
await open('/livros')
assert(document.querySelectorAll('.record-card').length > 0)
await open('/pesquisa?q=dracula')
assert(document.querySelectorAll('.s84-card').length > 0)
await open('/lost-media')
assert(document.querySelectorAll('.record-card').length > 0)
await open('/analog-horror')
assert(document.querySelectorAll('.record-card').length >= 6, 'Analog Horror sem fitas')
// A suíte deve passar com zero, um ou todos os registros publicados.
const ytCards=[...document.querySelectorAll('.record-card[href*="/obra/yt-"]')]
const ytGlyphs=ytCards.map(card=>card.querySelector('[data-glyph]')?.getAttribute('data-glyph'))
assert(ytGlyphs.every(Boolean),'Registro sem pictograma')
assert.equal(new Set(ytGlyphs).size,ytCards.length,'Cada vídeo deve ter marca exclusiva')
if (ytCards.length > 0) {
  const itemPath=ytCards[0].getAttribute('href')
  const videoId=itemPath.split('/yt-')[1]
  assert.match(videoId,/^[\w-]{11}$/,'Vídeo com ID incorreto')
  await open(itemPath)
  assert(document.querySelector('.youtube-standby button'),'Player do YouTube não foi montado')
  assert.match(document.body.textContent,/direitos do criador/i)
  await act(async()=>document.querySelector('.youtube-standby button').click())
  assert(document.querySelector('iframe[src*="youtube-nocookie.com/embed/'+videoId+'"]'),'Player não iniciou após o clique')
}
await open('/arg')
assert(document.querySelectorAll('.record-card').length >= 6, 'ARG sem enigmas')
await open('/linha-do-tempo')
assert(document.querySelectorAll('.timeline-era').length > 5, 'Linha do tempo vazia')
await open('/sobre')
assert.match(document.body.textContent, /PLANOS DE ACESSO/)
for (const id of [85081, 85121]) {
  await open('/obra/' + id)
  const start = document.querySelector('.youtube-standby button')
  assert(start, 'Vídeo oficial ausente na ficha ' + id)
  await act(async () => start.click())
  const frame = document.querySelector('iframe')
  assert.match(frame?.src || '', /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}(?:\?|$)/)
  assert.equal(document.querySelector('#arg-answer'), null)
}
for (const id of [1, 5]) {
  await open('/obra/' + id)
  await act(async () => document.querySelector('.s84-cinema button').click())
  const player = document.querySelector('video[controls]')
  assert(player?.getAttribute('src'), 'Player interno sem mídia: ' + id)
}
const originalFetch = globalThis.fetch
globalThis.fetch = async (url, init) => String(url).endsWith('/media/book-84.txt')
  ? new Response('Primeira página desta edição. '.repeat(50))
  : originalFetch(url, init)
await open('/obra/9')
assert.match(document.querySelector('.book-paper')?.textContent || '', /Primeira página desta edição/)
globalThis.fetch = originalFetch
await open('/pesquisa?q=machado')
assert(document.querySelectorAll('.s84-card').length >= 6, 'Busca por autor falhou')
await open('/')
for (const removed of ['MANIFESTO VISUAL', 'PALETA PRINCIPAL', 'TIPOGRAFIA / PAPÉIS', 'SISTEMA DE ÍCONES DOS ITENS', 'EXEMPLOS DO ACERVO', 'PRINCIPAIS ESTADOS E FLUXOS']) assert(!document.body.textContent.includes(removed), `Seção removida voltou: ${removed}`)
await open('/comunidade')
assert.match(document.body.textContent, /MURAL DA COMUNIDADE/)
const sound = document.querySelector('.sound-control')
await act(async()=>sound.click())
assert.equal(sound.getAttribute('aria-pressed'),'false')
await act(async()=>sound.click())
assert.equal(sound.getAttribute('aria-pressed'),'true')
await open('/')
assert.equal(document.querySelector('.receiver'), null)
assert.equal(document.querySelector('.archive-tuner'), null)
assert(document.querySelector('.s84-strip a[href="/filmes"]'))
const crt = document.querySelector('[aria-label="Filtro CRT"]')
await act(async()=>crt.click())
assert.equal(document.documentElement.dataset.crt,'off')
await act(async()=>crt.click())
assert.equal(document.documentElement.dataset.crt,'on')
sessionStorage.removeItem('system84-bios-v2')
sessionStorage.removeItem('system84-admitted')
await open('/')
assert(document.querySelector('.pc-boot'))
await act(async()=>document.querySelector('.bios-audio-controls > button:last-child').click())
assert(document.querySelector('.entrance-page'))
await act(async()=>document.querySelector('.terminal-creator').click())
assert(document.querySelector('input[name="inviteCode"]'))
assert(document.querySelector('input[name="password"]'))
await act(async()=>document.querySelector('.entrance-footer button').click())
assert(document.querySelector('.s84-home'))
paidMode=true
localStorage.setItem('system84_user', JSON.stringify({role:'admin',hasAccess:true}))
await open('/filmes')
assert(document.querySelector('.entrance-page'), 'Unpaid access cannot bypass the gate via URL or localStorage')
assert.equal(document.querySelector('.entrance-footer button'), null)
await act(async()=>root.unmount())
console.log('PASS: catalog, new collections, timeline, ARG and analog horror playback, author search, removed home panels, sound, BIOS, entrance forms and subscription gate.')
