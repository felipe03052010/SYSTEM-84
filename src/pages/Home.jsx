import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import SoundControl from '../components/SoundControl'
import { records } from '../data/records'
import { playTyping, playClick } from '../utils/audio'
import { tapeRewind } from '../utils/retro-sounds'
import {
  DossierCounters,
  DossierMasthead,
  DossierFooter,
  FrameMarks,
  ItemGlyph,
  Panel,
  SectionMark,
  UiIcon,
  WireGlobe,
  countOf,
  pad,
  typeLabel,
  yearOf,
} from '../components/Chassis'
import '../styles/station-v2.css'
import '../styles/figma.css'
import '../styles/figma-home.css'
import '../styles/dossie.css'

/**
 * Página inicial do SYSTEM 84: abertura com o globo de arame e o sinal do
 * dia, contadores do acervo, fita de categorias, destaques com filtro,
 * recém-chegados, coleções temáticas, faixa da linha do tempo, fitas e
 * enigmas, lost media, comunidade e console de busca.
 */

const categories = [
  { label: 'ASSISTIR', to: '/filmes', icon: 'film' },
  { label: 'LER', to: '/livros', icon: 'book' },
  { label: 'INVESTIGAR', to: '/lost-media', icon: 'lost' },
  { label: 'DECIFRAR', to: '/arg', icon: 'key' },
  { label: 'PRESERVAR', to: '/comunidade', icon: 'people' },
]

const formatFilters = [
  { label: 'TODOS', type: null },
  { label: 'FILMES', type: 'filme' },
  { label: 'SÉRIES', type: 'série' },
  { label: 'LIVROS', type: 'livro' },
  { label: 'LOST MEDIA', type: 'lost-media' },
  { label: 'FITAS', type: 'analog-horror' },
  { label: 'ENIGMAS', type: 'arg' },
]

const total = records.length
const byId = (id) => records.find((record) => record.id === id)

/* Destaques: um ou dois títulos fortes de cada coleção. */
const FEATURED_IDS = [1, 2, 601, 9, 10, 707, 5, 6, 806, 408, 901, 951]
const featured = FEATURED_IDS.map(byId).filter(Boolean)

const recent = records.filter((record) => record.isNew).slice(-8).reverse()

/* Coleções temáticas: curadoria por etiqueta, autor ou lista fixa. */
const THEMES = [
  {
    title: 'Expressionismo e horror mudo',
    note: 'Sombras tortas, vampiros e cenários pintados.',
    query: 'mudo',
    pick: (record) => record.type === 'filme' && record.year < 1930 && (record.tags || []).some((tag) => /terror|expressionismo|gótico/.test(tag)),
  },
  {
    title: 'Literatura brasileira',
    note: 'Machado, Alencar, Aluísio, Lima Barreto e Pompeia.',
    query: 'literatura brasileira',
    pick: (record) => (record.tags || []).includes('literatura brasileira') || ['Machado de Assis'].includes(record.author),
  },
  {
    title: 'Clássicos portugueses',
    note: 'De Camões a Eça de Queirós.',
    query: 'literatura portuguesa',
    pick: (record) => (record.tags || []).includes('literatura portuguesa') || record.author === 'Júlio Dinis',
  },
  {
    title: 'Ficção científica pioneira',
    note: 'Foguetes, máquinas do tempo e mundos perdidos.',
    query: 'ficção científica',
    pick: (record) => [4, 2, 12, 117, 121, 602, 5, 509].includes(record.id),
  },
  {
    title: 'Animação livre',
    note: 'Curtas da Blender em Creative Commons.',
    query: 'blender',
    pick: (record) => /Blender/.test(record.author || ''),
  },
  {
    title: 'Cinema brasileiro perdido e salvo',
    note: 'Pelotas, Recife e o nitrato de Limite.',
    query: 'cinema brasileiro',
    pick: (record) => (record.tags || []).includes('cinema brasileiro') || record.id === 416,
  },
]

/* Sinal do dia: muda a cada dia, igual para todo mundo. */
function signalOfTheDay() {
  const pool = records.filter((record) => record.media?.length)
  const day = Math.floor(Date.now() / 86400000)
  return pool[day % pool.length]
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(null)
  const navigate = useNavigate()
  const daily = useMemo(signalOfTheDay, [])

  const themes = useMemo(() => THEMES.map((theme) => ({ ...theme, items: records.filter(theme.pick) })), [])
  const decades = useMemo(() => {
    const set = new Map()
    records.forEach((record) => {
      if (record.year < 1800 || record.year > 2030) return
      const decade = Math.floor(record.year / 10) * 10
      set.set(decade, (set.get(decade) || 0) + 1)
    })
    return [...set.entries()].sort((a, b) => a[0] - b[0])
  }, [])
  const peak = Math.max(...decades.map(([, value]) => value))

  function search(event) {
    event.preventDefault()
    playClick()
    if (!query.trim()) return
    navigate(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  const shelf = filter ? records.filter((record) => record.type === filter).slice(0, 7) : featured.slice(0, 11)

  return (
    <Layout className="station-page figma-page dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        {/* ── Abertura ─────────────────────────────────────────────── */}
        <section className="prancha prancha-hero">
          <div className="hero-grid home-hero-grid">
            <div className="hero-copy">
              <h1 className="glitch-title" data-text="MEMÓRIA FORA DO TEMPO.">MEMÓRIA<br />FORA DO<br />TEMPO.</h1>
              <p className="hero-lead">
                Um arquivo digital de filmes, séries, livros e obras perdidas que já são de todos.
                Assista e leia dentro do site, descubra a origem de cada cópia e investigue o que
                o tempo quase apagou.
              </p>

              <div className="hero-actions">
                <Link to="/filmes" className="fig-btn fig-btn-primary" onClick={playClick}>EXPLORAR ACERVO ↗</Link>
                <Link to="/lost-media" className="fig-btn fig-btn-secondary" onClick={playClick}>SINTONIZAR LOST MEDIA</Link>
              </div>
            </div>

            <figure className="hero-figure">
              <FrameMarks />
              <WireGlobe className="spin-globe" />
              <figcaption>FIG. 084 — MEMÓRIA EM TRANSMISSÃO</figcaption>
            </figure>

            {daily && (
              <Panel title="SINAL DO DIA" tone="acid" className="panel-daily" aside={<span className="live-chip"><i /> AO VIVO</span>}>
                <Link to={`/obra/${daily.id}`} className="daily-card" onClick={playClick}>
                  <span className="item-kicker">{typeLabel(daily)} / {yearOf(daily)}</span>
                  <span className="daily-art"><ItemGlyph record={daily} size={88} /></span>
                  <strong>{daily.title}</strong>
                  {daily.author && <em>{daily.author}</em>}
                  <span className="daily-desc">{daily.description}</span>
                  <span className="daily-cta">{daily.type === 'livro' ? 'LER AGORA' : 'ASSISTIR AGORA'} ↗</span>
                </Link>
              </Panel>
            )}
          </div>

          <div className="hero-counters">
            <SectionMark>ESTRUTURA GLOBAL DO ACERVO / {pad(total)} REGISTROS</SectionMark>
            <DossierCounters />
          </div>
        </section>

        {/* ── Fita de categorias ──────────────────────────────────── */}
        <nav className="category-tape station-directories" aria-label="Categorias do acervo">
          {categories.map((item) => (
            <Link key={item.label} to={item.to} onClick={playClick}>
              <UiIcon name={item.icon} size={18} />
              {item.label} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>

        {/* ── Destaques ───────────────────────────────────────────── */}
        <section className="prancha prancha-acervo">
          <SectionMark>DESTAQUES DO ACERVO / ITENS EM EVIDÊNCIA</SectionMark>

          <div className="acervo-grid">
            <div className="acervo-items">
              <div className="dossier-filters">
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

              <div className="item-grid home-item-grid" key={filter || 'all'}>
                {shelf.map((record) => (
                  <Link key={record.id} to={`/obra/${record.id}`} className="item-card" onClick={playClick}>
                    <span className="item-kicker">{typeLabel(record)} / {yearOf(record)}</span>
                    <span className="item-art">
                      <ItemGlyph record={record} size={84} />
                    </span>
                    <strong className="item-title">{record.title}</strong>
                  </Link>
                ))}
                <Link to="/pesquisa" className="item-card is-more" onClick={playClick}>
                  <span className="item-kicker">CATÁLOGO / COMPLETO</span>
                  <span className="item-art"><UiIcon name="archive" size={54} /></span>
                  <strong className="item-title">+{pad(total - shelf.length)} REGISTROS<br />VER CATÁLOGO ↗</strong>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Recém-chegados ──────────────────────────────────────── */}
        {recent.length > 0 && (
          <section className="prancha prancha-recent">
            <SectionMark tone="ember">RECÉM-CHEGADOS AO ARQUIVO</SectionMark>
            <div className="recent-strip">
              {recent.map((record) => (
                <Link key={record.id} to={`/obra/${record.id}`} className="recent-card" onClick={playClick}>
                  <span className="rc-new">NOVO</span>
                  <ItemGlyph record={record} size={44} />
                  <span>
                    <strong>{record.title}</strong>
                    <small>{typeLabel(record)} · {yearOf(record)}{record.author ? ` · ${record.author}` : ''}</small>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Coleções temáticas ──────────────────────────────────── */}
        <section className="prancha prancha-themes">
          <SectionMark>COLEÇÕES TEMÁTICAS / CURADORIA DO ARQUIVO</SectionMark>
          <div className="theme-grid">
            {themes.map((theme, index) => (
              <article key={theme.title} className="theme-card">
                <header>
                  <span className="theme-index">C.{String(index + 1).padStart(2, '0')}</span>
                  <span className="theme-count">{String(theme.items.length).padStart(2, '0')} REG.</span>
                </header>
                <h3>{theme.title}</h3>
                <p>{theme.note}</p>
                <ul>
                  {theme.items.slice(0, 4).map((record) => (
                    <li key={record.id}><Link to={`/obra/${record.id}`} onClick={playClick}>{record.title} <em>{yearOf(record)}</em></Link></li>
                  ))}
                </ul>
                <Link className="fig-link" to={`/pesquisa?q=${encodeURIComponent(theme.query)}`} onClick={playClick}>VER COLEÇÃO ↗</Link>
              </article>
            ))}
          </div>
        </section>

        {/* ── Linha do tempo (prévia) ─────────────────────────────── */}
        <section className="prancha prancha-decades">
          <SectionMark>LINHA DO TEMPO / REGISTROS POR DÉCADA</SectionMark>
          <div className="decade-bars" role="img" aria-label="Quantidade de registros por década, de 1800 a 2020">
            {decades.map(([decade, value]) => (
              <Link key={decade} to="/linha-do-tempo" className="decade-bar" onClick={playClick} title={`${decade}: ${value} registros`}>
                <i style={{ '--h': `${Math.max(6, (value / peak) * 100)}%` }} />
                <span>{decade % 100 === 0 ? decade : String(decade).slice(2)}</span>
              </Link>
            ))}
          </div>
          <div className="decade-foot">
            <span>1800 → 2020 · CADA BARRA É UMA DÉCADA</span>
            <Link to="/linha-do-tempo" className="fig-link" onClick={playClick}>ABRIR LINHA DO TEMPO COMPLETA ↗</Link>
          </div>
        </section>

        {/* ── Fitas e enigmas ─────────────────────────────────────── */}
        <section className="prancha prancha-signal">
          <div className="signal-split">
            <Link to="/analog-horror" className="signal-card signal-tape" onClick={playClick}>
              <span className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></span>
              <SectionMark tone="ember">ANALOG HORROR / {String(countOf('analog-horror')).padStart(2, '0')} FITAS</SectionMark>
              <h2>NÃO OLHE<br />PELA JANELA.</h2>
              <p>Transcrições de fitas sem etiqueta. Ficção original, livre em CC0.</p>
              <span className="fig-link">REBOBINAR FITA 01 ↗</span>
            </Link>
            <Link to="/arg" className="signal-card signal-arg" onClick={playClick}>
              <span className="signal-cipher" aria-hidden="true">PHPRULD · 19-9-14-1-12 · -.-. .. -. . -- .-</span>
              <SectionMark>ENIGMAS ARG / {String(countOf('arg')).padStart(2, '0')} COFRES</SectionMark>
              <h2>DECIFRE<br />O ARQUIVO.</h2>
              <p>Cifras, Morse e pistas escondidas nas próprias fichas do acervo.</p>
              <span className="fig-link">ABRIR O COFRE 84 ↗</span>
            </Link>
          </div>
        </section>

        {/* ── Frequências perdidas ─────────────────────────────────── */}
        <section className="fig-lost prancha-lost">
          <div>
            <SectionMark tone="ember">LOST MEDIA / RECUPERAÇÃO</SectionMark>
            <h2>NEM TUDO<br />DESAPARECE<br />POR COMPLETO.</h2>
            <p>Rastreie fragmentos. Cruze fontes. Reconstrua a história.</p>
            <Link to="/lost-media" className="fig-btn fig-btn-primary" onClick={playClick}>ABRIR DOSSIÊS ↗</Link>
          </div>

          <div className="lost-board">
            <div className="lost-cards">
              {[806, 805, 408, 807].map(byId).filter(Boolean).map((record) => (
                <Link key={record.id} to={`/obra/${record.id}`} className="lost-mini" onClick={playClick}>
                  <ItemGlyph record={record} size={26} tone="ember" />
                  <span>{record.title}</span>
                </Link>
              ))}
            </div>
            <div className="fig-lost-signal">
              <span className="fig-lost-glyph" aria-hidden="true">[?]</span>
              <span className="fig-lost-note">SINAL NÃO IDENTIFICADO<br />AGUARDANDO NOVAS PISTAS_</span>
              <Link to="/lost-media" className="fig-link" onClick={playClick}>VER TODOS OS DOSSIÊS ↗</Link>
            </div>
          </div>
        </section>

        {/* ── Comunidade ───────────────────────────────────────────── */}
        <section className="fig-community">
          <SectionMark>CANAL ABERTO / COMUNIDADE</SectionMark>
          <h2>Toda memória precisa de alguém.</h2>
          <div className="fig-community-row">
            <p>Compartilhe descobertas, documente pistas e encontre outras pessoas na mesma frequência.</p>
            <Link to="/comunidade" className="fig-btn fig-btn-primary" onClick={playClick}>ENTRAR NA COMUNIDADE ↗</Link>
          </div>
        </section>

        {/* ── Console de pesquisa ──────────────────────────────────── */}
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
            <span>{pad(total)} REGISTROS / {pad(countOf('filme'))} FILMES / {pad(countOf('livro'))} LIVROS</span>
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

        <DossierFooter page={1} total={13} />
      </div>
    </Layout>
  )
}
