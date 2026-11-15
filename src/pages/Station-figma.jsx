import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import SoundControl from '../components/SoundControl'
import { records } from '../data/records'
import { playTyping, playClick } from '../utils/audio'
import { tapeRewind } from '../utils/retro-sounds'
import '../styles/station-v2.css'
import '../styles/figma.css'
import '../styles/figma-home.css'

/**
 * Capa no desenho do Figma "SYSTEM 84 — Identidade & Web" (node 2:28):
 * navegação de 110px, herói com manifesto em Syncopate e objeto óptico,
 * fita de categorias ácida, acervo em destaque, faixa de frequências
 * perdidas e convite à comunidade.
 */

const categories = [
  { label: 'ASSISTIR', to: '/filmes' },
  { label: 'LER', to: '/livros' },
  { label: 'DESCOBRIR', to: '/series' },
  { label: 'PRESERVAR', to: '/comunidade' },
]

const formatFilters = [
  { label: 'Todos', type: null },
  { label: 'Filmes', type: 'filme' },
  { label: 'Séries', type: 'serie' },
  { label: 'Livros', type: 'livro' },
  { label: 'Lost media', type: 'lost-media' },
]

const count = (type) => records.filter((record) => record.type === type).length
const total = records.length
const pad = (value) => String(value).padStart(3, '0')

const yearOf = (record) => {
  const source = `${record.year || ''} ${record.date || ''} ${record.meta || ''} ${record.origin || ''}`
  const match = source.match(/\b(1[89]\d{2}|20\d{2})\b/)
  return match ? match[1] : 'S/D'
}

const typeLabel = (record) => {
  if (record.type === 'livro') return 'LIVRO'
  if (record.type === 'serie' || record.type === 'série') return 'SÉRIE'
  if (record.type === 'lost-media') return 'PERDIDO'
  return 'FILME'
}

const types = ['filme', 'livro', 'serie', 'série', 'lost-media']
const featured = records.filter((record) => types.includes(record.type)).slice(0, 4)

export default function StationFigma() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(null)
  const navigate = useNavigate()

  function search(event) {
    event.preventDefault()
    playClick()
    if (!query.trim()) return
    navigate(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  const shelf = filter ? featured.filter((record) => record.type === filter) : featured
  const shown = shelf.length ? shelf : featured

  return (
    <Layout className="station-page figma-page">
      {/* ── Herói ─────────────────────────────────────────────── */}
      <section className="fig-hero">
        <div className="fig-frequency">
          <span>ARQUIVO CULTURAL INDEPENDENTE / VOL. 084</span>
          <span className="fig-status"><i className="live-dot" /> SISTEMA ONLINE</span>
        </div>

        <div className="fig-hero-body">
          <div className="fig-manifesto">
            <h1>MEMÓRIA<br />FORA DO<br />TEMPO.</h1>
            <p>
              Cinema, literatura e fragmentos fora de órbita.<br />
              Um arquivo vivo para tudo que merece continuar existindo.
            </p>
            <div className="fig-hero-actions">
              <Link to="/filmes" className="fig-btn fig-btn-primary" onClick={playClick}>EXPLORAR ACERVO ↗</Link>
              <Link to="/lost-media" className="fig-btn fig-btn-secondary" onClick={playClick}>SINTONIZAR LOST MEDIA</Link>
            </div>
          </div>

          <figure className="fig-optical">
            <div className="optical-object" aria-hidden="true">
              <span className="optical-rings" />
              <span className="optical-arc" />
              <span className="optical-node" />
              <span className="optical-frame" />
            </div>
            <figcaption>FIG. 084 — MEMÓRIA EM TRANSMISSÃO</figcaption>
          </figure>
        </div>
      </section>

      {/* ── Fita de categorias ───────────────────────────────── */}
      <nav className="category-tape station-directories" aria-label="Categorias do acervo">
        {categories.map((item) => (
          <Link key={item.label} to={item.to} onClick={playClick}>
            {item.label} <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </nav>

      {/* ── Acervo em destaque ───────────────────────────────── */}
      <section className="fig-section fig-archive">
        <span className="fig-label">01 / ACERVO EM DESTAQUE</span>

        <div className="fig-archive-head">
          <h2>Memórias em circulação.</h2>
          <Link to="/pesquisa" className="fig-link" onClick={playClick}>VER TODOS OS REGISTROS ↗</Link>
        </div>

        <div className="fig-filters">
          {formatFilters.map((item) => (
            <button
              key={item.label}
              type="button"
              className={filter === item.type ? 'is-active' : ''}
              aria-pressed={filter === item.type}
              onClick={() => { playClick(); setFilter(item.type) }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="fig-shelf">
          {shown.map((record) => (
            <Link key={record.id} to={`/obra/${record.id}`} className="fig-card" onClick={playClick}>
              <div className="fig-cover">
                <span className="fig-cover-label">CAPA / SYSTEM 84</span>
                <div className="fig-cover-art" aria-hidden="true">
                  <span className="art-ring" />
                  <span className="art-arc" />
                  <span className="art-glyph" />
                </div>
                <strong className="fig-cover-title">{record.title}</strong>
              </div>
              <span className="fig-card-meta">{typeLabel(record)} / {yearOf(record)}</span>
              <span className="fig-card-title">{record.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Frequências perdidas ─────────────────────────────── */}
      <section className="fig-lost">
        <div>
          <span className="fig-label fig-label-ember">02 / FREQUÊNCIAS PERDIDAS</span>
          <h2>NEM TUDO<br />DESAPARECE<br />POR COMPLETO.</h2>
          <p>Rastreie fragmentos. Cruze fontes. Reconstrua a história.</p>
          <Link to="/lost-media" className="fig-btn fig-btn-primary" onClick={playClick}>ABRIR DOSSIÊS ↗</Link>
        </div>
        <div className="fig-lost-signal">
          <span className="fig-lost-glyph" aria-hidden="true">[ ? ]</span>
          <span className="fig-lost-note">SINAL NÃO IDENTIFICADO<br />AGUARDANDO NOVAS PISTAS_</span>
        </div>
      </section>

      {/* ── Comunidade ───────────────────────────────────────── */}
      <section className="fig-community">
        <span className="fig-label">03 / CANAL ABERTO</span>
        <h2>Toda memória precisa de alguém.</h2>
        <div className="fig-community-row">
          <p>Compartilhe descobertas, documente pistas e encontre outras pessoas na mesma frequência.</p>
          <Link to="/comunidade" className="fig-btn fig-btn-primary" onClick={playClick}>ENTRAR NA COMUNIDADE ↗</Link>
        </div>
      </section>

      {/* ── Console de pesquisa ──────────────────────────────── */}
      <section className="fig-console">
        <form className="fig-search" onSubmit={search}>
          <label htmlFor="station-query">BUSCAR NO ARQUIVO</label>
          <div className="fig-search-field">
            <input
              id="station-query"
              aria-label="Buscar no arquivo por título, autor ou ano"
              type="search"
              value={query}
              placeholder="título, autor ou ano..."
              onChange={(event) => { setQuery(event.target.value); playTyping() }}
            />
            <button type="submit">BUSCAR ↗</button>
          </div>
        </form>
        <div className="fig-console-side">
          <span>{pad(total)} REGISTROS / {pad(count('filme'))} FILMES / {pad(count('livro'))} LIVROS</span>
          <button
            type="button"
            className="fig-btn fig-btn-secondary"
            onClick={() => { tapeRewind(); setQuery('') }}
          >
            LIMPAR CONSULTA
          </button>
          <SoundControl />
        </div>
      </section>
    </Layout>
  )
}
