import { useEffect, useRef, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const messages = [
  'SYSTEM 84 / MEMORY BIOS v2.84',
  'Copyright (C) SYSTEM 84 — Optical Memory',
  'CPU: i486 DX2 @ 66MHz ................. OK',
  'Memory test: 640K BASE / 16384K EXT ... OK',
  'Detecting primary master: ARCHIVE_84 . OK',
  'Initializing VGA / CRT adapter ....... OK',
  'Mounting cultural memory volumes .... OK',
  'Loading access terminals ............ OK',
  'POST complete. Starting SYSTEM 84 ...'
]
function readSession(key) { try { return sessionStorage.getItem(key) === 'true' } catch { return false } }
function writeSession(key) { try { sessionStorage.setItem(key, 'true') } catch { /* Session is optional. */ } }

export function PcBoot({ onComplete }) {
  const [line, setLine] = useState(1)
  const completed = useRef(false)
  function finish() { if (!completed.current) { completed.current = true; onComplete() } }
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const keydown = event => { if (event.key === 'Enter') finish() }
    window.addEventListener('keydown', keydown)
    const interval = setInterval(() => setLine(value => Math.min(messages.length, value + 1)), reduced ? 20 : 360)
    return () => { clearInterval(interval); window.removeEventListener('keydown', keydown) }
  }, [])
  useEffect(() => {
    if (line < messages.length) return
    const timer = setTimeout(finish, 450)
    return () => clearTimeout(timer)
  }, [line])
  return <main className="pc-boot" aria-label="Inicialização do computador">
    <header><span className="bios-symbol">▦</span><div>ENERGY STAR COMPLIANT<br/><strong>SYSTEM 84 BIOS</strong></div><span className="bios-revision">REV. 02.84<br/>CMOS / POST</span></header>
    <div className="bios-log" aria-live="polite">{messages.slice(0,line).map((message,i) => <p key={i}>{message}</p>)}<span className="bios-cursor">_</span></div>
    <div className="bios-bottom"><label htmlFor="bios-progress">BOOT SEQUENCE <span>{Math.round(line/messages.length*100)}%</span></label><progress id="bios-progress" max={messages.length} value={line}/><button onClick={finish}>Pular inicialização [ ENTER ]</button></div>
    <footer>Press ENTER to skip memory test<span>84-001-CRT-MEMORY-SYSTEM</span></footer>
  </main>
}

export default function AccessFlow({ children, renderEntrance }) {
  const [booted,setBooted] = useState(() => readSession('system84-bios-v2'))
  const [admitted,setAdmitted] = useState(() => readSession('system84-admitted'))
  const location = useLocation()
  const { currentUser, service } = useAuth()
  if (!booted) return <PcBoot onComplete={() => { writeSession('system84-bios-v2'); setBooted(true) }}/>
  if (location.pathname === '/entrada') return renderEntrance(() => { writeSession('system84-admitted'); setAdmitted(true) })
  if (service.loading) return <main className='access-check' role='status'>CONECTANDO AO ARQUIVO…</main>
  if ((service.requireSubscription && !currentUser.hasAccess) || !admitted) return <Navigate to="/entrada" replace state={{ returnTo: location.pathname+location.search }}/>
  return children
}
