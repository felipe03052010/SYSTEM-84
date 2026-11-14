import { Link } from 'react-router-dom'

/**
 * Logotipo do SYSTEM 84.
 *
 * Desenhado a partir das referências da pasta "pp": o "84" em blocos de
 * pixels de terminal (fonte de CPU de 8px), a moldura de vidro fosforescente
 * dos monitores CRT e a barra de varredura do VHS.
 */
export default function Logo({ compact = false }) {
  return (
    <span className={`logo-mark ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      <span className="logo-screen">
        <span className="logo-pixels" role="img" aria-label="84">
          <svg viewBox="0 0 42 22" shapeRendering="crispEdges" focusable="false">
            {/* 8 */}
            <path d="M1 1h7v2H1zM1 3h2v4H1zM6 3h2v4H6zM1 7h7v2H1zM1 9h2v4H1zM6 9h2v4H6zM1 13h7v2H1z" />
            {/* 4 */}
            <path d="M16 1h2v6h-2zM18 7h2v2h-2zM20 1h2v10h-2zM24 1h2v14h-2zM20 11h6v2h-6zM24 13h2v2h-2z" />
            {/* separador pixel */}
            <path d="M33 4h2v2h-2zM33 10h2v2h-2zM33 16h2v2h-2z" opacity="0.55" />
          </svg>
        </span>

        <span className="logo-word">SYSTEM</span>

        <span className="logo-scan" aria-hidden="true" />
        <span className="logo-glare" aria-hidden="true" />
      </span>

      {!compact && (
        <span className="logo-caption">
          <span>ARQUIVO CULTURAL</span>
          <span className="logo-led">● REC</span>
        </span>
      )}
    </span>
  )
}

export function LogoLink({ to = '/', compact = false, onClick }) {
  return (
    <Link className="logo" to={to} onClick={onClick} aria-label="SYSTEM 84 — página inicial">
      <Logo compact={compact} />
    </Link>
  )
}
