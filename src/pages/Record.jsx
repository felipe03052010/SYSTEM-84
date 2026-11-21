import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { records } from '../data/records'
import { useCommunityRecords } from '../utils/communityRecords'
import NotFound from './NotFound'
import { playClick } from '../utils/audio'
import { fetchText, mediaCandidates, paginate } from '../utils/media'
import {
  DossierFooter,
  DossierMasthead,
  ItemGlyph,
  Panel,
  SectionMark,
  StatusSeal,
  UiIcon,
  collectionOf,
  typeLabel,
  yearOf,
} from '../components/Chassis'
import '../styles/figma.css'
import '../styles/dossie.css'
import '../styles/record.css'
import YouTubeEmbed from '../components/YouTubeEmbed'

function store(key, value) {
  try { localStorage.setItem(key, String(value)) } catch { /* preferência opcional */ }
}
function read(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

function Reader({ media }) {
  const [state, setState] = useState({ status: 'loading', text: '', origin: '' })
  const [dark,setDark] = useState(()=>read('sys84-reader-dark')==='1')
  const [size, setSize] = useState(() => Number(read('sys84-font')) || 19)
  const [page, setPage] = useState(() => Number(read(`sys84-page:${media.path}`)) || 0)
  const [retry, setRetry] = useState(0)
  const [find, setFind] = useState('')
  const top = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading', text: '', origin: '' })
    fetchText(media, controller.signal)
      .then(({ text, origin }) => setState({ status: 'ready', text, origin }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ status: 'error', text: '', origin: '' }) })
    return () => controller.abort()
  }, [media, retry])

  const pages = useMemo(() => paginate(state.text), [state.text])
  const active = Math.min(Math.max(page, 0), Math.max(0, pages.length - 1))
  const progress = pages.length ? Math.round(((active + 1) / pages.length) * 100) : 0

  useEffect(() => {
    if (state.status === 'ready' && pages.length) store(`sys84-progress:${media.path}`, progress)
  }, [state.status, progress, pages.length, media.path])

  function turn(next) {
    setPage(next)
    store(`sys84-page:${media.path}`, next)
    top.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }

  function resize(next) {
    setSize(next)
    store('sys84-font', next)
  }

  function searchBook(event) {
    event.preventDefault()
    const needle = find.trim().toLowerCase()
    if (!needle) return
    const start = (active + 1) % pages.length
    for (let offset = 0; offset < pages.length; offset += 1) {
      const index = (start + offset) % pages.length
      if (pages[index].toLowerCase().includes(needle)) { turn(index); return }
    }
  }

  if (state.status === 'error') {
    return (
      <div className="media-error" role="alert">
        <p>Não foi possível carregar o texto agora. A fonte pública pode estar fora do ar ou bloquear leitura direta.</p>
        <div>
          <button type="button" onClick={() => setRetry(retry + 1)}>TENTAR NOVAMENTE</button>
          {media.sourceUrl && <a href={media.sourceUrl} target="_blank" rel="noreferrer">ABRIR NA FONTE ORIGINAL ↗</a>}
        </div>
      </div>
    )
  }
  if (state.status === 'loading') {
    return <p className="media-loading" role="status"><span className="media-spinner" aria-hidden="true" /> CARREGANDO TEXTO DO ACERVO…</p>
  }

  const controls = (
    <div className="reader-controls">
      <button type="button" disabled={active === 0} onClick={() => turn(active - 1)}>← ANTERIOR</button>
      <label>PÁGINA <select aria-label="Ir para página" value={active} onChange={(event) => turn(Number(event.target.value))}>{pages.map((_, index) => <option key={index} value={index}>{index + 1} / {pages.length}</option>)}</select></label>
      <button type="button" disabled={active === pages.length - 1} onClick={() => turn(active + 1)}>PRÓXIMA →</button>
    </div>
  )

  return (
    <section data-dark={dark} className="book-reader" aria-label="Leitor de livro" ref={top}>
      <div className="reader-tools">
        <span>LEITOR // {media.language || 'Idioma original'} · {progress}% LIDO</span>
        <form className="reader-find" onSubmit={searchBook}>
          <input type="search" value={find} onChange={(event) => setFind(event.target.value)} placeholder="buscar no livro…" aria-label="Buscar palavra no livro" />
          <button type="submit">ACHAR</button>
        </form>
        <div>
          <button type="button" aria-pressed={dark} onClick={()=>{setDark(!dark);store('sys84-reader-dark',dark?'0':'1')}}>{dark?'Tema escuro':'Tema claro'} ◐</button>
          <button type="button" aria-label="Diminuir fonte" disabled={size <= 15} onClick={() => resize(size - 2)}>A−</button>
          <button type="button" aria-label="Aumentar fonte" disabled={size >= 29} onClick={() => resize(size + 2)}>A+</button>
        </div>
      </div>
      <span className="reader-progress" aria-hidden="true"><i style={{ width: `${progress}%` }} /></span>
      {controls}
      <article key={active} className="book-paper page-turn" style={{ fontSize: size }}>{pages[active]}</article>
      {controls}
      <p className="reader-note">A página e o tamanho da fonte são lembrados neste navegador.{state.origin === 'remote' ? ' Texto lido direto da fonte original.' : ''}</p>
    </section>
  )
}

function Player({ media, record }) {
  const [started,setStarted] = useState(false)
  const candidates = useMemo(() => mediaCandidates(media), [media])
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const video = useRef(null)
  const key = `sys84-video:${media.path}`

  function restore() {
    const time = Number(read(key))
    if (video.current && time > 0 && time < video.current.duration - 5) video.current.currentTime = time
  }
  function save() {
    if (video.current) store(key, video.current.currentTime)
  }
  function fallback() {
    if (index < candidates.length - 1) setIndex(index + 1)
    else setFailed(true)
  }

  const current = candidates[index]
  return (
    <section className="video-player" aria-label="Player de vídeo">
      {!started && current && <div className="s84-cinema"><ItemGlyph record={record} size={260}/><button className="s84-btn" onClick={()=>setStarted(true)}>PLAY &gt; REPRODUZIR</button><small>CAPA CONCEITUAL / NÃO É UM FOTOGRAMA</small></div>}
      {started && current && !failed && (
        <video
          key={current.url}
          ref={video}
          controls
          autoPlay
          playsInline
          preload="metadata"
          src={current.url}
          onLoadedMetadata={restore}
          onPause={save}
          onEnded={save}
          onError={fallback}
        />
      )}
      {failed && (
        <div className="media-error" role="alert">
          <p>O vídeo não pôde ser carregado. O acervo de origem pode estar instável.</p>
          <div>
            <button type="button" onClick={() => { setFailed(false); setIndex(0) }}>TENTAR NOVAMENTE</button>
            {(media.remoteUrl || media.sourceUrl) && <a href={media.remoteUrl || media.sourceUrl} target="_blank" rel="noreferrer">ABRIR NA FONTE ORIGINAL ↗</a>}
          </div>
        </div>
      )}
      {current?.origin === 'remote' && !failed && <p>Reprodução direta do acervo de origem · requer conexão.</p>}
      <p>{media.title} · {media.language || 'Idioma original'}{media.silent || media.transform?.mute ? ' · Filme mudo, sem trilha adicionada' : ''}</p>
    </section>
  )
}

/* Transcrições de fita: linhas que começam com [tempo] ganham marcação. */
function StoryLine({ text, tape }) {
  const match = tape && text.match(/^\[([^\]]+)\]\s*(.*)$/)
  if (match) {
    return <p className="tape-line"><time>{match[1]}</time><span>{match[2]}</span></p>
  }
  if (text.startsWith('NOTA DO ARQUIVO')) return <p className="archive-note">{text}</p>
  return <p>{text}</p>
}

function storyHeading(record) {
  if (record.type === 'lost-media') return 'DOSSIÊ DE PRESERVAÇÃO'
  return record.type === 'livro' ? 'TEXTO DA EDIÇÃO' : 'NOTAS DA CURADORIA'
}

function isExternalVideo(record) { return (record.media || []).some((media) => media.kind === 'youtube') }

function rightsLabel(record) {
  if (isExternalVideo(record)) return 'YouTube / direitos do criador'
  if (/creative commons|cc by/i.test(record.media?.[0]?.license || '')) return 'Creative Commons'
  if (record.type === 'lost-media' && !record.media?.length) return 'Dossiê documental'
  return record.media?.[0]?.license || 'Ver procedência'
}

export default function Record() {
  const { id } = useParams()
  const { items: community, ready: communityReady } = useCommunityRecords()
  const allRecords = useMemo(() => [...records, ...community], [community])
  const record = allRecords.find((item) => String(item.id) === id)
  const communityPending = !record && String(id).startsWith('sub-') && !communityReady
  const [selected, setSelected] = useState(0)
  useEffect(() => { setSelected(0); window.scrollTo(0, 0) }, [id])

  const related = useMemo(() => {
    if (!record) return []
    const tags = new Set(record.tags || [])
    return allRecords
      .filter((item) => item.id !== record.id)
      .map((item) => ({
        item,
        score: (item.type === record.type ? 2 : 0) + (item.tags || []).filter((tag) => tags.has(tag)).length * 3 + (item.author && item.author === record.author ? 5 : 0),
      }))
      .filter((entry) => entry.score > 2)
      .sort((a, b) => b.score - a.score || a.item.year - b.item.year)
      .slice(0, 4)
      .map((entry) => entry.item)
  }, [record, allRecords])

  if (communityPending) return <Layout><p className="media-loading" role="status">CARREGANDO ENVIO DA COMUNIDADE…</p></Layout>
  if (!record) return <NotFound />
  const media = record.media?.[selected] || record.media?.[0]
  const backTo = collectionOf(record)
  const hasText = media?.kind === 'text' || (record.type === 'livro' && Boolean(record.article?.length))

  return <Layout className={`dossie-page record-type-${record.type}`}>
    <div className="dossier-frame">
      <DossierMasthead />

      <section className="prancha prancha-record">
        <Link className="back-link" to={backTo} onClick={playClick}>← VOLTAR AO CATÁLOGO</Link>

        {record.type === 'lost-media' && <div className="s84-evidence"><small>LOST MEDIA / {record.code}</small><h1>{/frankenstein/i.test(record.title) ? <>Uma cópia.<br/>Um século<br/>de memória.</> : record.title}</h1><div><figure><ItemGlyph record={record} size={196}/><figcaption>{record.recoveryStatus}</figcaption></figure><section><h2>{record.title}</h2><p>{record.description}</p><small>PROCEDÊNCIA E EVIDÊNCIAS</small>{record.sources?.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a></p>)}</section></div></div>}<header className="s84-work"><small>{typeLabel(record)} / {record.code}</small><h1>{record.title}</h1>{record.recoveryStatus && <StatusSeal status={record.recoveryStatus}/>}</header>
        <details className="s84-details"><summary>Ficha e procedência</summary><p>{record.description}</p><aside className="record-aside">
            <Panel title="FICHA DO REGISTRO" tone="acid">
              <div className="ficha-rows">
                <div><span>CÓDIGO</span><b>{record.code}</b></div>
                <div><span>COLEÇÃO</span><b>{backTo.replace('/', '').replace('-', ' ').toUpperCase()}</b></div>
                <div><span>ANO</span><b>{yearOf(record)}</b></div>
                {record.author && <div><span>AUTORIA</span><b>{record.author}</b></div>}
                <div><span>IDIOMA</span><b>{record.language || 'Idioma original'}</b></div>
                <div><span>DIREITOS</span><b>{rightsLabel(record)}</b></div>
              </div>
            </Panel>

            <Panel title="ACESSO" tone="ember" className="panel-access">
              <ul className="system-list">
                <li><UiIcon name={hasText || !media ? 'book' : 'play'} size={20} /><div><strong>{hasText ? 'Leitor' : media ? 'Player de vídeo' : 'Dossiê'}</strong><span>{hasText ? 'texto integral dentro do site' : media ? 'reprodução dentro da ficha' : 'documentação da obra'}</span></div></li>
                <li><UiIcon name="lock" size={20} /><div><strong>Fonte e licença</strong><span>{record.sources?.length || 0} fonte(s) registrada(s)</span></div></li>
                {media && <li><UiIcon name="loop" size={20} /><div><strong>{isExternalVideo(record) ? 'Canal de origem' : 'Progresso de leitura ou reprodução'}</strong><span>{isExternalVideo(record) ? 'vídeo incorporado do YouTube' : 'salvo neste navegador'}</span></div></li>}
              </ul>
            </Panel>
          </aside>
        </details>
      </section>

      <section className="prancha prancha-media">
        <SectionMark>{media?.kind === 'youtube' ? 'YOUTUBE / PUBLICAÇÃO DO CRIADOR ORIGINAL' : hasText ? 'LEITOR / TEXTO DA EDIÇÃO' : record.article && !media ? 'DOCUMENTAÇÃO DO ACERVO' : 'TRANSMISSÃO / CÓPIA DE ACERVO'}</SectionMark>

        {record.media?.length > 1 && (
          <label className="episode-select">ESCOLHER CAPÍTULO <select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>{record.media.map((item, index) => <option value={index} key={item.path || item.youtubeId || index}>{item.title}</option>)}</select></label>
        )}

        {record.article && (
          <article className={`original-story story-${record.type}`}>
            <h2>{storyHeading(record)}</h2>
            {record.editionTitle && <p>{record.editionTitle}</p>}
            {record.article.map((paragraph, index) => <StoryLine key={index} text={paragraph} tape={record.type === 'analog-horror'} />)}
          </article>
        )}

        {media ? media.kind === 'text' ? <Reader key={media.path} media={media} /> : media.kind === 'youtube' ? <div key={media.youtubeId}><h3>{media.title}</h3><YouTubeEmbed media={media} /></div> : <Player key={media.path + selected} media={media} record={record} /> : !record.article && !record.externalAccess && <p role="status">Arquivo ainda não disponível.</p>}

        <details className="record-provenance">
          <summary>Sobre esta cópia e preservação</summary>
          <p>{record.rightsNote}</p>
          {media?.license && <p>{media.license}</p>}
          {record.sources?.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></p>)}
        </details>
      </section>

      {related.length > 0 && (
        <section className="prancha prancha-related">
          <SectionMark tone="ember">NO MESMO SINAL / REGISTROS RELACIONADOS</SectionMark>
          <div className="related-grid">
            {related.map((item) => (
              <Link key={item.id} to={`/obra/${item.id}`} className="item-card" onClick={playClick}>
                <span className="item-kicker">{typeLabel(item)} / {yearOf(item)}</span>
                <span className="item-art"><ItemGlyph record={item} size={64} /></span>
                <strong className="item-title">{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <DossierFooter page={12} total={13} title={`${record.code} — ${record.title.toUpperCase()}`} />
    </div>
  </Layout>
}
