import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import RouteTransition from './components/RouteTransition'
import useRetroSoundscape from './utils/useRetroSoundscape'
import { AuthProvider } from './utils/auth'

import Home from './pages/Home'
import AccessFlow from './components/AccessFlow'
import Entrance from './pages/Entrance'
const Filmes = lazy(() => import('./pages/Filmes'))
const Series = lazy(() => import('./pages/Series'))
const Livros = lazy(() => import('./pages/Livros'))
const Pesquisa = lazy(() => import('./pages/Pesquisa'))
const LostMedia = lazy(() => import('./pages/LostMedia'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Record = lazy(() => import('./pages/Record'))
const Comunidade = lazy(() => import('./pages/Comunidade'))
const AdminFinanceiro = lazy(() => import('./pages/AdminFinanceiro'))
const AnalogHorror = lazy(() => import('./pages/AnalogHorror'))
const Arg = lazy(() => import('./pages/Arg'))
const LinhaDoTempo = lazy(() => import('./pages/LinhaDoTempo'))
const Sobre = lazy(() => import('./pages/Sobre'))
const Enviar = lazy(() => import('./pages/Enviar'))

export default function App() {
  useRetroSoundscape()

  return (
    <AuthProvider>
      <div className="crt-overlay" aria-hidden="true" />

      <AccessFlow renderEntrance={onEnter => <Entrance onEnter={onEnter}/>}><RouteTransition><Suspense fallback={<p className='media-loading' role='status'>CARREGANDO DIRETÓRIO…</p>}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/series" element={<Series />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/lost-media" element={<LostMedia />} />
        <Route path="/analog-horror" element={<AnalogHorror />} />
        <Route path="/arg" element={<Arg />} />
        <Route path="/linha-do-tempo" element={<LinhaDoTempo />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/enviar" element={<Enviar />} />
        <Route path="/comunidade" element={<Comunidade />} />
        <Route path="/admin-financeiro" element={<AdminFinanceiro />} />
        <Route path="/obra/:id" element={<Record />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></RouteTransition></AccessFlow>
    </AuthProvider>
  )
}
