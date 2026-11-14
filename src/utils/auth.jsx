import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Senhas exclusivas de acesso seguro
export const PASSWORDS = {
  CREATOR: 'CRIADOR84',
  ADMIN: 'ADMIN84'
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('system84_user')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      id: 'usr_guest',
      username: 'Visitante',
      role: 'guest', // 'guest' | 'creator' | 'admin'
      isSubscriber: false,
      subscriptionPlan: 'Livre'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('system84_user', JSON.stringify(currentUser))
    } catch {}
  }, [currentUser])

  function loginWithPassword(passInput) {
    const trimmed = (passInput || '').trim()
    if (trimmed === PASSWORDS.ADMIN) {
      const user = {
        id: 'usr_admin',
        username: 'SYS_ADMIN_084',
        role: 'admin',
        isSubscriber: true,
        subscriptionPlan: 'Mestre da Rede'
      }
      setCurrentUser(user)
      return { success: true, role: 'admin' }
    } else if (trimmed === PASSWORDS.CREATOR) {
      const user = {
        id: 'usr_creator',
        username: 'Criador_Autorizado_84',
        role: 'creator',
        isSubscriber: true,
        subscriptionPlan: 'Plano Criador'
      }
      setCurrentUser(user)
      return { success: true, role: 'creator' }
    } else {
      return { success: false, error: 'Senha incorreta para Criador ou Admin.' }
    }
  }

  function logout() {
    const guest = {
      id: 'usr_guest',
      username: 'Visitante',
      role: 'guest',
      isSubscriber: false,
      subscriptionPlan: 'Livre'
    }
    setCurrentUser(guest)
  }

  return (
    <AuthContext.Provider value={{ currentUser, loginWithPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
