import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { playClick } from '../utils/audio'
import SoundControl from './SoundControl'
import { LogoLink } from './Logo'
import { useAuth, PASSWORDS } from '../utils/auth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [inputPass, setInputPass] = useState('')
  const [authError, setAuthError] = useState('')
  const { currentUser, loginWithPassword, logout } = useAuth()

  function toggleMenu() {
    playClick()
    setOpen((value) => !value)
  }

  function closeMenu() {
    setOpen(false)
    playClick()
  }

  function handleLoginSubmit(e) {
    e.preventDefault()
    playClick()
    const res = loginWithPassword(inputPass)
    if (res.success) {
      setInputPass('')
      setAuthError('')
      setShowAuthModal(false)
    } else {
      setAuthError(res.error)
    }
  }

  return (
    <>
      <header className="main-header">
        <LogoLink onClick={closeMenu} />

        <button
          className="menu-button"
          type="button"
          onClick={toggleMenu}
          aria-expanded={open}
        >
          {open ? 'FECHAR' : 'MENU'}
        </button>

        <nav className={`main-navigation ${open ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} end>Início</NavLink>
          <NavLink to="/filmes" onClick={closeMenu}>Filmes</NavLink>
          <NavLink to="/series" onClick={closeMenu}>Séries</NavLink>
          <NavLink to="/livros" onClick={closeMenu}>Livros</NavLink>
          <NavLink to="/pesquisa" onClick={closeMenu}>Pesquisa</NavLink>
          <NavLink to="/lost-media" onClick={closeMenu}>Lost media</NavLink>
          <NavLink to="/comunidade" onClick={closeMenu}>Comunidade</NavLink>
          {currentUser.role === 'admin' && (
            <NavLink to="/admin-financeiro" onClick={closeMenu}>Financeiro</NavLink>
          )}
        </nav>

        <div className="header-tools">
          {currentUser.role === 'guest' ? (
            <button
              className="pill-button"
              type="button"
              onClick={() => {
                playClick()
                setShowAuthModal(true)
                setAuthError('')
              }}
            >
              Entrar
            </button>
          ) : (
            <div className="header-user">
              <span>
                {currentUser.role === 'admin' ? 'ADMIN' : 'CRIADOR'}
              </span>
              <button
                className="ghost-button"
                type="button"
                onClick={() => {
                  playClick()
                  logout()
                }}
              >
                Sair
              </button>
            </div>
          )}

          <SoundControl />
        </div>
      </header>

      {showAuthModal && (
        <div className="auth-backdrop">
          <div className="auth-card" role="dialog" aria-modal="true">
            <h3>&gt; AUTENTICAÇÃO DO TERMINAL</h3>
            <p>
              Digite a senha exclusiva para liberar o acesso:
              <br />
              &bull; Criador: <strong>{PASSWORDS.CREATOR}</strong> — ler e assistir
              <br />
              &bull; Admin: <strong>{PASSWORDS.ADMIN}</strong> — acesso completo e painel financeiro
            </p>

            <form onSubmit={handleLoginSubmit}>
              <input
                type="password"
                autoFocus
                placeholder="DIGITE A SENHA..."
                value={inputPass}
                onChange={(e) => setInputPass(e.target.value)}
              />

              {authError && <div className="auth-error">{authError}</div>}

              <div className="auth-actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancelar
                </button>
                <button className="pill-button is-accent" type="submit">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
