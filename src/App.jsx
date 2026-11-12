import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Filmes from './pages/Filmes'
import Series from './pages/Series'
import Livros from './pages/Livros'
import Pesquisa from './pages/Pesquisa'
import LostMedia from './pages/LostMedia'
import NotFound from './pages/NotFound'
import Record from './pages/Record'

export default function App() {
  return (
    <>
      <div className="crt-overlay" aria-hidden="true" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filmes" element={<Filmes />} />
        <Route path="/series" element={<Series />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/pesquisa" element={<Pesquisa />} />
        <Route path="/lost-media" element={<LostMedia />} />
        <Route path="/obra/:id" element={<Record />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
