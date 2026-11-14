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
await act(async()=>root.unmount())
console.log('PASS: historical public domain navigation, authentication, and sound toggle.')
