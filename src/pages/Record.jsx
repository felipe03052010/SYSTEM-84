import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { records } from '../data/records'
import NotFound from './NotFound'
import '../styles/record.css'

function localMedia(path) {
  if (!/^media\/[a-zA-Z0-9/_.-]+$/.test(path) || path.includes('..')) throw new Error('Arquivo inválido')
  return `${import.meta.env.BASE_URL}${path}`
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
    fetch(localMedia(media.path), { signal: controller.signal })
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
    <video ref={video} controls playsInline preload="metadata" src={localMedia(media.path)} onLoadedMetadata={restore} onPause={save} onEnded={save} onError={() => setFailed(true)} />
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
  return <Layout><main className="record-detail">
    <Link className="back-link" to={record.type === 'livro' ? '/livros' : record.type === 'série' ? '/series' : record.type === 'lost-media' ? '/lost-media' : '/filmes'}>← VOLTAR AO CATÁLOGO</Link>
    <header className="record-heading"><span className="directory">{record.code} // {record.year}</span><h1>{record.title}</h1><p>{record.description}</p></header>
    {record.recoveryStatus && <p className="recovery-note">PRESERVAÇÃO // {record.recoveryStatus}</p>}
    {record.media?.length > 1 && <label className="episode-select">ESCOLHER CAPÍTULO <select value={selected} onChange={e => setSelected(Number(e.target.value))}>{record.media.map((m, i) => <option value={i} key={m.path}>{m.title}</option>)}</select></label>}
    {media ? media.kind === 'text' ? <Reader key={media.path} media={media} /> : <Player key={media.path} media={media} /> : <p role="status">Arquivo ainda não disponível.</p>}
    <details className="record-provenance"><summary>Sobre esta cópia e preservação</summary><p>{record.rightsNote}</p><p>{media?.license}</p>{record.sources?.map(source => <p key={source.url}>{source.title}</p>)}</details>
  </main></Layout>
}
