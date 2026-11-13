import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { playClick } from '../utils/audio'
import SoundControl from './SoundControl'
import { useAuth } from '../utils/auth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { currentUser, switchRole } = useAuth()

  function toggleMenu() {
    playClick()
    setOpen((value) => !value)
  }

  function closeMenu() {
    setOpen(false)
    playClick()
  }

  return (
    <header className="main-header">
      <NavLink to="/" className="logo" onClick={closeMenu}>
        <span>[</span>
        SYSTEM 84
        <span>]</span>
      </NavLink>

      <button
        className="menu-button"
        type="button"
        onClick={toggleMenu}
        aria-expanded={open}
      >
        {open ? 'FECHAR' : 'MENU'}
      </button>

      <nav className={`main-navigation ${open ? 'open' : ''}`}>
        <NavLink to="/" onClick={closeMenu}>INÍCIO</NavLink>
        <NavLink to="/filmes" onClick={closeMenu}>FILMES</NavLink>
        <NavLink to="/series" onClick={closeMenu}>SÉRIES</NavLink>
        <NavLink to="/livros" onClick={closeMenu}>LIVROS</NavLink>
        <NavLink to="/pesquisa" onClick={closeMenu}>PESQUISA</NavLink>
        <NavLink to="/lost-media" onClick={closeMenu}>LOST MEDIA</NavLink>
        <NavLink to="/analog-horror" onClick={closeMenu}>ANALOG HORROR</NavLink>
        <NavLink to="/arg" onClick={closeMenu}>ARG</NavLink>
        <NavLink to="/comunidade" onClick={closeMenu}>COMUNIDADE</NavLink>
        {currentUser.role === 'admin' && (
          <NavLink to="/admin-financeiro" onClick={closeMenu} style={{ color: '#ffcc00' }}>
            FINANCEIRO
          </NavLink>
        )}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', marginRight: '1rem' }}>
        <button
          type="button"
          onClick={() => {
            playClick()
            switchRole(currentUser.role === 'admin' ? 'creator' : 'admin')
          }}
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.5rem',
            background: currentUser.role === 'admin' ? '#442200' : '#003311',
            color: currentUser.role === 'admin' ? '#ffcc00' : '#33ff33',
            border: '1px solid currentColor',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
          title="Clique para alternar entre perfil Criador e Admin"
        >
          {currentUser.role === 'admin' ? 'MODO ADMIN' : 'MODO CRIADOR'}
        </button>
      </div>

      <SoundControl />
    </header>
  )
}
