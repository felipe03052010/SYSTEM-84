import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { playClick } from '../utils/audio'
import SoundControl from './SoundControl'
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
          <NavLink to="/comunidade" onClick={closeMenu}>COMUNIDADE</NavLink>
          {currentUser.role === 'admin' && (
            <NavLink to="/admin-financeiro" onClick={closeMenu} style={{ color: '#ffcc00' }}>
              FINANCEIRO
            </NavLink>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginLeft: 'auto', marginRight: '1rem' }}>
          {currentUser.role === 'guest' ? (
            <button
              type="button"
              onClick={() => {
                playClick()
                setShowAuthModal(true)
                setAuthError('')
              }}
              style={{
                fontSize: '0.72rem',
                padding: '0.3rem 0.6rem',
                background: '#041209',
                color: 'var(--green-bright)',
                border: '1px solid var(--green)',
                cursor: 'pointer',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}
            >
              [ ENTRAR / SENHA ]
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: currentUser.role === 'admin' ? '#ffcc00' : 'var(--green-bright)' }}>
                [{currentUser.role === 'admin' ? 'ADMIN' : 'CRIADOR'}]
              </span>
              <button
                type="button"
                onClick={() => {
                  playClick()
                  logout()
                }}
                style={{
                  fontSize: '0.65rem',
                  padding: '0.2rem 0.4rem',
                  background: 'transparent',
                  color: 'var(--amber)',
                  border: '1px solid var(--amber)',
                  cursor: 'pointer'
                }}
              >
                SAIR
              </button>
            </div>
          )}
        </div>

        <SoundControl />
      </header>

      {showAuthModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 10000,
          display: 'grid',
          placeItems: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#030c07',
            border: '1px solid var(--green)',
            padding: '2rem',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 0 30px rgba(56,239,125,0.25)',
            position: 'relative'
          }}>
            <h3 style={{ color: 'var(--green-bright)', fontFamily: 'var(--font-terminal)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              &gt; AUTENTICAÇÃO DO TERMINAL
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#88cc88', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Digite a senha exclusiva para liberar o acesso:
              <br />
              &bull; Senha Criador: <strong>{PASSWORDS.CREATOR}</strong> (Acesso para ler e assistir)
              <br />
              &bull; Senha Admin: <strong>{PASSWORDS.ADMIN}</strong> (Acesso completo e painel financeiro)
            </p>

            <form onSubmit={handleLoginSubmit}>
              <input
                type="password"
                autoFocus
                placeholder="DIGITE A SENHA..."
                value={inputPass}
                onChange={e => setInputPass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  background: '#000',
                  color: 'var(--green-bright)',
                  border: '1px solid var(--green-dark)',
                  fontFamily: 'monospace',
                  marginBottom: '1rem'
                }}
              />

              {authError && (
                <div style={{ color: '#ff4444', fontSize: '0.75rem', marginBottom: '1rem' }}>
                  {authError}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: 'transparent',
                    color: '#888',
                    border: '1px solid #555'
                  }}
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.4rem 1.2rem',
                    background: 'var(--green)',
                    color: '#000',
                    border: '1px solid var(--green)',
                    fontWeight: 'bold'
                  }}
                >
                  CONFIRMAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
