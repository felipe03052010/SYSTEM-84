import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import RouteTransition from './components/RouteTransition'
import { playClick } from './utils/audio'
import { AuthProvider } from './utils/auth'

import Home from './pages/Station'
import Filmes from './pages/Filmes'
import Series from './pages/Series'
import Livros from './pages/Livros'
import Pesquisa from './pages/Pesquisa'
import LostMedia from './pages/LostMedia'
import NotFound from './pages/NotFound'
import Record from './pages/Record'
import Comunidade from './pages/Comunidade'
import AdminFinanceiro from './pages/AdminFinanceiro'

export default function App() {
  useEffect(() => {
    const click = event => { if (event.target.closest('button:not(:disabled), a, summary, select')) playClick() }
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [])

  return (
    <AuthProvider>
      <div className="crt-overlay" aria-hidden="true" />

      <RouteTransition><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/series" element={<Series />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/lost-media" element={<LostMedia />} />
        <Route path="/comunidade" element={<Comunidade />} />
        <Route path="/admin-financeiro" element={<AdminFinanceiro />} />
        <Route path="/obra/:id" element={<Record />} />
        <Route path="*" element={<NotFound />} />
      </Routes></RouteTransition>
    </AuthProvider>
  )
}
