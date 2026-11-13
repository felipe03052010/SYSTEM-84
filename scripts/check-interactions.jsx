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
sessionStorage.setItem('system84Booted', 'true')
const { createRoot } = await import('react-dom/client')
let root
async function open(path) {
  if(root) await act(async()=>root.unmount())
  root = createRoot(document.getElementById('root'))
  await act(async()=>root.render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>))
  await act(async()=>new Promise(resolve=>setTimeout(resolve,20)))
}
await open('/analog-horror')
assert(document.querySelectorAll('.record-card').length >= 6)
await open('/arg')
assert(document.querySelectorAll('.record-card').length >= 6)
await open('/obra/600')
assert.match(document.body.textContent,/O primeiro sinal/)
const input = document.querySelector('#arg-answer')
// React controlled inputs require the native setter followed by an input event.
await act(async()=>{
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(input,'LUAR')
  input.dispatchEvent(new window.Event('input',{bubbles:true}))
  input.dispatchEvent(new window.Event('change',{bubbles:true}))
})
await act(async()=>document.querySelector('form.arg-console').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})))
assert.equal(localStorage.getItem('sys84-arg:600'),'solved')
await open('/obra/600')
assert.match(document.body.textContent,/ARQUIVO DESBLOQUEADO/)
assert.match(document.body.textContent,/LUAR era uma estação/)
await act(async()=>document.querySelector('.arg-console button').click())
assert.equal(localStorage.getItem('sys84-arg:600'),null)
assert(document.querySelector('#arg-answer'))
await open('/pesquisa?q=memorias')
assert(document.querySelectorAll('.record-card').length > 0)
assert.match(document.body.textContent,/Memórias/)
await open('/lost-media')
assert.equal(document.querySelectorAll('.record-card').length,10)
await open('/obra/400')
assert(document.querySelector('.original-story'))
assert(!document.body.textContent.includes('Arquivo ainda não disponível'))
const sound = document.querySelector('.sound-control')
await act(async()=>sound.click())
assert.equal(sound.getAttribute('aria-pressed'),'false')
await act(async()=>sound.click())
assert.equal(sound.getAttribute('aria-pressed'),'true')
await act(async()=>root.unmount())
console.log('PASS: new tabs, original stories, ARG progress/reset, accent-insensitive search, lost-media dossiers, sound toggle.')
