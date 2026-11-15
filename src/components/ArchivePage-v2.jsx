import { useMemo, useState } from 'react'
import Layout from './Layout'
import RecordCard from './RecordCard'
import { records } from '../data/records'
import { playTyping, playClick } from '../utils/audio'
import { uiConfirm, diskError } from '../utils/retro-sounds'
import '../styles/archive.css'
import '../styles/filters.css'

/**
 * Diretório com filtros de computador antigo: além de busca e período, o
 * usuário pode pedir uma "correção" do sinal (fósforo, âmbar, papel de
 * jornal, VHS) e ligar efeitos de tela que existiam nos monitores reais.
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

export default function ArchivePage({ type, title, directory, command, description }) {
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('all')
  const [decade, setDecade] = useState('all')
  const [sort, setSort] = useState('year')
  const [display, setDisplay] = useState('fosforo')
  const [effects, setEffects] = useState(DEFAULT_EFFECTS)
  const [onlyOpen, setOnlyOpen] = useState(false)
  const [extreme, setExtreme] = useState(false)

  const all = useMemo(() => records.filter((record) => record.type === type), [type])

  const decades = useMemo(() => {
    const set = new Set()
    all.forEach((record) => {
      if (record.year > 1000) set.add(Math.floor(record.year / 10) * 10)
    })
    return [...set].sort((a, b) => a - b)
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

  return (
    <Layout>
      <section className="archive-hero">
        <div>
          <span className="directory">{directory}</span>
          <p className="terminal-line">{command}</p>
          <h1>
            {title.toUpperCase()}
            <span className="blink">_</span>
          </h1>
          <p>{description}</p>
        </div>

        <aside className="diagnostic-panel">
          <span>Status do diretório</span>
          <strong>ONLINE</strong>
          <p>Indexação: ativa</p>
          <p>Registros: {all.length}</p>
          <p>Protocolo: SYS84</p>
        </aside>
      </section>

      <section className={`archive-browser display-${display} ${effects.map((id) => `fx-${id}`).join(' ')}`}>
        <div className="filter-bar">
          <div>
            <label htmlFor={`${type}-query`}>&gt; Filtrar diretório</label>
            <input
              id={`${type}-query`}
              type="search"
              value={query}
              placeholder="Digite um título, gênero ou ano..."
              onChange={(event) => {
                setQuery(event.target.value)
                playTyping()
              }}
            />
          </div>

          <div>
            <label htmlFor={`${type}-period`}>Período</label>
            <select
              id={`${type}-period`}
              value={period}
              onChange={(event) => { setPeriod(event.target.value); playClick() }}
            >
              <option value="all">TODOS</option>
              <option value="1800">1800–1899</option>
              <option value="1900">1900–1949</option>
              <option value="1950">1950–1999</option>
              <option value="2000">2000+</option>
            </select>
          </div>

          <div>
            <label htmlFor={`${type}-decade`}>Década</label>
            <select
              id={`${type}-decade`}
              value={decade}
              onChange={(event) => { setDecade(event.target.value); playClick() }}
            >
              <option value="all">TODAS</option>
              {decades.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${type}-sort`}>Ordem</label>
            <select
              id={`${type}-sort`}
              value={sort}
              onChange={(event) => { setSort(event.target.value); playClick() }}
            >
              <option value="year">MAIS ANTIGO</option>
              <option value="recent">MAIS RECENTE</option>
              <option value="title">TÍTULO A–Z</option>
            </select>
          </div>
        </div>

        <div className="filter-console">
          <div className="filter-console-group">
            <span className="filter-console-label">MODO DE VÍDEO</span>
            <div className="filter-chips">
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
          </div>

          <div className="filter-console-group">
            <span className="filter-console-label">EFEITOS DE TELA</span>
            <div className="filter-chips">
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
          </div>

          <div className="filter-console-group">
            <span className="filter-console-label">ACESSO</span>
            <div className="filter-chips">
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
            </div>
          </div>
        </div>

        <div className="result-line">
          <span>{filtered.length} registro(s) encontrado(s)</span>
          <span>Diretório: /{type.toUpperCase()}</span>
        </div>

        {activeFilters.length > 0 && (
          <p className="filter-active-line">&gt; filtros ativos: {activeFilters.join(' · ')}</p>
        )}

        {filtered.length > 0 ? (
          <div className="records-grid">
            {filtered.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <p className="empty-state">&gt; NENHUM REGISTRO FOI ENCONTRADO.</p>
        )}
      </section>
    </Layout>
  )
}
