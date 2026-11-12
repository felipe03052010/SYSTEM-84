import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { playClick } from '../utils/audio'

export default function Header() {
  const [open, setOpen] = useState(false)

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
      </nav>

      <div className="system-online">
        <span className="online-light" />
        SISTEMA ONLINE
      </div>
    </header>
  )
}
