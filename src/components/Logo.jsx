import { Link } from 'react-router-dom'
export default function Logo({ compact = false }) {
  return <span className={`identity ${compact ? 'is-compact' : ''}`} aria-hidden="true">
    <svg className="identity-symbol" viewBox="0 0 48 48" fill="none" focusable="false"><path d="M3 16V3h13M32 3h13v13M45 32v13H32M16 45H3V32" stroke="currentColor" strokeWidth="3"/><path d="M6 24Q24 3 42 24Q24 45 6 24Z" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="24" r="7" fill="currentColor"/><circle cx="26" cy="22" r="2" fill="#080b09"/></svg>
    <span className="identity-word">SYSTEM<span>84<span className="identity-dot">·</span></span></span>
    {!compact && <span className="identity-caption">CULTURAL<br/>MEMORY SYSTEM</span>}
  </span>
}
export function LogoLink({ to = '/', compact = false, onClick }) {
  return <Link className="logo" to={to} onClick={onClick} aria-label="SYSTEM 84 — página inicial"><Logo compact={compact}/></Link>
}
