import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { records, COLLECTIONS } from '../data/records'
import { useCommunityRecords } from '../utils/communityRecords'
import { playClick } from '../utils/audio'
import { DossierFooter, DossierMasthead, ItemGlyph, SectionMark, pad2, typeLabel, yearOf } from '../components/Chassis'
import '../styles/figma.css'
import '../styles/dossie.css'

/** Agrupa um ano em uma "era" legível da linha do tempo. */
function eraOf(year) {
  if (year < 500) return { key: -1000, label: 'ANTIGUIDADE', range: 'até 500' }
  if (year < 1600) return { key: 500, label: 'IDADE MÉDIA E RENASCIMENTO', range: '500–1599' }
  if (year < 1800) return { key: 1600, label: 'SÉCULOS XVII E XVIII', range: '1600–1799' }
  if (year < 1900) {
    const start = Math.floor(year / 25) * 25
    return { key: start, label: `SÉCULO XIX`, range: `${start}–${start + 24}` }
  }
  if (year < 2000) {
    const start = Math.floor(year / 10) * 10
    return { key: start, label: `ANOS ${String(start).slice(2)}`, range: `${start}–${start + 9}` }
  }
  return { key: 2000, label: 'SÉCULO XXI', range: '2000+' }
}

export default function LinhaDoTempo() {
  const [type, setType] = useState('all')
  const { items: community } = useCommunityRecords()
  const allRecords = useMemo(() => [...records, ...community], [community])

  const eras = useMemo(() => {
    const groups = new Map()
    allRecords
      .filter((record) => type === 'all' || record.type === type)
      .slice()
      .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, 'pt-BR'))
      .forEach((record) => {
        const era = eraOf(record.year)
        if (!groups.has(era.key)) groups.set(era.key, { ...era, items: [] })
        groups.get(era.key).items.push(record)
      })
    return [...groups.values()].sort((a, b) => a.key - b.key)
  }, [type, allRecords])

  const total = eras.reduce((sum, era) => sum + era.items.length, 0)
  const oldest = eras[0]?.items[0]
  const newest = eras.at(-1)?.items.at(-1)

  return (
    <Layout className="dossie-page timeline-page">
      <div className="dossier-frame">
        <DossierMasthead />

        <section className="prancha prancha-hero timeline-hero">
          <div className="timeline-intro">
            <h1>LINHA<br />DO TEMPO.</h1>
            <p className="hero-lead">
              Todo o acervo em ordem cronológica: de Homero às animações livres do século XXI.
              Escolha uma coleção e percorra as épocas que o arquivo atravessa.
            </p>
            <div className="timeline-span">
              <div><strong>{oldest ? yearOf(oldest) : '—'}</strong><span>REGISTRO MAIS ANTIGO</span></div>
              <div><strong>{newest ? yearOf(newest) : '—'}</strong><span>REGISTRO MAIS RECENTE</span></div>
              <div><strong>{pad2(eras.length)}</strong><span>ÉPOCAS</span></div>
              <div><strong>{pad2(total)}</strong><span>REGISTROS</span></div>
            </div>
          </div>
        </section>

        <section className="prancha">
          <SectionMark>FILTRAR POR COLEÇÃO</SectionMark>
          <div className="dossier-filters">
            <button type="button" className={type === 'all' ? 'is-active' : ''} aria-pressed={type === 'all'} onClick={() => { playClick(); setType('all') }}>TODAS</button>
            {COLLECTIONS.map((item) => (
              <button key={item.type} type="button" className={type === item.type ? 'is-active' : ''} aria-pressed={type === item.type} onClick={() => { playClick(); setType(item.type) }}>
                {item.label.toUpperCase()}
              </button>
            ))}
          </div>

          <ol className="timeline" key={type}>
            {eras.map((era, index) => (
              <li key={era.key} className="timeline-era" style={{ '--i': index }}>
                <div className="timeline-marker">
                  <span className="timeline-dot" aria-hidden="true" />
                  <strong>{era.label}</strong>
                  <em>{era.range} · {pad2(era.items.length)} REG.</em>
                </div>
                <ul className="timeline-items">
                  {era.items.map((record) => (
                    <li key={record.id}>
                      <Link to={`/obra/${record.id}`} onClick={playClick}>
                        <span className="timeline-year">{yearOf(record)}</span>
                        <ItemGlyph record={record} size={34} tone={record.type === 'lost-media' || record.type === 'analog-horror' ? 'ember' : 'acid'} />
                        <span className="timeline-title">
                          <b>{record.title}</b>
                          <small>{typeLabel(record)}{record.author ? ` · ${record.author}` : ''}</small>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <DossierFooter page={10} total={13} />
      </div>
    </Layout>
  )
}
