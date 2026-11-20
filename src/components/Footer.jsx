import { useState } from 'react'
import { LogoLink } from './Logo'
import SoundControl from './SoundControl'

export default function Footer() {
  const [crt, setCrt] = useState(() => document.documentElement.dataset.crt !== 'off')
  function toggleCrt() {
    const mode = crt ? 'off' : 'on'
    document.documentElement.dataset.crt = mode
    try { localStorage.setItem('system84-crt', mode) } catch { /* Session preference still applies. */ }
    setCrt(!crt)
  }
  return <footer className="s84-footer">
    <LogoLink/>
    <small>MEMÓRIA CULTURAL EM TRANSMISSÃO.<br/>SYSTEM 84 © 2026</small>
    <div className="s84-controls">
      <button type="button" aria-label="Filtro CRT" aria-pressed={crt} onClick={toggleCrt}>CRT: {crt ? 'ON' : 'OFF'}</button>
      <SoundControl/>
    </div>
  </footer>
}
