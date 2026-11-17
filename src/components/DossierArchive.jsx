import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import { records } from '../data/records'
import { useCommunityRecords } from '../utils/communityRecords'
import { playTyping, playClick } from '../utils/audio'
import { uiConfirm, diskError } from '../utils/retro-sounds'
import {
  DossierFooter,
  DossierMasthead,
  FrameMarks,
  ItemGlyph,
  MetaPills,
  Panel,
  SectionMark,
  StatusSeal,
  UiIcon,
  WireGlobe,
  pad2,
  typeLabel,
  yearOf,
} from './Chassis'
import '../styles/archive.css'
import '../styles/filters.css'
import '../styles/figma.css'
import '../styles/dossie.css'

/**
 * Diretório no desenho das pranchas de coleção do dossier (Filmes, Livros,
 * Séries, Lost media): abertura com o monograma, herói em Syncopate ao lado
 * de uma figura de arame desenhada para a coleção, contadores de status,
 * catálogo em grade de ícones geométricos e o mesmo pé de página.
 *
 * Os filtros de computador antigo continuam aqui: modo de vídeo, efeitos de
 * tela e o botão de sinal extremo.
 */

const DISPLAY_MODES = [
  { id: 'fosforo', label: 'FÓSFORO VERDE', hint: 'monitor P1' },
  { id: 'ambar', label: 'ÂMBAR', hint: 'monitor P3' },
  { id: 'papel', label: 'PAPEL', hint: 'impressora matricial' },
  { id: 'vhs', label: 'VHS', hint: 'fita gasta' },
  { id: 'extremo', label: 'SINAL EXTREMO', hint: 'tubo queimado, síncronia perdida' },
]

const EXTREME_EFFECTS = ['scan', 'curvature', 'noise', 'flicker', 'bleed', 'tear', 'venetian']
const DEFAULT_EFFECTS = ['scan', 'curvature']
const SCREEN_EFFECTS = [
  { id: 'scan', label: 'SCANLINES' },
  { id: 'curvature', label: 'CURVATURA' },
  { id: 'noise', label: 'RUÍDO' },
  { id: 'flicker', label: 'CINTILAÇÃO' },
  { id: 'bleed', label: 'SANGRAMENTO DE COR' },
  { id: 'tear', label: 'RASGO DE SÍNCRONIA' },
  { id: 'venetian', label: 'PERSIANA' },
]

/* Figuras do dossier: cada coleção tem a sua, em 1px de arame. */
function CollectionFigure({ kind }) {
  return (
    <svg className="collection-figure" viewBox="0 0 320 320" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="miter" strokeLinecap="square" role="img" aria-label={`Figura 084 — ${kind}`}>
      {kind === 'filme' && (
        <>
          <circle cx="160" cy="150" r="86" />
          <circle cx="160" cy="150" r="26" />
          <circle cx="160" cy="96" r="14" /><circle cx="214" cy="150" r="14" />
          <circle cx="160" cy="204" r="14" /><circle cx="106" cy="150" r="14" />
          <path d="M74 236h172M74 250h172" />
          <path d="M20 20h24M20 20v24M300 20h-24M300 20v24" stroke="var(--fig-ember)" strokeWidth="3" />
          <ellipse cx="160" cy="150" rx="140" ry="46" stroke="var(--fig-ember)" strokeWidth="7" transform="rotate(-16 160 150)" />
        </>
      )}
      {kind === 'livro' && (
        <>
          <path d="M160 96c-28-18-58-18-82-12v128c24-6 54-6 82 12 28-18 58-18 82-12V84c-24-6-54-6-82 12Z" />
          <path d="M160 96v128" />
          <path d="M96 118h44M96 138h44M96 158h44M180 118h44M180 138h44" />
          <ellipse cx="160" cy="160" rx="150" ry="34" stroke="var(--fig-ember)" strokeWidth="7" transform="rotate(-10 160 160)" />
          <path d="M22 22h22M22 22v22M298 22h-22M298 22v22" stroke="var(--fig-ember)" strokeWidth="3" />
        </>
      )}
      {kind === 'serie' && (
        <>
          <rect x="26" y="76" width="196" height="132" />
          <path d="M26 108h196M26 176h196" />
          <path d="M34 76v132M214 76v132" />
          <path d="M160 76 118 30h84l-42 46" />
          <ellipse cx="160" cy="184" rx="150" ry="26" stroke="var(--fig-ember)" strokeWidth="7" transform="rotate(-4 160 184)" />
          <path d="M22 22h22M22 22v22M298 296h-22M298 296v-22" stroke="var(--fig-ember)" strokeWidth="3" />
        </>
      )}
      {kind === 'horror' && (
        <>
          <rect x="40" y="70" width="240" height="170" />
          <rect x="60" y="90" width="160" height="130" />
          <path d="M120 70 160 30l40 40" />
          <path d="M244 100v10M244 130v10M244 160v10" />
          <path d="M76 120h40M140 140h60M84 170h30M150 190h44" stroke="var(--fig-ember)" strokeWidth="3" />
          <path d="M70 240v16M250 240v16" />
          <path d="M20 20h22M20 20v22M300 300h-22M300 300v-22" stroke="var(--fig-ember)" strokeWidth="3" />
        </>
      )}
      {kind === 'arg' && (
        <>
          <circle cx="160" cy="160" r="110" />
          <circle cx="160" cy="160" r="74" />
          <circle cx="160" cy="160" r="38" />
          <path d="M160 40v40M160 240v40M40 160h40M240 160h40" />
          <path d="M83 83l26 26M211 211l26 26M237 83l-26 26M83 237l26-26" />
          <rect x="146" y="150" width="28" height="30" stroke="var(--fig-ember)" strokeWidth="3" />
          <path d="M152 150v-10a8 8 0 0 1 16 0v10" stroke="var(--fig-ember)" strokeWidth="3" />
          <path d="M22 22h22M22 22v22M298 22h-22M298 22v22" stroke="var(--fig-ember)" strokeWidth="3" />
        </>
      )}
      {(kind === 'lost' || !['filme', 'livro', 'serie', 'horror', 'arg'].includes(kind)) && (
        <>
          <path d="M70 104h66l18 26h96v130H70Z" />
          <path d="M48 136h66l18 26h96v130H48Z" />
          <path d="M112 214h60M158 200h14" stroke="var(--fig-ember)" strokeWidth="4" />
          <ellipse cx="164" cy="176" rx="150" ry="42" stroke="var(--fig-ember)" strokeWidth="7" transform="rotate(-8 164 176)" />
          <path d="M20 20h22M20 20v22M300 20h-22M300 20v22" stroke="var(--fig-ember)" strokeWidth="3" />
        </>
      )}
    </svg>
  )
}

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function matchesPeriod(year, period) {
  if (period === 'all') return true
  if (period === '1800') return year >= 1800 && year <= 1899
  if (period === '1900') return year >= 1900 && year <= 1949
  if (period === '1950') return year >= 1950 && year <= 1999
  if (period === '2000') return year >= 2000
  return true
}

/* Modo de vídeo inicial, vindo do endereço: ?modo=ambar|papel|vhs|fosforo */
function initialDisplay() {
  if (typeof window === 'undefined') return 'fosforo'
  const search = window.location.search || window.location.hash.split('?')[1] || ''
  const value = new URLSearchParams(search).get('modo')
  return ['fosforo', 'ambar', 'papel', 'vhs'].includes(value) ? value : 'fosforo'
}

const FIGURE = { filme: 'filme', livro: 'livro', 'série': 'serie', 'lost-media': 'lost', 'analog-horror': 'horror', arg: 'arg' }

export default function ArchivePage({
  type,
  title,
  titleLines,
  directory,
  command,
  description,
  kicker,
  figure,
  panelTitle,
  panelItems,
  recordPage = 1,
  recordTotal = 1,
}) {
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('all')
  const [decade, setDecade] = useState('all')
  const [sort, setSort] = useState('year')
  const [display, setDisplay] = useState(initialDisplay)
  const [effects, setEffects] = useState(DEFAULT_EFFECTS)
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [extreme, setExtreme] = useState(false)

  const { items: community } = useCommunityRecords()
  const all = useMemo(() => [...records, ...community].filter((record) => record.type === type), [type, community])

  const decades = useMemo(() => {
    const set = new Set()
    all.forEach((record) => {
      if (record.year > 1000) set.add(Math.floor(record.year / 10) * 10)
    })
    return [...set].sort((a, b) => a - b)
  }, [all])

  const counts = useMemo(() => {
    const open = all.filter((record) => record.availability === 'available' && (record.media?.length || record.article)).length
    const lost = all.filter((record) => record.type === 'lost-media').length
    return {
      total: all.length,
      open,
      closed: all.length - open,
      lost,
      centuries: new Set(all.map((record) => Math.floor(record.year / 100))).size,
    }
  }, [all])

  const filtered = useMemo(() => {
    const needle = normalize(query)
    const result = all.filter((record) => {
      const text = normalize(
        [record.title, record.author || '', record.description, record.tags.join(' '), String(record.year)].join(' '),
      )
      const decadeOk = decade === 'all' || (record.year >= Number(decade) && record.year < Number(decade) + 10)
      const openOk = !onlyOpen || record.availability === 'available'
      return text.includes(needle) && matchesPeriod(record.year, period) && decadeOk && openOk
    })

    if (sort === 'year') return result.sort((a, b) => a.year - b.year)
    if (sort === 'recent') return result.sort((a, b) => b.year - a.year)
    return result.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
  }, [all, query, period, decade, sort, onlyOpen])

  /* Estante "em leitura": progresso guardado pelo leitor interno de cada livro. */
  const reading = useMemo(() => {
    if (type !== 'livro') return []
    const items = []
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index)
        if (!key?.startsWith('sys84-progress:')) continue
        const path = key.slice('sys84-progress:'.length)
        const pct = Number(localStorage.getItem(key)) || 0
        const record = all.find((item) => (item.media || []).some((media) => media.path === path))
        if (record && pct > 0) items.push({ record, pct })
      }
    } catch { /* armazenamento indisponível */ }
    return items.sort((a, b) => b.pct - a.pct).slice(0, 6)
  }, [all, type])

  function toggleEffect(id) {
    playClick()
    setEffects((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  /* Botão de filtro extra forte: liga tudo de uma vez, no modo mais agressivo. */
  function boostFilters() {
    const next = !extreme
    if (next) diskError()
    else uiConfirm()
    setExtreme(next)
    setDisplay(next ? 'extremo' : 'fosforo')
    setEffects(next ? EXTREME_EFFECTS : DEFAULT_EFFECTS)
  }

  function resetFilters() {
    uiConfirm()
    setQuery('')
    setPeriod('all')
    setDecade('all')
    setSort('year')
    setOnlyOpen(false)
    setDisplay('fosforo')
    setEffects(DEFAULT_EFFECTS)
  }

  const activeFilters = [query && 'busca', period !== 'all' && 'período', decade !== 'all' && 'década', onlyOpen && 'só disponíveis'].filter(Boolean)
  const lines = titleLines || [title.toUpperCase()]

  return (
    <Layout className="dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        {/* ── Abertura de coleção ─────────────────────────────────── */}
        <section className="prancha prancha-collection">
          <div className="collection-grid">
            <div className="collection-copy">
              <h1>{lines.map((line) => <span key={line}>{line}<br /></span>)}</h1>
              <p className="collection-kicker">{kicker || `${pad2(counts.total)} REGISTROS / ${directory}`}</p>
              <p className="hero-lead">{description}</p>
              <p className="terminal-line typing-line">{command}</p>
            </div>

            <figure className="collection-figure-wrap">
              <FrameMarks />
              <CollectionFigure kind={figure || FIGURE[type] || 'filme'} />
              <figcaption>FIG. 084 — {(panelTitle || title).toUpperCase()}</figcaption>
            </figure>

            <div className="collection-side">
              <Panel title={panelTitle || `SISTEMA DE ${title.toUpperCase()}`} tone="acid">
                <ul className="system-list">
                  {(panelItems || [
                    ['archive', 'Catálogo', `${counts.total} registros indexados`],
                    ['search', 'Busca', 'título, autor, ano ou tag'],
                    ['eye', 'Leitor', 'cópia direto da fonte'],
                    ['lock', 'Acesso', 'público e sem cadastro'],
                    ['loop', 'Preservação', 'fonte e licença em cada ficha'],
                  ]).map(([icon, label, note]) => (
                    <li key={label}>
                      <UiIcon name={icon} size={20} />
                      <div><strong>{label}</strong><span>{note}</span></div>
                    </li>
                  ))}
                </ul>
              </Panel>

              <div className="status-counters">
                <div><strong>{pad2(counts.total)}</strong><span>REGISTROS</span></div>
                <div><strong>{pad2(counts.open)}</strong><span>DISPONÍVEIS</span></div>
                <div><strong>{pad2(counts.centuries)}</strong><span>SÉCULOS</span></div>
              </div>
            </div>
          </div>
        </section>

        {reading.length > 0 && (
          <section className="prancha prancha-reading">
            <SectionMark tone="acid">EM LEITURA / CONTINUAR DE ONDE PAROU</SectionMark>
            <div className="reading-shelf">
              {reading.map(({ record: item, pct }) => (
                <Link key={item.id} to={`/obra/${item.id}`} className="reading-card" onClick={playClick}>
                  <span className="reading-title">{item.title}</span>
                  <span className="reading-bar"><i style={{ width: `${pct}%` }} /></span>
                  <span className="reading-pct">{pct}% LIDO</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Catálogo ─────────────────────────────────────────────── */}
        <section className="prancha prancha-catalogue">
          <SectionMark>{`CATÁLOGO DO ACERVO / ${pad2(counts.total)} ${title.toUpperCase()}`}</SectionMark>

          <div id={`${type}-browser`} className={`dossier-browser display-${display} ${effects.map((id) => `fx-${id}`).join(' ')}`}>
            <div className="dossier-toolbar">
              <label className="toolbar-search" htmlFor={`${type}-query`}>
                <UiIcon name="search" size={16} />
                <input
                  id={`${type}-query`}
                  type="search"
                  value={query}
                  placeholder="BUSCAR NO ACERVO..."
                  onChange={(event) => {
                    setQuery(event.target.value)
                    playTyping()
                  }}
                />
              </label>

              <label className="toolbar-select" htmlFor={`${type}-period`}>
                <span>PERÍODO</span>
                <select id={`${type}-period`} value={period} onChange={(event) => { setPeriod(event.target.value); playClick() }}>
                  <option value="all">TODOS</option>
                  <option value="1800">1800–1899</option>
                  <option value="1900">1900–1949</option>
                  <option value="1950">1950–1999</option>
                  <option value="2000">2000+</option>
                </select>
              </label>

              <label className="toolbar-select" htmlFor={`${type}-decade`}>
                <span>DÉCADA</span>
                <select id={`${type}-decade`} value={decade} onChange={(event) => { setDecade(event.target.value); playClick() }}>
                  <option value="all">TODAS</option>
                  {decades.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="toolbar-select" htmlFor={`${type}-sort`}>
                <span>ORDEM</span>
                <select id={`${type}-sort`} value={sort} onChange={(event) => { setSort(event.target.value); playClick() }}>
                  <option value="year">MAIS ANTIGO</option>
                  <option value="recent">MAIS RECENTE</option>
                  <option value="title">TÍTULO A–Z</option>
                </select>
              </label>
            </div>

            <div className="dossier-filterbar">
              <div className="filter-row">
                <span className="filter-label">MODO DE VÍDEO</span>
                {DISPLAY_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={display === mode.id ? 'is-active' : ''}
                    onClick={() => { setDisplay(mode.id); playClick() }}
                    aria-pressed={display === mode.id}
                    title={mode.hint}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="filter-row">
                <span className="filter-label">EFEITOS DE TELA</span>
                {SCREEN_EFFECTS.map((effect) => (
                  <button
                    key={effect.id}
                    type="button"
                    className={effects.includes(effect.id) ? 'is-active' : ''}
                    onClick={() => toggleEffect(effect.id)}
                    aria-pressed={effects.includes(effect.id)}
                  >
                    {effect.label}
                  </button>
                ))}
              </div>

              <div className="filter-row">
                <span className="filter-label">ACESSO</span>
                <button
                  type="button"
                  className={onlyOpen ? 'is-active' : ''}
                  onClick={() => { setOnlyOpen((value) => !value); playClick() }}
                  aria-pressed={onlyOpen}
                >
                  SÓ DISPONÍVEIS
                </button>
                <button
                  type="button"
                  className={`boost-filter ${extreme ? 'is-active' : ''}`}
                  onClick={boostFilters}
                  aria-pressed={extreme}
                  title="Liga todos os efeitos de tubo queimado de uma vez"
                >
                  ⚡ FILTRO EXTRA FORTE
                </button>
                <button type="button" onClick={resetFilters}>RESET</button>
                <span className="filter-count">{filtered.length} REGISTROS</span>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <p className="filter-active-line">&gt; filtros ativos: {activeFilters.join(' · ')}</p>
            )}

            {filtered.length > 0 ? (
              <ul className="catalogue-grid">
                {filtered.map((record) => (
                  <li key={record.id}>
                    <Link className="record-card" to={`/obra/${record.id}`} onClick={playClick}>
                      <span className="rc-top">
                        <span className="rc-code">{typeLabel(record)} / {yearOf(record)}</span>
                        {record.isNew ? <span className="rc-new">NOVO</span> : <span className="rc-dot" aria-hidden="true" />}
                      </span>
                      <span className="rc-art">
                        <ItemGlyph record={record} size={78} />
                      </span>
                      <strong className="rc-title">{record.title}</strong>
                      {record.author && <span className="rc-author">{record.author}</span>}
                      <span className="rc-description">{record.description}</span>
                      <span className="rc-foot">
                        <MetaPills items={[['TIPO', typeLabel(record)], ['ANO', yearOf(record)]]} />
                        <StatusSeal status={record.recoveryStatus ? record.recoveryStatus.split('—')[0].trim() : 'disponível'} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">&gt; NENHUM REGISTRO FOI ENCONTRADO. <button type="button" onClick={resetFilters}>LIMPAR FILTROS</button></p>
            )}
          </div>
        </section>

        {/* ── Painel de orientação de preservação ─────────────────── */}
        <section className="prancha prancha-notes">
          <SectionMark tone="ember">STATUS DE PRESERVAÇÃO</SectionMark>
          <div className="notes-grid">
            <div className="notes-item"><StatusSeal status="recuperada">RECUPERADA</StatusSeal><p>Cópia existente e preservada, disponível para consulta.</p></div>
            <div className="notes-item"><StatusSeal status="fragmentária">FRAGMENTÁRIA</StatusSeal><p>Apenas partes sobrevivem; o restante é reconstruído por fontes.</p></div>
            <div className="notes-item"><StatusSeal status="desaparecida">DESAPARECIDA</StatusSeal><p>Sem cópias conhecidas: só pistas documentais e registros.</p></div>
            <div className="notes-item"><StatusSeal status="pista">PISTA DOCUMENTAL</StatusSeal><p>Registros ou citações que indicam a existência da obra.</p></div>
          </div>
        </section>

        <DossierFooter page={recordPage} total={recordTotal} />
      </div>
    </Layout>
  )
}
