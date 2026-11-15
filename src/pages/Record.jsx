import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { records } from '../data/records'
import NotFound from './NotFound'
import { playClick } from '../utils/audio'
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
  collectionOf,
  typeLabel,
  yearOf,
} from '../components/Chassis'
import '../styles/figma.css'
import '../styles/dossie.css'
import '../styles/record.css'
import ArgPuzzle from '../components/ArgPuzzle'

function localMedia(path) {
  if (!/^media\/[a-zA-Z0-9/_.-]+$/.test(path) || path.includes('..')) throw new Error('Arquivo inválido')
  return `${import.meta.env.BASE_URL}${path}`
}

/**
 * Mídia que não está empacotada no site (fichas de expansão) é lida direto
 * da fonte pública em https. Só endereços https são aceitos.
 */
function mediaSource(media) {
  if (media.remoteUrl) return media.remoteUrl
  if (media.sourceUrl && media.sourceUrl.startsWith('https://')) return media.sourceUrl
  return localMedia(media.path)
}

function glyphLabel(record) {
  if (record.type === 'lost-media') return 'dossiê de preservação'
  if (record.type === 'livro') return 'sistema de leitura'
  if (record.type === 'série') return 'sistema de séries'
  return 'sistema de cinema'
}

function isExternal(media) {
  return Boolean(media.remoteUrl) || Boolean(media.sourceUrl && media.sourceUrl.startsWith('https://'))
}

function Reader({ media }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [size, setSize] = useState(19)
  const [page, setPage] = useState(0)
  const [retry, setRetry] = useState(0)
  const top = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    setText(''); setError(false)
    try { setPage(Number(localStorage.getItem(`sys84-page:${media.path}`)) || 0) } catch { setPage(0) }
    fetch(mediaSource(media), { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.text() })
      .then(t => { if (/^\s*<!doctype html/i.test(t)) throw new Error(); setText(t) })
      .catch(e => { if (e.name !== 'AbortError') setError(true) })
    return () => controller.abort()
  }, [media.path, retry])
  const pages = []
  let current = '', words = 0
  for (const p of text.split(/\n\s*\n/).filter(Boolean)) {
    if (words > 650) { pages.push(current); current = ''; words = 0 }
    current += `${p}\n\n`; words += p.split(/\s+/).length
  }
  if (current) pages.push(current)
  const active = Math.min(Math.max(page, 0), Math.max(0, pages.length - 1))
  function turn(next) {
    setPage(next)
    try { localStorage.setItem(`sys84-page:${media.path}`, String(next)) } catch { /* Optional bookmark. */ }
    top.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }
  if (error) return <p role="alert">Não foi possível carregar o livro. <button onClick={() => setRetry(retry + 1)}>Tentar novamente</button></p>
  if (!text) return <p role="status">Carregando livro…</p>
  const controls = <div className="reader-controls">
    <button disabled={active === 0} onClick={() => turn(active - 1)}>← Anterior</button>
    <label>Página <select aria-label="Ir para página" value={active} onChange={e => turn(Number(e.target.value))}>{pages.map((_, i) => <option key={i} value={i}>{i + 1} / {pages.length}</option>)}</select></label>
    <button disabled={active === pages.length - 1} onClick={() => turn(active + 1)}>Próxima →</button>
  </div>
  return <section className="book-reader" aria-label="Leitor de livro" ref={top}>
    <div className="reader-tools"><span>LEITOR // {media.language || 'Idioma original'}</span><div>
      <button aria-label="Diminuir fonte" disabled={size <= 15} onClick={() => setSize(size - 2)}>A−</button>
      <button aria-label="Aumentar fonte" disabled={size >= 29} onClick={() => setSize(size + 2)}>A+</button>
    </div></div>{controls}
    <article className="book-paper" style={{ fontSize: size }}>{pages[active]}</article>
    {controls}<p className="reader-note">A página é lembrada neste navegador.</p>
  </section>
}

function Player({ media }) {
  const [failed, setFailed] = useState(false)
  const video = useRef(null)
  function restore() {
    try { const t = Number(localStorage.getItem(`sys84-video:${media.path}`)); if (t > 0 && t < video.current.duration - 5) video.current.currentTime = t } catch { /* Optional progress. */ }
  }
  function save() {
    try { localStorage.setItem(`sys84-video:${media.path}`, String(video.current.currentTime)) } catch { /* Optional progress. */ }
  }
  return <section className="video-player" aria-label="Player de vídeo">
    <video ref={video} controls playsInline preload="none" src={mediaSource(media)} onLoadedMetadata={restore} onPause={save} onEnded={save} onError={() => setFailed(true)} />
    {isExternal(media) && <p>Reprodução direta do acervo de origem · requer conexão.</p>}
    {failed && <p role="alert">O vídeo não pôde ser carregado. <button onClick={() => { setFailed(false); video.current.load() }}>Tentar novamente</button></p>}
    <p>{media.title} · {media.language || 'Idioma original'}{media.silent ? ' · Filme mudo, sem trilha adicionada' : ''}</p>
  </section>
}

export default function Record() {
  const { id } = useParams()
  const record = records.find(item => String(item.id) === id)
  const [selected, setSelected] = useState(0)
  useEffect(() => { setSelected(0); window.scrollTo(0, 0) }, [id])
  if (!record) return <NotFound />
  const media = record.media?.[selected] || record.media?.[0]
  const backTo = collectionOf(record)
  const chapters = record.media?.length || 0
  const hasText = (record.media || []).some((item) => item.kind === 'text')

  return <Layout className="dossie-page">
    <div className="dossier-frame">
      <DossierMasthead />

      <section className="prancha prancha-record">
        <Link className="back-link" to={backTo} onClick={playClick}>← VOLTAR AO CATÁLOGO</Link>

        <div className="record-grid">
          <header className="record-copy">
            <SectionMark>{`${record.code} / ${typeLabel(record)} DE ${yearOf(record)}`}</SectionMark>
            <h1>{record.title}</h1>
            {record.author && <p className="record-author">{record.author}</p>}
            <p className="hero-lead">{record.description}</p>

            <MetaPills items={[
              ['TIPO', typeLabel(record)],
              ['ANO', yearOf(record)],
              record.author && ['AUTORIA', record.author],
              chapters > 1 && ['PARTES', String(chapters)],
              record.availability === 'available' ? ['ESTADO', 'DISPONÍVEL'] : ['ESTADO', record.recoveryStatus || 'EM RECUPERAÇÃO'],
            ]} />

            {record.tags?.length > 0 && (
              <div className="record-tags">
                {record.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            )}

            {record.recoveryStatus && (
              <p className="recovery-note"><StatusSeal status={record.recoveryStatus}>PRESERVAÇÃO</StatusSeal> {record.recoveryStatus}</p>
            )}
          </header>

          <figure className="record-figure">
            <FrameMarks />
            <ItemGlyph record={record} size={190} tone={record.type === 'lost-media' ? 'ember' : 'acid'} />
            <figcaption>FIG. 084 — {String(glyphLabel(record)).toUpperCase()}</figcaption>
          </figure>

          <aside className="record-aside">
            <Panel title="FICHA DO REGISTRO" tone="acid">
              <div className="ficha-rows">
                <div><span>CÓDIGO</span><b>{record.code}</b></div>
                <div><span>COLEÇÃO</span><b>{backTo.replace('/', '').toUpperCase()}</b></div>
                <div><span>ANO</span><b>{yearOf(record)}</b></div>
                <div><span>IDIOMA</span><b>{record.language || 'Idioma original'}</b></div>
                <div><span>DIREITOS</span><b>{record.rightsNote ? 'Domínio público / livre' : 'Consultar fonte'}</b></div>
              </div>
            </Panel>

            <Panel title="ACESSO" tone="ember" className="panel-access">
              <ul className="system-list">
                <li><UiIcon name={hasText ? 'book' : 'play'} size={20} /><div><strong>{hasText ? 'Leitor unificado' : 'Player de vídeo'}</strong><span>{hasText ? 'texto direto da fonte pública' : 'reprodução direto do acervo de origem'}</span></div></li>
                <li><UiIcon name="lock" size={20} /><div><strong>Acesso público</strong><span>sem cadastro e sem download</span></div></li>
                <li><UiIcon name="loop" size={20} /><div><strong>Progresso lembrado</strong><span>página e minutagem neste navegador</span></div></li>
              </ul>
            </Panel>
          </aside>
        </div>
      </section>

      <section className="prancha prancha-media">
        <SectionMark>{hasText ? 'LEITOR / TEXTO ORIGINAL' : 'TRANSMISSÃO / CÓPIA DE ACERVO'}</SectionMark>

        {record.media?.length > 1 && (
          <label className="episode-select">ESCOLHER CAPÍTULO <select value={selected} onChange={e => setSelected(Number(e.target.value))}>{record.media.map((m, i) => <option value={i} key={m.path}>{m.title}</option>)}</select></label>
        )}

        {record.article && <article className="original-story"><h2>{record.type === 'lost-media' ? 'DOSSIÊ DE PRESERVAÇÃO' : 'FICÇÃO ORIGINAL // SYSTEM 84'}</h2>{record.article.map((p, i) => <p key={i}>{p}</p>)}{record.puzzle && <ArgPuzzle key={record.id} record={record} />}</article>}

        {media ? media.kind === 'text' ? <Reader key={media.path} media={media} /> : <Player key={media.path} media={media} /> : !record.article && <p role="status">Arquivo ainda não disponível.</p>}

        <details className="record-provenance"><summary>Sobre esta cópia e preservação</summary><p>{record.rightsNote}</p><p>{media?.license}</p>{record.sources?.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></p>)}</details>
      </section>

      <DossierFooter page={12} total={13} title={`${record.code} — ${record.title.toUpperCase()}`} />
    </div>
  </Layout>
}
