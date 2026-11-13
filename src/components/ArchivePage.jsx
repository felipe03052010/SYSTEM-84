import { useMemo, useState } from 'react'
import Layout from './Layout'
import RecordCard from './RecordCard'
import { records } from '../data/records'
import { playTyping, playClick } from '../utils/audio'
import '../styles/archive.css'

function matchesPeriod(year, period) {
  if (period === 'all') return true
  if (period === '1800') return year >= 1800 && year <= 1899
  if (period === '1900') return year >= 1900 && year <= 1949
  if (period === '1950') return year >= 1950 && year <= 1999
  if (period === '2000') return year >= 2000
  return true
}

export default function ArchivePage({
  type,
  title,
  directory,
  command,
  description,
}) {
  const [query, setQuery] = useState('')
  const [period, setPeriod] = useState('all')

  const filtered = useMemo(() => {
    return records.filter((record) => {
      if (record.type !== type) return false

      const text = [
        record.title,
        record.author || '',
        record.description,
        record.tags.join(' '),
        String(record.year),
      ]
        .join(' ')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

      return (
        text.includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) &&
        matchesPeriod(record.year, period)
      )
    })
  }, [query, period, type])

  return (
    <Layout>
      <section className="archive-hero">
        <div>
          <span className="directory">{directory}</span>
          <p className="terminal-line">&gt; {command}</p>
          <h1>
            {title.toUpperCase()}
            <span className="blink">_</span>
          </h1>
          <p>{description}</p>
        </div>

        <aside className="diagnostic-panel">
          <span>STATUS DO DIRETÓRIO</span>
          <strong>ONLINE</strong>
          <p>INDEXAÇÃO: ATIVA</p>
          <p>ACESSO: PÚBLICO</p>
          <p>PROTOCOLO: SYS84</p>
        </aside>
      </section>

      <section className="archive-browser">
        <div className="filter-bar">
          <div>
            <label htmlFor={`${type}-query`}>&gt; FILTRAR DIRETÓRIO</label>
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
            <label htmlFor={`${type}-period`}>PERÍODO</label>
            <select
              id={`${type}-period`}
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value)
                playClick()
              }}
            >
              <option value="all">TODOS</option>
              <option value="1800">1800–1899</option>
              <option value="1900">1900–1949</option>
              <option value="1950">1950–1999</option>
              <option value="2000">2000+</option>
            </select>
          </div>
        </div>

        <div className="result-line">
          <span>{filtered.length} REGISTRO(S) ENCONTRADO(S)</span>
          <span>DIRETÓRIO: /{type.toUpperCase()}</span>
        </div>

        {filtered.length > 0 ? (
          <div className="records-grid">
            {filtered.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <p className="empty-state">
            &gt; NENHUM REGISTRO FOI ENCONTRADO.
          </p>
        )}
      </section>
    </Layout>
  )
}
