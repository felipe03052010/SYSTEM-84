import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('system84_user')
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      id: 'usr_guest',
      username: 'Operador Padrão',
      role: 'creator', // 'creator' | 'admin'
      isSubscriber: true,
      subscriptionPlan: 'Trimestral VIP'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('system84_user', JSON.stringify(currentUser))
    } catch {}
  }, [currentUser])

  function switchRole(newRole) {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      username: newRole === 'admin' ? 'SYS_ADMIN_084' : 'Criador_84'
    }))
  }

  return (
    <AuthContext.Provider value={{ currentUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
