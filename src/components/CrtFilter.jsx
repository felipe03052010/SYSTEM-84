import { useEffect, useState } from 'react'
import { crtPowerOn, crtPowerOff } from '../utils/retro-sounds'

/*
 * Filtro de monitor de tubo: linhas de varredura, máscara de fósforo RGB,
 * barra de rolagem, chiado, vinheta curva e cintilação. Fica por cima de
 * tudo (pointer-events: none) e pode ser desligado; a preferência é salva.
 */
const KEY = 'system84-crt'
const EVENT = 'system84:crt'

export function crtEnabled() {
  try { return localStorage.getItem(KEY) !== 'off' } catch { return true }
}

export function setCrtEnabled(value) {
  try { localStorage.setItem(KEY, value ? 'on' : 'off') } catch { /* preferência opcional */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }))
}

export function useCrt() {
  const [on, setOn] = useState(crtEnabled)
  useEffect(() => {
    const sync = (event) => setOn(event.detail)
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return on
}

function flash(className, ms) {
  const body = document.body
  body.classList.remove(className)
  void body.offsetWidth
  body.classList.add(className)
  window.setTimeout(() => body.classList.remove(className), ms)
}

export function CrtControl() {
  const on = useCrt()
  function toggle() {
    const next = !on
    if (next) { crtPowerOn(); flash('crt-degauss', 900) } else crtPowerOff()
    setCrtEnabled(next)
  }
  return (
    <button className="sound-control crt-control" aria-pressed={on} aria-label="Filtro de monitor antigo" onClick={toggle}>
      CRT: {on ? 'ON' : 'OFF'}
    </button>
  )
}

export default function CrtFilter() {
  const on = useCrt()
  useEffect(() => {
    document.body.classList.toggle('crt-on', on)
  }, [on])
  useEffect(() => { flash('crt-poweron', 1100) }, [])
  if (!on) return null
  return (
    <div className="s84-crt" aria-hidden="true">
      <i className="crt-mask" />
      <i className="crt-scan" />
      <i className="crt-roll" />
      <i className="crt-noise" />
      <i className="crt-glass" />
    </div>
  )
}
