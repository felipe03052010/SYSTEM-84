import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { accessRequest, useAuth } from '../utils/auth'
import { playClick, playTyping } from '../utils/audio'
import { uiConfirm, uiError } from '../utils/retro-sounds'
import {
  DossierFooter,
  DossierMasthead,
  FrameMarks,
  Panel,
  SectionMark,
  StatusSeal,
  UiIcon,
} from '../components/Chassis'
import '../styles/dossie.css'
import '../styles/community.css'

const TYPES = [
  { id: 'filme', label: 'Filme' },
  { id: 'livro', label: 'Livro' },
  { id: 'série', label: 'Série' },
  { id: 'lost-media', label: 'Lost media / dossiê' },
  { id: 'analog-horror', label: 'Fita de analog horror' },
]

const STATUS_LABEL = { pending: 'EM ANÁLISE', approved: 'APROVADO', rejected: 'RECUSADO' }

export default function Enviar() {
  const { currentUser } = useAuth()
  const [form, setForm] = useState({ title: '', type: 'livro', year: '', author: '', description: '', tags: '', article: '', mediaUrl: '', mediaKind: 'text', sourceUrl: '', sourceTitle: '' })
  const [mine, setMine] = useState([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const authed = currentUser.role !== 'guest'

  async function loadMine() {
    if (!authed) return
    try {
      const data = await accessRequest('/submissions/mine')
      setMine(data.submissions || [])
    } catch { /* sem conexão com a API */ }
  }

  useEffect(() => { loadMine() }, [authed])

  function set(key) {
    return (event) => { setForm((current) => ({ ...current, [key]: event.target.value })); playTyping() }
  }

  async function submit(event) {
    event.preventDefault()
    if (!authed) { uiError(); setStatus('Entre na sua conta para publicar no catálogo.'); return }
    setBusy(true); setStatus('')
    const tags = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    const sources = form.sourceUrl.trim().startsWith('https://') ? [{ title: form.sourceTitle.trim() || 'Fonte indicada', url: form.sourceUrl.trim() }] : []
    try {
      await accessRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title.trim(),
          type: form.type,
          year: Number(form.year),
          author: form.author.trim() || undefined,
          description: form.description.trim(),
          tags,
          sources,
          article: form.article.trim() || undefined,
          mediaUrl: form.mediaUrl.trim() || undefined,
          mediaKind: form.mediaUrl.trim() ? form.mediaKind : undefined,
        }),
      })
      uiConfirm()
      setStatus('Envio registrado. Ele entra no catálogo depois da aprovação da moderação.')
      setForm({ title: '', type: 'livro', year: '', author: '', description: '', tags: '', article: '', mediaUrl: '', mediaKind: 'text', sourceUrl: '', sourceTitle: '' })
      loadMine()
    } catch (error) {
      uiError()
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout className="dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        <section className="prancha prancha-collection">
          <div className="collection-grid">
            <div className="collection-copy">
              <h1>ENVIE<br />AO<br />ACERVO</h1>
              <p className="collection-kicker">ARQUIVO / CONTRIBUIÇÃO DA COMUNIDADE</p>
              <p className="hero-lead">
                Encontrou uma obra que merece entrar no catálogo? Publique aqui:
                cada envio passa pela moderação e, aprovado, vira registro com
                ficha, fonte e marca própria no acervo.
              </p>
              <p className="terminal-line typing-line">AGUARDANDO CONTRIBUIÇÃO...</p>
            </div>

            <figure className="collection-figure-wrap">
              <FrameMarks />
              <svg className="collection-figure" viewBox="0 0 320 320" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="miter" strokeLinecap="square" role="img" aria-label="Figura 084 — envio ao acervo">
                <rect x="90" y="60" width="140" height="180" />
                <path d="M120 110h80M120 140h80M120 170h56" />
                <path d="M120 210h80" stroke="var(--fig-ember)" strokeWidth="4" />
                <path d="M140 230l30 30 60-70" stroke="var(--fig-ember)" strokeWidth="4" />
                <path d="M30 30h26M30 30v26M290 30h-26M290 30v26" stroke="var(--fig-ember)" strokeWidth="3" />
              </svg>
              <figcaption>FIG. 084 — CONTRIBUIÇÃO</figcaption>
            </figure>

            <div className="collection-side">
              <Panel title="COMO FUNCIONA" tone="acid">
                <ul className="system-list">
                  <li><UiIcon name="upload" size={20} /><div><strong>Envie</strong><span>título, tipo, ano, descrição e conteúdo</span></div></li>
                  <li><UiIcon name="eye" size={20} /><div><strong>Moderação</strong><span>a equipe confere fonte e licença</span></div></li>
                  <li><UiIcon name="archive" size={20} /><div><strong>Catálogo</strong><span>aprovado, vira ficha com marca única</span></div></li>
                  <li><UiIcon name="lock" size={20} /><div><strong>Direitos</strong><span>só publique o que tem direito de compartilhar</span></div></li>
                </ul>
              </Panel>
            </div>
          </div>
        </section>

        <section className="prancha prancha-bbs">
          <SectionMark tone="acid">FORMULÁRIO / NOVO REGISTRO</SectionMark>
          {!authed ? (
            <div className="empty-state">
              &gt; PARA PUBLICAR, ENTRE NA SUA CONTA.{' '}
              <Link to="/entrada">ABRIR TERMINAL DE ACESSO ↗</Link>
            </div>
          ) : (
            <form className="dossier-compose enviar-form" onSubmit={submit}>
              <div className="enviar-grid">
                <label>TÍTULO *<input value={form.title} onChange={set('title')} maxLength={200} required placeholder="Nome da obra ou fita" /></label>
                <label>TIPO *
                  <select value={form.type} onChange={set('type')}>
                    {TYPES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </label>
                <label>ANO *<input value={form.year} onChange={set('year')} type="number" min={0} max={2100} required placeholder="Ex.: 1994" /></label>
                <label>AUTORIA<input value={form.author} onChange={set('author')} maxLength={120} placeholder="Autor, diretor, emissora…" /></label>
              </div>
              <label>DESCRIÇÃO *<textarea rows={3} value={form.description} onChange={set('description')} maxLength={2000} required placeholder="Do que se trata? Por que merece entrar no acervo?" /></label>
              <label>TAGS<input value={form.tags} onChange={set('tags')} placeholder="separadas por vírgula" /></label>

              <div className="enviar-grid">
                <label>CONTEÚDO — TEXTO<textarea rows={5} value={form.article} onChange={set('article')} placeholder="Transcrição, resumo, artigo ou texto integral (opcional se houver link de mídia)" /></label>
                <div className="enviar-side">
                  <label>MÍDIA — LINK https<input value={form.mediaUrl} onChange={set('mediaUrl')} type="url" placeholder="https://… (opcional)" /></label>
                  <label>TIPO DE MÍDIA
                    <select value={form.mediaKind} onChange={set('mediaKind')} disabled={!form.mediaUrl.trim()}>
                      <option value="text">Texto / leitura</option>
                      <option value="video">Vídeo</option>
                    </select>
                  </label>
                  <label>FONTE — TÍTULO<input value={form.sourceTitle} onChange={set('sourceTitle')} maxLength={200} placeholder="Ex.: Internet Archive" /></label>
                  <label>FONTE — URL https<input value={form.sourceUrl} onChange={set('sourceUrl')} type="url" placeholder="https://… (opcional)" /></label>
                </div>
              </div>

              <div className="compose-foot">
                <span>{status}</span>
                <button type="submit" disabled={busy}>{busy ? 'ENVIANDO…' : 'ENVIAR PARA MODERAÇÃO ▸'}</button>
              </div>
            </form>
          )}
        </section>

        {mine.length > 0 && (
          <section className="prancha prancha-envios">
            <SectionMark tone="ember">MEUS ENVIOS / STATUS</SectionMark>
            <div className="envios-table">
              <div className="envios-row envios-head">
                <span>OBRA</span><span>TIPO</span><span>DATA</span><span>STATUS</span>
              </div>
              {mine.map((item) => (
                <div className="envios-row" key={item.id}>
                  <span>{item.title}</span>
                  <span>{TYPES.find((t) => t.id === item.type)?.label || item.type}</span>
                  <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                  <span><StatusSeal status={item.status === 'approved' ? 'recuperada' : item.status === 'rejected' ? 'desaparecida' : 'fragmentária'}>{STATUS_LABEL[item.status] || item.status}</StatusSeal></span>
                </div>
              ))}
            </div>
          </section>
        )}

        <DossierFooter page={10} total={13} title="ENVIO AO ACERVO — SYSTEM 84" />
      </div>
    </Layout>
  )
}
