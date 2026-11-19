import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { playClick } from '../utils/audio'
import SoundControl from './SoundControl'
import { LogoLink } from './Logo'
import { useAuth } from '../utils/auth'

const LINKS = [
  ['Capa', '/'],
  ['Filmes', '/filmes'],
  ['Séries', '/series'],
  ['Livros', '/livros'],
  ['Lost media', '/lost-media'],
  ['Analog Horror', '/analog-horror'],
  ['Enigmas', '/arg'],
  ['Linha do tempo', '/linha-do-tempo'],
  ['Pesquisa', '/pesquisa'],
  ['Enviar', '/enviar'],
  ['Comunidade', '/comunidade'],
  ['Sobre', '/sobre'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const close = () => {
    setOpen(false)
    playClick()
  }

  return (
    <>
      <header className="main-header" aria-label="Cabeçalho do SYSTEM 84">
        <LogoLink onClick={close} />

        <button
          className="menu-button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          <span className="menu-button-kicker">ARQUIVO</span>
          <span>{open ? 'FECHAR' : 'MENU'}</span>
        </button>

        <nav id="main-navigation" className={`main-navigation ${open ? 'open' : ''}`}>
          {LINKS.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}>{label}</NavLink>
          ))}
          {currentUser.role === 'admin' && <NavLink to="/admin-financeiro" onClick={close}>Financeiro</NavLink>}
        </nav>

        <div className="header-tools">
          {currentUser.role === 'guest' ? (
            <Link className="pill-button" to="/entrada">Entrar</Link>
          ) : (
            <div className="header-user">
              <span>{currentUser.username}</span>
              <button className="ghost-button" onClick={async () => { try { await logout() } catch (e) { setError(e.message) } }}>Sair</button>
            </div>
          )}
          <SoundControl />
        </div>
      </header>
      {error && <p role="alert">{error}</p>}
    </>
  )
}
