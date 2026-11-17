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
await open('/filmes')
assert(document.querySelectorAll('.record-card').length > 0)
await open('/livros')
assert(document.querySelectorAll('.record-card').length > 0)
await open('/pesquisa?q=dracula')
assert(document.querySelectorAll('.record-card').length > 0)
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
await open('/obra/951')
const argInput = document.querySelector('#arg-answer')
const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
await act(async()=>{ setValue.call(argInput, 'memória'); argInput.dispatchEvent(new window.Event('input', { bubbles: true })) })
await act(async()=>document.querySelector('.arg-console button[type="submit"]').click())
assert.match(document.body.textContent, /ARQUIVO DESBLOQUEADO/, 'Enigma não foi resolvido com resposta sem acento')
await open('/obra/951')
assert.match(document.body.textContent, /ARQUIVO DESBLOQUEADO/, 'Progresso do enigma não foi restaurado')
await open('/obra/901')
assert(document.querySelectorAll('.tape-line').length > 3, 'Fita sem transcrição')
await open('/pesquisa?q=machado')
assert(document.querySelectorAll('.record-card').length >= 6, 'Busca por autor falhou')
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
assert(document.querySelector('.station-directories'))
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
assert(document.querySelector('.station-page'))
paidMode=true
localStorage.setItem('system84_user', JSON.stringify({role:'admin',hasAccess:true}))
await open('/filmes')
assert(document.querySelector('.entrance-page'), 'Unpaid access cannot bypass the gate via URL or localStorage')
assert.equal(document.querySelector('.entrance-footer button'), null)
await act(async()=>root.unmount())
console.log('PASS: catalog, new collections, timeline, ARG solve/restore, author search, removed home panels, sound, BIOS, entrance forms and subscription gate.')
