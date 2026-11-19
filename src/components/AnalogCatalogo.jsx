import { useMemo, useState } from 'react'
import { ItemGlyph, SectionMark, UiIcon, pad2 } from './Chassis'
import { playClick, playTyping } from '../utils/audio'
import { analogCatalogo, analogCatalogoMeta } from '../data/analog-catalogo.js'
import '../styles/analog-catalogo.css'

const LINK_LABEL = {
  channel: 'Abrir canal oficial',
  playlist: 'Abrir playlist',
  search: 'Buscar no YouTube',
}

function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

/**
 * Catálogo de criadores de analog horror: cada título abre o canal ou a playlist
 * oficial em outra aba. Nada é hospedado aqui.
 */
export default function AnalogCatalogo() {
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return analogCatalogo
    return analogCatalogo.filter((item) =>
      normalize([item.title, item.creator, item.kindLabel, item.description, item.year].join(' ')).includes(needle),
    )
  }, [query])

  return (
    <section className="prancha prancha-analog-catalogo" aria-labelledby="analog-catalogo-title">
      <SectionMark tone="ember">{`CATÁLOGO DE CRIADORES / ${pad2(analogCatalogo.length)} TÍTULOS`}</SectionMark>
      <h2 id="analog-catalogo-title" className="analog-catalogo-title">Onde assistir</h2>
      <p className="analog-catalogo-note">
        Links para os canais e playlists oficiais dos criadores. O SYSTEM 84 não hospeda nem reenvia estes vídeos.
        Itens marcados como <strong>BUSCA</strong> ainda não têm um canal confirmado e abrem uma pesquisa no YouTube.
        Confira os avisos de conteúdo de cada título antes de assistir.
      </p>

      <label className="toolbar-search analog-catalogo-search" htmlFor="analog-catalogo-query">
        <UiIcon name="search" size={16} />
        <input
          id="analog-catalogo-query"
          type="search"
          value={query}
          placeholder="BUSCAR CRIADOR OU TÍTULO..."
          onChange={(event) => {
            setQuery(event.target.value)
            playTyping()
          }}
        />
        <span className="filter-count">{items.length} TÍTULOS</span>
      </label>

      {items.length > 0 ? (
        <ul className="catalogue-grid analog-catalogo-grid">
          {items.map((item) => (
            <li key={item.id}>
              <article className="record-card">
                <span className="rc-top">
                  <span className="rc-code">{item.kindLabel} / {item.year ?? 'S/D'}</span>
                  {item.unconfirmed ? <span className="rc-new">BUSCA</span> : <span className="rc-dot" aria-hidden="true" />}
                </span>

                <span className="rc-art">
                  <ItemGlyph record={item} size={78} />
                </span>

                <strong className="rc-title">{item.title}</strong>
                <span className="rc-author">{item.creator}</span>
                <span className="rc-description">{item.description}</span>

                <span className="rc-foot analog-catalogo-foot">
                  {item.status && <span className="analog-catalogo-status">{item.status}</span>}
                  {item.warnings?.length > 0 && (
                    <span className="analog-catalogo-warn">AVISOS: {item.warnings.join(' · ')}</span>
                  )}
                </span>

                <a
                  className="terminal-action"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playClick}
                >
                  {LINK_LABEL[item.urlType] || 'Abrir'} ↗
                </a>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">&gt; NENHUM TÍTULO ENCONTRADO. <button type="button" onClick={() => setQuery('')}>LIMPAR BUSCA</button></p>
      )}

      {analogCatalogoMeta?.compiledOn && (
        <p className="analog-catalogo-compiled">LISTA COMPILADA EM {analogCatalogoMeta.compiledOn}</p>
      )}
    </section>
  )
}
