import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { loadingSounds, keyClack } from '../utils/retro-sounds'
import '../styles/loaders.css'

/**
 * Uma tela de carregamento diferente para cada rota.
 *
 * Cada tela tem um som próprio (disquete, modem, fita, estática, energia,
 * erro de disco) e uma animação própria, todas dentro da estética de
 * computador antigo. Rotas não mapeadas caem no "scan" genérico.
 */
const SCREENS = {
  '/': { kind: 'post', sound: 'power', label: 'LIGANDO TERMINAL', detail: 'POST · memória 640K OK', ms: 900 },
  '/filmes': { kind: 'tape', sound: 'tape', label: 'ALINHANDO FOTOGRAMAS', detail: 'DECK VHS · TRACKING', ms: 1100 },
  '/series': { kind: 'static', sound: 'static', label: 'SINTONIZANDO CANAIS', detail: 'ANTENA · CANAL 84', ms: 950 },
  '/livros': { kind: 'floppy', sound: 'floppy', label: 'LENDO DISQUETE', detail: 'DISCO A: · 1.44 MB', ms: 1000 },
  '/pesquisa': { kind: 'modem', sound: 'modem', label: 'CONECTANDO MODEM', detail: 'ATDT 084-1984', ms: 1150 },
  '/lost-media': { kind: 'disk', sound: 'disk', label: 'RECUPERANDO FRAGMENTOS', detail: 'SETOR 84 · SETORES RUINS', ms: 1200 },
  '/comunidade': { kind: 'bulletin', sound: 'modem', label: 'ENTRANDO NO BBS', detail: 'NÓ 84 · 2400 BAUD', ms: 1000 },
  '/admin-financeiro': { kind: 'scan', sound: 'floppy', label: 'VERIFICANDO CREDENCIAIS', detail: 'ACESSO RESTRITO', ms: 800 },
}

const DEFAULT_SCREEN = { kind: 'scan', sound: 'floppy', label: 'ABRINDO REGISTRO', detail: 'LEITURA DE SETOR', ms: 700 }

function ScreenArt({ kind }) {
  switch (kind) {
    case 'post':
      return (
        <div className="loader-art art-post" aria-hidden="true">
          <span className="post-rows">
            <i /><i /><i /><i /><i />
          </span>
          <span className="post-cursor" />
        </div>
      )
    case 'tape':
      return (
        <div className="loader-art art-tape" aria-hidden="true">
          <span className="tape-reel" /><span className="tape-reel" />
          <span className="tape-bars"><i /><i /><i /><i /><i /><i /><i /></span>
        </div>
      )
    case 'static':
      return (
        <div className="loader-art art-static" aria-hidden="true">
          <span className="static-noise" />
          <span className="static-line" />
        </div>
      )
    case 'floppy':
      return (
        <div className="loader-art art-floppy" aria-hidden="true">
          <span className="floppy-body">
            <i className="floppy-shutter" />
            <i className="floppy-label" />
          </span>
          <span className="floppy-blocks"><i /><i /><i /><i /><i /><i /></span>
        </div>
      )
    case 'modem':
      return (
        <div className="loader-art art-modem" aria-hidden="true">
          <span className="modem-lights"><i /><i /><i /><i /></span>
          <span className="modem-wave" />
        </div>
      )
    case 'disk':
      return (
        <div className="loader-art art-disk" aria-hidden="true">
          <span className="disk-grid">
            {Array.from({ length: 24 }).map((_, index) => <i key={index} />)}
          </span>
        </div>
      )
    case 'bulletin':
      return (
        <div className="loader-art art-bulletin" aria-hidden="true">
          <span className="bulletin-lines"><i /><i /><i /><i /></span>
          <span className="bulletin-cursor" />
        </div>
      )
    default:
      return (
        <div className="loader-art art-scan" aria-hidden="true">
          <span className="scan-bar" />
        </div>
      )
  }
}

/* Com ?loader=0 a tela de carregamento não aparece: serve para quem quer ver o
   site direto, e para o gerador do catálogo visual em PDF. */
function loaderDisabled() {
  if (typeof window === 'undefined') return false
  const search = window.location.search || window.location.hash.split('?')[1] || ''
  const value = new URLSearchParams(search).get('loader')
  return value === '0' || value === 'off'
}

export default function RouteTransition({ children }) {
  const { pathname } = useLocation()
  const [readyPath, setReadyPath] = useState(null)
  const lastSound = useRef(0)
  const screen = SCREENS[pathname] || DEFAULT_SCREEN
  const skipLoader = loaderDisabled()
  const busy = readyPath !== pathname && !skipLoader

  useEffect(() => {
    if (loaderDisabled()) { setReadyPath(pathname); return undefined }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 0 : screen.ms
    const timer = setTimeout(() => setReadyPath(pathname), duration)

    const now = Date.now()
    if (now - lastSound.current > 400) {
      lastSound.current = now
      const play = loadingSounds[screen.sound]
      if (play) play()
      keyClack()
    }

    return () => clearTimeout(timer)
  }, [pathname, screen.ms, screen.sound])

  return (
    <div className={`route-stage mode-${screen.kind}`}>
      {busy && (
        <div className="route-loader" role="status" aria-live="polite" style={{ '--load-time': `${screen.ms}ms` }}>
          <div className="loader-frame">
            <span className="loader-chrome">
              <i /><i /><i />
              <b>{screen.label}</b>
            </span>

            <ScreenArt kind={screen.kind} />

            <span className="loader-detail">&gt; {screen.detail}</span>
            <span className="loader-progress"><i /></span>
          </div>
        </div>
      )}

      <div
        key={pathname}
        className={busy ? 'route-content waiting' : 'route-content ready'}
        inert={busy ? true : undefined}
        aria-hidden={busy || undefined}
      >
        {children}
      </div>
    </div>
  )
}
