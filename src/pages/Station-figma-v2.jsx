import { useState } from 'react'
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
 * Capa do dossier visual: a prancha 01 ("Memória fora do tempo") aberta
 * como página do site. Abertura com o monograma [84], herói em Syncopate ao
 * lado do objeto óptico (globo de arame + órbita laranja), painéis de
 * manifesto, paleta e tipografia, contadores do acervo, fita de categorias
 * e prancha de destaques com a mesma moldura dos cards do dossier.
 */

const categories = [
  { label: 'ASSISTIR', to: '/filmes', icon: 'film' },
  { label: 'LER', to: '/livros', icon: 'book' },
  { label: 'DESCOBRIR', to: '/series', icon: 'list' },
  { label: 'PRESERVAR', to: '/comunidade', icon: 'people' },
]

const formatFilters = [
  { label: 'TODOS', type: null },
  { label: 'FILMES', type: 'filme' },
  { label: 'SÉRIES', type: 'série' },
  { label: 'LIVROS', type: 'livro' },
  { label: 'LOST MEDIA', type: 'lost-media' },
]

const total = records.length

/* Destaques da prancha 04, na mesma ordem em que aparecem no dossier. */
const HERO_TITLES = [
  'Nosferatu',
  'Metropolis',
  'Frankenstein',
  'The Phantom Creeps',
  'Drácula',
  'Alice no País das Maravilhas',
  'Flash Gordon Conquers the Universe',
]

const heroOf = (title) => records.find((record) => record.title === title)
const featured = HERO_TITLES.map(heroOf).filter(Boolean)
const lostDossier = records.find((record) => record.type === 'lost-media' && record.article) || records.find((record) => record.type === 'lost-media')

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
  const shown = (shelf.length ? shelf : featured).slice(0, 8)

  return (
    <Layout className="station-page figma-page dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        {/* ── PRANCHA 01 · memória fora do tempo ──────────────────── */}
        <section className="prancha prancha-hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>MEMÓRIA<br />FORA DO<br />TEMPO.</h1>
              <p className="hero-lead">
                Este documento reunifica o catálogo visual e o acervo do SYSTEM 84
                em um único sistema coerente, fiel à identidade, à linguagem e à
                experiência do arquivo.
              </p>

              <div className="hero-actions">
                <Link to="/filmes" className="fig-btn fig-btn-primary" onClick={playClick}>EXPLORAR ACERVO ↗</Link>
                <Link to="/lost-media" className="fig-btn fig-btn-secondary" onClick={playClick}>SINTONIZAR LOST MEDIA</Link>
              </div>
            </div>

            <figure className="hero-figure">
              <FrameMarks />
              <WireGlobe />
              <figcaption>FIG. 084 — MEMÓRIA EM TRANSMISSÃO</figcaption>
            </figure>

            <div className="hero-panels">
              <Panel title="MANIFESTO VISUAL" tone="acid" className="panel-manifesto">
                <ul className="manifest-list">
                  <li><b>[&nbsp;&nbsp;]</b><div><strong>ARQUIVO CULTURAL</strong><span>Obras, fragmentos e contexto.</span></div></li>
                  <li><b>[≋]</b><div><strong>TRANSMISSÃO</strong><span>Conteúdo em circulação contínua.</span></div></li>
                  <li><b>[ &gt; ]</b><div><strong>TERMINAL</strong><span>Interface direta, clara e funcional.</span></div></li>
                  <li><b>[ O ]</b><div><strong>PRESERVAÇÃO</strong><span>Cópias, fontes e procedência registrada.</span></div></li>
                  <li><b>[人]</b><div><strong>COMUNIDADE</strong><span>Pessoas que encontram, discutem e mantêm vivo.</span></div></li>
                </ul>
              </Panel>

              <Panel title="PALETA PRINCIPAL" tone="acid" className="panel-palette">
                <div className="swatches">
                  <div><span style={{ background: '#090D0B' }} /><strong>PRETO</strong><em>FUNDO</em><code>#090D0B</code></div>
                  <div><span style={{ background: '#EBEDDF' }} /><strong>PAPEL</strong><em>TEXTO</em><code>#EBEDDF</code></div>
                  <div><span style={{ background: '#A8FF60' }} /><strong>VERDE ÁCIDO</strong><em>DESTAQUE</em><code>#A8FF60</code></div>
                  <div><span style={{ background: '#FF6332' }} /><strong>LARANJA-SINAL</strong><em>AÇÃO</em><code>#FF6332</code></div>
                </div>
              </Panel>

              <Panel title="TIPOGRAFIA / PAPÉIS" tone="acid" className="panel-type">
                <div className="type-list">
                  <div className="type-row type-syncopate"><b>SYNCOPATE BOLD</b><span>Títulos e impacto</span></div>
                  <div className="type-row type-grotesk"><b>Space Grotesk</b><span>Textos, interface e leitura</span></div>
                  <div className="type-row type-mono"><b>IBM Plex Mono</b><span>Dados, comandos e metadados</span></div>
                  <div className="type-row type-vt"><b>VT323</b><span>Sinalização e elementos de sistema</span></div>
                </div>
              </Panel>
            </div>
          </div>

          <div className="hero-counters">
            <SectionMark>ESTRUTURA GLOBAL DO ACERVO</SectionMark>
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

        {/* ── PRANCHA 04 · destaques do acervo ────────────────────── */}
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

              <div className="item-grid">
                {shown.map((record) => (
                  <Link key={record.id} to={`/obra/${record.id}`} className="item-card" onClick={playClick}>
                    <span className="item-kicker">{typeLabel(record)} / {yearOf(record)}</span>
                    <span className="item-art">
                      <ItemGlyph record={record} size={92} />
                    </span>
                    <strong className="item-title">{record.title}</strong>
                  </Link>
                ))}
                <Link to="/pesquisa" className="item-card is-more" onClick={playClick}>
                  <span className="item-kicker">CATÁLOGO / COMPLETO</span>
                  <span className="item-art"><UiIcon name="archive" size={54} /></span>
                  <strong className="item-title">+{pad(total - shown.length)} REGISTROS<br />VER CATÁLOGO ↗</strong>
                </Link>
              </div>
            </div>

            <aside className="acervo-side">
              <Panel title="SISTEMA DE ÍCONES DOS ITENS" tone="ember">
                <p className="panel-copy">
                  Cada item do acervo recebe um ícone único, criado a partir de formas
                  geométricas, marcas de sinalização e pistas de preservação, formando
                  um vocabulário visual coerente em todo o SYSTEM 84.
                </p>

                <SectionMark tone="acid">ELEMENTOS DE COMPOSIÇÃO</SectionMark>

                <ul className="composition-list">
                  <li>
                    <span className="composition-glyph"><i className="cg-square" /><i className="cg-ring" /></span>
                    <div><strong>FORMAS GEOMÉTRICAS</strong><span>Estrutura, silhueta e identidade do conteúdo (figura, objeto, espaço).</span></div>
                  </li>
                  <li>
                    <span className="composition-glyph"><i className="cg-focus" /><i className="cg-cross" /></span>
                    <div><strong>MARCAS DE SINALIZAÇÃO</strong><span>Foco, rastreamento e transmissão, conectando o item ao sistema.</span></div>
                  </li>
                  <li>
                    <span className="composition-glyph composition-stack"><i /><i /><i /></span>
                    <div><strong>PISTAS DE PRESERVAÇÃO</strong><span>Estado do registro (completo, fragmentário ou perdido), indicado por variações de forma, camada e contraste.</span></div>
                  </li>
                </ul>
              </Panel>

              <Panel title="EXEMPLOS DO ACERVO" tone="acid" className="panel-examples">
                <div className="example-row">
                  {featured.slice(0, 4).map((record) => (
                    <Link key={record.id} to={`/obra/${record.id}`} className="example-cell" onClick={playClick}>
                      <ItemGlyph record={record} size={46} />
                      <span>{record.title}</span>
                    </Link>
                  ))}
                </div>
              </Panel>
            </aside>
          </div>
        </section>

        {/* ── Prancha de estados: busca, detalhe, acesso, envio ───── */}
        <section className="prancha prancha-fluxos">
          <SectionMark>PRINCIPAIS ESTADOS E FLUXOS</SectionMark>
          <div className="state-flow">
            <Link to="/pesquisa" className="state-card" onClick={playClick}>
              <span className="state-label">BUSCA</span>
              <span className="state-field"><UiIcon name="search" size={14} /> <em>frankenstein</em></span>
              <span className="state-option is-active"><UiIcon name="home" size={12} /> Frankenstein</span>
              <span className="state-option"><UiIcon name="book" size={12} /> Frankenstein (1818)</span>
              <span className="state-option"><UiIcon name="film" size={12} /> Frankenstein (1910)</span>
            </Link>

            <span className="state-arrow" aria-hidden="true">→</span>

            <Link to={featured[2] ? `/obra/${featured[2].id}` : '/livros'} className="state-card" onClick={playClick}>
              <span className="state-label">DETALHE (OBRA)</span>
              <span className="state-detail-art"><ItemGlyph record={featured[2] || featured[0]} size={54} /></span>
              <strong>{featured[2]?.title || 'FRANKENSTEIN'}</strong>
              <span className="state-bar" /><span className="state-bar short" />
            </Link>

            <span className="state-arrow" aria-hidden="true">→</span>

            <Link to="/entrada" className="state-card" onClick={playClick}>
              <span className="state-label">LOGIN</span>
              <span className="state-user"><UiIcon name="user" size={30} /></span>
              <span className="state-field">E-mail ou usuário</span>
              <span className="state-field">Senha</span>
              <span className="state-cta">ACESSAR ↗</span>
            </Link>

            <span className="state-arrow" aria-hidden="true">→</span>

            <Link to="/comunidade" className="state-card" onClick={playClick}>
              <span className="state-label">UPLOAD (ENVIAR)</span>
              <span className="state-drop"><UiIcon name="upload" size={26} /><em>ARRASTE OU SELECIONE UM ARQUIVO</em></span>
              <span className="state-bar" /><span className="state-bar short" />
            </Link>
          </div>
        </section>

        {/* ── Frequências perdidas ─────────────────────────────────── */}
        <section className="fig-lost prancha-lost">
          <div>
            <SectionMark tone="ember">SÉRIES E LOST MEDIA / RECUPERAÇÃO</SectionMark>
            <h2>NEM TUDO<br />DESAPARECE<br />POR COMPLETO.</h2>
            <p>Rastreie fragmentos. Cruze fontes. Reconstrua a história.</p>
            <Link to="/lost-media" className="fig-btn fig-btn-primary" onClick={playClick}>ABRIR DOSSIÊS ↗</Link>
          </div>

          <div className="lost-board">
            <div className="lost-cards">
              {records.filter((record) => record.type === 'lost-media').slice(0, 3).map((record) => (
                <Link key={record.id} to={`/obra/${record.id}`} className="lost-mini" onClick={playClick}>
                  <ItemGlyph record={record} size={26} tone="ember" />
                  <span>{record.title}</span>
                </Link>
              ))}
            </div>
            <div className="fig-lost-signal">
              <span className="fig-lost-glyph" aria-hidden="true">[ ? ]</span>
              <span className="fig-lost-note">SINAL NÃO IDENTIFICADO<br />AGUARDANDO NOVAS PISTAS_</span>
              {lostDossier && <Link to={`/obra/${lostDossier.id}`} className="fig-link" onClick={playClick}>VER ÚLTIMO DOSSIÊ ↗</Link>}
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

        <DossierFooter page={1} total={1} />
      </div>
    </Layout>
  )
}
