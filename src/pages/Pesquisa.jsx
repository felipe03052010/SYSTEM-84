import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import RecordCard from '../components/RecordCard'
import { records } from '../data/records'
import { playClick, playTyping } from '../utils/audio'
import {
  DossierFooter,
  DossierMasthead,
  FrameMarks,
  SectionMark,
  UiIcon,
  WireGlobe,
  pad2,
} from '../components/Chassis'
import '../styles/search.css'
import '../styles/figma.css'
import '../styles/dossie.css'

function matchesPeriod(year, period) {
  if (period === 'all') return true
  if (period === '1800') return year >= 1800 && year <= 1899
  if (period === '1900') return year >= 1900 && year <= 1949
  if (period === '1950') return year >= 1950 && year <= 1999
  if (period === '2000') return year >= 2000
  return true
}

export default function Pesquisa() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery)
  const [type, setType] = useState('all')
  const [period, setPeriod] = useState('all')

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const text = [
        record.title,
        record.author || '',
        record.description,
        record.tags.join(' '),
        record.type,
        String(record.year),
      ]
        .join(' ')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

      const queryMatch =
        !submittedQuery ||
        text.includes(submittedQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())

      const typeMatch =
        type === 'all' || record.type === type

      return (
        queryMatch &&
        typeMatch &&
        matchesPeriod(record.year, period)
      )
    })
  }, [submittedQuery, type, period])

  function submit(event) {
    event.preventDefault()
    playClick()
    setSubmittedQuery(query.trim())

    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    } else {
      setSearchParams({})
    }
  }

  function clear() {
    playClick()
    setQuery('')
    setSubmittedQuery('')
    setType('all')
    setPeriod('all')
    setSearchParams({})
  }

  return (
    <Layout className="dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        <section className="prancha prancha-search">
          <div className="search-grid">
            <div className="search-copy">
              <h1>PESQUISAR<br />NO ARQUIVO<span className="blink">_</span></h1>
              <p className="hero-lead">
                Consulte simultaneamente os registros de filmes, séries, livros e
                dossiês de preservação armazenados no SYSTEM 84.
              </p>

              <form className="dossier-search" onSubmit={submit}>
                <label htmlFor="globalSearch">
                  <UiIcon name="search" size={16} />
                  INSIRA UMA CONSULTA
                </label>
                <div className="dossier-search-field">
                  <span aria-hidden="true">C:\SYSTEM84\SEARCH&gt;</span>
                  <input
                    id="globalSearch"
                    type="search"
                    value={query}
                    placeholder="título, categoria, ano ou palavra-chave..."
                    onChange={(event) => {
                      setQuery(event.target.value)
                      playTyping()
                    }}
                  />
                  <button type="submit">EXECUTAR</button>
                </div>
              </form>

              <div className="search-filters">
                <label htmlFor="typeFilter">TIPO DE ARQUIVO</label>
                <select
                  id="typeFilter"
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value)
                    playClick()
                  }}
                >
                  <option value="all">TODOS</option>
                  <option value="filme">FILMES</option>
                  <option value="série">SÉRIES</option>
                  <option value="livro">LIVROS</option>
                  <option value="lost-media">LOST MEDIA</option>
                  <option value="analog-horror">ANALOG HORROR</option>
                  <option value="arg">ARG</option>
                </select>

                <label htmlFor="periodFilter">PERÍODO</label>
                <select
                  id="periodFilter"
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

                <button type="button" onClick={clear}>LIMPAR FILTROS</button>
              </div>
            </div>

            <figure className="search-figure">
              <FrameMarks />
              <WireGlobe />
              <figcaption>FIG. 084 — BUSCA NO ACERVO</figcaption>
            </figure>
          </div>
        </section>

        <section className="prancha prancha-results">
          <SectionMark>RESULTADOS / CONSULTA EM TEMPO REAL</SectionMark>

          <div className="result-line">
            <span>CONSULTA FINALIZADA // {pad2(filtered.length)} REGISTRO(S)</span>
            <span>BASE: SYS84_MASTER</span>
          </div>

          {filtered.length > 0 ? (
            <div className="records-grid">
              {filtered.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              &gt; NENHUM REGISTRO COMPATÍVEL FOI LOCALIZADO.
            </p>
          )}
        </section>

        <DossierFooter page={10} total={13} />
      </div>
    </Layout>
  )
}
