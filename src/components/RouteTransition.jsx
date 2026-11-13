import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/interaction.css'

const modes = { '/': ['home', 'RESTAURANDO TERMINAL', 240], '/filmes': ['film', 'ALINHANDO FOTOGRAMAS', 420], '/series': ['series', 'SINTONIZANDO CANAIS', 380], '/livros': ['book', 'ABRINDO PÁGINAS', 300], '/pesquisa': ['search', 'INDEXANDO MEMÓRIA', 260], '/lost-media': ['lost', 'RECUPERANDO FRAGMENTOS', 460], '/analog-horror': ['analog', 'AJUSTANDO TRACKING', 520], '/arg': ['arg', 'DECODIFICANDO SINAL', 480] }
export default function RouteTransition({ children }) {
  const { pathname } = useLocation()
  const [readyPath, setReadyPath] = useState(null)
  const [mode, label, duration] = modes[pathname] || ['record', 'ABRINDO REGISTRO', 220]
  const busy = readyPath !== pathname
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(() => setReadyPath(pathname), reduced ? 0 : duration)
    return () => clearTimeout(timer)
  }, [pathname, duration])
  return <div className={`route-stage mode-${mode}`}>
    {busy && <div className="route-loader" role="status" style={{ '--load-time': `${duration}ms` }}><span>{label}</span><div className="loader-art"><i /><i /><i /><i /><i /></div></div>}
    <div key={pathname} className={busy ? 'route-content waiting' : 'route-content ready'} inert={busy ? true : undefined} aria-hidden={busy || undefined}>{children}</div>
  </div>
}
