import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { loadingSounds, keyClack } from '../utils/retro-sounds'
import '../styles/loaders.css'
import '../styles/intros.css'

/**
 * Animação de entrada de cada seção do SYSTEM 84.
 *
 * Cada rota tem uma abertura própria, com som e desenho ligados ao tema:
 * contagem regressiva de projetor para Filmes, troca de canal com tubo
 * ligando para Séries, páginas virando para Livros, setores recuperados
 * para Lost media, barras de cor para Analog Horror, cifra para ARG, anos
 * rolando para a Linha do tempo, e assim por diante. Depois da abertura o
 * conteúdo entra com um movimento que combina com ela.
 *
 * Clique, Esc, Enter ou espaço pulam a animação. Com movimento reduzido no
 * sistema ou ?loader=0 no endereço, nada é exibido.
 */
const SCREENS = {
  '/': { kind: 'boot', sound: 'power', label: 'SYSTEM 84 / LIGANDO TERMINAL', detail: 'POST · MEMÓRIA 640K OK', ms: 1300 },
  '/filmes': { kind: 'projector', sound: 'tape', label: 'PROJETOR 35MM / FILMES', detail: 'ALINHANDO FOTOGRAMAS', ms: 1700 },
  '/series': { kind: 'tv', sound: 'static', label: 'TELEVISOR / SÉRIES', detail: 'SINTONIZANDO CANAL 02', ms: 1500 },
  '/livros': { kind: 'book', sound: 'floppy', label: 'BIBLIOTECA / LIVROS', detail: 'ABRINDO O VOLUME', ms: 1500 },
  '/lost-media': { kind: 'recovery', sound: 'disk', label: 'RECUPERAÇÃO / LOST MEDIA', detail: 'SETOR 84 · SETORES DANIFICADOS', ms: 1600 },
  '/analog-horror': { kind: 'broadcast', sound: 'static', label: 'TRANSMISSÃO INTERROMPIDA', detail: 'POR FAVOR, AGUARDE', ms: 1700 },
  '/arg': { kind: 'cipher', sound: 'modem', label: 'COFRE 84 / ENIGMAS', detail: 'DESCRIPTOGRAFANDO', ms: 1600 },
  '/linha-do-tempo': { kind: 'timeline', sound: 'tape', label: 'CRONOLOGIA / LINHA DO TEMPO', detail: 'REBOBINANDO O TEMPO', ms: 1500 },
  '/pesquisa': { kind: 'radar', sound: 'modem', label: 'VARREDURA / PESQUISA', detail: 'RASTREANDO O ACERVO', ms: 1300 },
  '/comunidade': { kind: 'bbs', sound: 'modem', label: 'BBS 84.7 / COMUNIDADE', detail: 'DISCANDO 084-1984', ms: 1500 },
  '/sobre': { kind: 'globe', sound: 'power', label: 'SYSTEM 84 / O PROJETO', detail: 'DESENHANDO O SINAL', ms: 1300 },
  '/admin-financeiro': { kind: 'scan', sound: 'floppy', label: 'ACESSO RESTRITO', detail: 'VERIFICANDO CREDENCIAIS', ms: 800 },
}

const RECORD_SCREEN = { kind: 'folder', sound: 'floppy', label: 'ARQUIVO / ABRINDO REGISTRO', detail: 'LEITURA DE SETOR', ms: 850 }
const DEFAULT_SCREEN = { kind: 'scan', sound: 'floppy', label: 'ABRINDO DIRETÓRIO', detail: 'LEITURA DE SETOR', ms: 700 }

function screenFor(pathname) {
  if (SCREENS[pathname]) return SCREENS[pathname]
  if (pathname.startsWith('/obra/')) return { ...RECORD_SCREEN, detail: `REGISTRO ${pathname.split('/').pop().toUpperCase()}` }
  return DEFAULT_SCREEN
}

const raf = (callback) => (typeof window !== 'undefined' && window.requestAnimationFrame ? window.requestAnimationFrame(callback) : setTimeout(() => callback(performance.now()), 16))
const caf = (id) => (typeof window !== 'undefined' && window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : clearTimeout(id))

/* Texto que embaralha caracteres até revelar a mensagem (ARG). */
function Scramble({ text, ms }) {
  const [shown, setShown] = useState(text.replace(/\S/g, '#'))
  useEffect(() => {
    const glyphs = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const start = performance.now()
    let frame
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / (ms * 0.75))
      const fixed = Math.floor(progress * text.length)
      setShown(text.split('').map((char, index) => (char === ' ' || index < fixed ? char : glyphs[Math.floor(Math.random() * glyphs.length)])).join(''))
      if (progress < 1) frame = raf(tick)
    }
    frame = raf(tick)
    return () => caf(frame)
  }, [text, ms])
  return <span className="cipher-text">{shown}</span>
}

/* Contador de anos para a linha do tempo. */
function YearCounter({ from, to, ms }) {
  const [year, setYear] = useState(from)
  useEffect(() => {
    const start = performance.now()
    let frame
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / (ms * 0.8))
      const eased = 1 - Math.pow(1 - progress, 3)
      setYear(Math.round(from + (to - from) * eased))
      if (progress < 1) frame = raf(tick)
    }
    frame = raf(tick)
    return () => caf(frame)
  }, [from, to, ms])
  return <span className="year-counter">{year < 0 ? `${Math.abs(year)} a.C.` : year}</span>
}

/* Linhas de terminal que aparecem uma a uma (BBS). */
function TypedLines({ lines, ms }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = (ms * 0.8) / lines.length
    const timers = lines.map((_, index) => setTimeout(() => setCount(index + 1), step * index))
    return () => timers.forEach(clearTimeout)
  }, [lines, ms])
  return <span className="bbs-lines">{lines.slice(0, count).map((line) => <span key={line}>{line}</span>)}<i className="bbs-caret" /></span>
}

const BBS_LINES = ['ATZ', 'OK', 'ATDT 084-1984', 'CONNECT 2400', 'BEM-VINDO AO BBS 84.7', 'OPERADORES ONLINE: 17']

function ScreenArt({ kind, ms, detail }) {
  switch (kind) {
    case 'boot':
      return (
        <div className="intro-art art-boot" aria-hidden="true">
          <span className="boot-mark"><i className="boot-bracket left" /><b>84</b><i className="boot-bracket right" /></span>
          <span className="boot-word">SYSTEM 84</span>
          <span className="boot-sweep" />
        </div>
      )
    case 'projector':
      return (
        <div className="intro-art art-projector" aria-hidden="true">
          <span className="sprockets left">{Array.from({ length: 14 }).map((_, i) => <i key={i} />)}</span>
          <span className="leader">
            <span className="leader-sweep" />
            <span className="leader-cross" />
            <span className="leader-ring" />
            <span className="leader-numbers"><b>3</b><b>2</b><b>1</b></span>
          </span>
          <span className="sprockets right">{Array.from({ length: 14 }).map((_, i) => <i key={i} />)}</span>
          <span className="projector-flicker" />
        </div>
      )
    case 'tv':
      return (
        <div className="intro-art art-tv" aria-hidden="true">
          <span className="tv-screen">
            <span className="tv-static" />
            <span className="tv-osd">CH 02</span>
            <span className="tv-poweron" />
          </span>
          <span className="tv-knobs"><i /><i /></span>
        </div>
      )
    case 'book':
      return (
        <div className="intro-art art-book" aria-hidden="true">
          <span className="book">
            <span className="book-cover-left" />
            <span className="book-page p1"><i /><i /><i /><i /></span>
            <span className="book-page p2"><i /><i /><i /><i /></span>
            <span className="book-page p3"><i /><i /><i /><i /></span>
            <span className="book-cover-right"><i /><i /><i /><i /><i /></span>
          </span>
        </div>
      )
    case 'recovery':
      return (
        <div className="intro-art art-recovery" aria-hidden="true">
          <span className="sector-grid">{Array.from({ length: 48 }).map((_, i) => <i key={i} style={{ '--d': `${(i * 37) % 48}` }} />)}</span>
          <span className="recovery-text" data-text="RECUPERANDO FRAGMENTOS">RECUPERANDO FRAGMENTOS</span>
          <span className="redactions"><i /><i /><i /></span>
        </div>
      )
    case 'broadcast':
      return (
        <div className="intro-art art-broadcast" aria-hidden="true">
          <span className="color-bars">{Array.from({ length: 7 }).map((_, i) => <i key={i} />)}</span>
          <span className="color-bars-low">{Array.from({ length: 7 }).map((_, i) => <i key={i} />)}</span>
          <span className="broadcast-card"><b>ESTE NÃO É UM TESTE</b><small>CANAL 84 · {detail}</small></span>
          <span className="vhs-tracking" />
        </div>
      )
    case 'cipher':
      return (
        <div className="intro-art art-cipher" aria-hidden="true">
          <span className="dial"><i /><i /><i /><b /></span>
          <Scramble text="ACESSO AO COFRE 84 CONCEDIDO" ms={ms} />
        </div>
      )
    case 'timeline':
      return (
        <div className="intro-art art-timeline" aria-hidden="true">
          <YearCounter from={-700} to={2026} ms={ms} />
          <span className="timeline-axis">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ '--i': i, '--h': `${10 + ((i * 7) % 30)}px` }} />)}</span>
        </div>
      )
    case 'radar':
      return (
        <div className="intro-art art-radar" aria-hidden="true">
          <span className="radar">
            <span className="radar-sweep" />
            <i className="blip b1" /><i className="blip b2" /><i className="blip b3" /><i className="blip b4" />
          </span>
        </div>
      )
    case 'bbs':
      return (
        <div className="intro-art art-bbs" aria-hidden="true">
          <TypedLines lines={BBS_LINES} ms={ms} />
        </div>
      )
    case 'globe':
      return (
        <div className="intro-art art-globe" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <g fill="none" stroke="var(--fig-acid, #a8ff60)" strokeWidth="1.6">
              <circle cx="200" cy="200" r="150" pathLength="1" />
              <ellipse cx="200" cy="200" rx="58" ry="150" pathLength="1" />
              <ellipse cx="200" cy="200" rx="108" ry="150" pathLength="1" />
              <ellipse cx="200" cy="200" rx="150" ry="46" pathLength="1" />
              <ellipse cx="200" cy="200" rx="150" ry="92" pathLength="1" />
            </g>
            <ellipse className="globe-orbit" cx="200" cy="200" rx="192" ry="66" fill="none" stroke="var(--fig-ember, #ff6332)" strokeWidth="9" transform="rotate(-18 200 200)" pathLength="1" />
          </svg>
        </div>
      )
    case 'folder':
      return (
        <div className="intro-art art-folder" aria-hidden="true">
          <span className="folder">
            <span className="folder-back" />
            <span className="folder-sheet" />
            <span className="folder-front"><b>CONFIDENCIAL</b></span>
          </span>
        </div>
      )
    default:
      return (
        <div className="intro-art art-scan" aria-hidden="true">
          <span className="scan-bar" />
        </div>
      )
  }
}

/* Com ?loader=0 a abertura não aparece (útil para capturas e para quem prefere). */
function loaderDisabled() {
  if (typeof window === 'undefined') return false
  const search = window.location.search || window.location.hash.split('?')[1] || ''
  const value = new URLSearchParams(search).get('loader')
  return value === '0' || value === 'off'
}

function reducedMotion() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return false }
}

export default function RouteTransition({ children }) {
  const { pathname } = useLocation()
  const [readyPath, setReadyPath] = useState(null)
  const lastSound = useRef(0)
  const screen = screenFor(pathname)
  const skipLoader = loaderDisabled()
  const busy = readyPath !== pathname && !skipLoader

  useEffect(() => {
    if (loaderDisabled()) { setReadyPath(pathname); return undefined }
    const duration = reducedMotion() ? 0 : screen.ms
    const timer = setTimeout(() => setReadyPath(pathname), duration)

    const now = Date.now()
    if (duration && now - lastSound.current > 400) {
      lastSound.current = now
      const play = loadingSounds[screen.sound]
      if (play) play()
      keyClack()
    }

    const skip = (event) => {
      if (event.type === 'keydown' && !['Escape', 'Enter', ' '].includes(event.key)) return
      setReadyPath(pathname)
    }
    window.addEventListener('keydown', skip)
    return () => { clearTimeout(timer); window.removeEventListener('keydown', skip) }
  }, [pathname, screen.ms, screen.sound])

  /* Ao trocar de página, voltar ao topo (o Router não faz isso sozinho). */
  useEffect(() => { try { window.scrollTo(0, 0) } catch { /* jsdom */ } }, [pathname])

  return (
    <div className={`route-stage mode-${screen.kind}`}>
      {busy && (
        <div
          className={`route-loader intro intro-${screen.kind}`}
          role="status"
          aria-live="polite"
          style={{ '--load-time': `${screen.ms}ms` }}
          onClick={() => setReadyPath(pathname)}
        >
          <div className="intro-frame">
            <span className="loader-chrome">
              <i /><i /><i />
              <b>{screen.label}</b>
            </span>

            <ScreenArt kind={screen.kind} ms={screen.ms} detail={screen.detail} />

            <span className="loader-detail">&gt; {screen.detail}<span className="intro-caret">_</span></span>
            <span className="loader-progress"><i /></span>
            <span className="intro-skip">CLIQUE OU ESC PARA PULAR</span>
          </div>
        </div>
      )}

      <div
        key={pathname}
        className={busy ? 'route-content waiting' : `route-content ready enter-${screen.kind}`}
        inert={busy ? true : undefined}
        aria-hidden={busy || undefined}
      >
        {children}
      </div>
    </div>
  )
}
