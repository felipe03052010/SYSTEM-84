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
await act(async()=>document.querySelector('.bios-bottom button').click())
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
console.log('PASS: catalog, sound, BIOS, entrance forms, PC-free home and subscription gate.')
