import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import { records, COLLECTIONS } from '../data/records'
import { useCommunityRecords } from '../utils/communityRecords'
import Layout from '../components/Layout'
import { playClick, playTyping } from '../utils/audio'
import { uiConfirm, uiError } from '../utils/retro-sounds'
import {
  DossierFooter,
  DossierMasthead,
  FrameMarks,
  ItemGlyph,
  Panel,
  SectionMark,
  StatusSeal,
  UiIcon,
  glyphFor,
  pad2,
  typeLabel,
  yearOf,
} from '../components/Chassis'
import '../styles/community.css'
import '../styles/figma.css'
import '../styles/dossie.css'

const CHANNELS = [
  { id: 'geral', label: 'GERAL', code: 'CH 01' },
  { id: 'teorias', label: 'TEORIAS', code: 'CH 02' },
  { id: 'perdidos', label: 'PERDIDOS', code: 'CH 03' },
  { id: 'envios', label: 'ENVIOS', code: 'CH 04' },
]

const REACTIONS = [
  { id: 'apoio', label: '▲ APOIO' },
  { id: 'teoria', label: '◆ TEORIA' },
  { id: 'dúvida', label: '? DÚVIDA' },
]

/* Cada postagem pode apontar para uma ficha do acervo. Guardamos só o necessário
   para recompor a logo única da ficha (o mesmo gerador usado em todo o site). */
const byId = new Map(records.map((record) => [String(record.id), record]))
const snapshot = (record) => (record ? { id: record.id, title: record.title, type: record.type, glyph: record.glyph, year: record.year } : undefined)
const PAGE = 24

const INITIAL_POSTS = [
  {
    id: 1,
    channel: 'geral',
    author: 'ArquivoCentral',
    role: 'creator',
    badge: 'CRIADOR',
    pinned: true,
    timestamp: '13/11/2026 19:42',
    content: 'Acervo atualizado com as novas fichas de domínio público. Cada registro traz a fonte e a licença no dossiê.',
  },
  {
    id: 2,
    channel: 'teorias',
    author: 'VigiasDaFita',
    role: 'creator',
    badge: 'CRIADOR',
    timestamp: '13/11/2026 20:10',
    content: 'A pista do cofre 84 estava na diferença entre os dois intertítulos. Quem viu o mesmo em Caligari?',
    record: snapshot(byId.get('3')),
  },
  {
    id: 3,
    channel: 'perdidos',
    author: 'SYS_ADMIN_084',
    role: 'admin',
    badge: 'ADMIN',
    timestamp: '13/11/2026 20:30',
    content: 'Aviso da moderação: dossiês de obras perdidas só entram com fonte institucional. Sem fonte, fica como investigação.',
    record: snapshot(byId.get('408')),
  },
]

const ENVIOS = [
  { id: 1, title: 'Capa do programa de rádio (1940)', by: 'VigiasDaFita', status: 'EM ANÁLISE', date: '12/11/2026' },
  { id: 2, title: 'Fotograma de London After Midnight', by: 'ArquivoCentral', status: 'APROVADO', date: '09/11/2026' },
  { id: 3, title: 'Digitalização de cartaz de 1927', by: 'Cineclube Sul', status: 'APROVADO', date: '02/11/2026' },
  { id: 4, title: 'Áudio de rádio sem procedência', by: 'anônimo', status: 'RECUSADO', date: '28/10/2026' },
]

export default function CommunityV2() {
  const { currentUser } = useAuth()
  const [channel, setChannel] = useState('geral')
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('system84_community_posts')
      if (saved) return JSON.parse(saved)
    } catch { /* preferência opcional */ }
    return INITIAL_POSTS
  })
  const [draft, setDraft] = useState('')
  const { items: community } = useCommunityRecords()
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(PAGE)
  const [picked, setPicked] = useState(null)
  const composeRef = useRef(null)
  const wall = useMemo(() => [...records, ...community], [community])
  const wallFiltered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return wall.filter((record) => (
      (filter === 'todos' || (filter === 'comunidade' ? record.fromCommunity : record.type === filter && !record.fromCommunity))
      && (!term || `${record.title} ${record.author || ''} ${record.code || ''}`.toLowerCase().includes(term))
    ))
  }, [wall, filter, search])
  const uniqueLogos = useMemo(() => new Set(wall.map((record) => glyphFor(record).id)).size, [wall])
  const filterChips = [
    { id: 'todos', label: 'TODOS', count: wall.length },
    ...COLLECTIONS.map((item) => ({ id: item.type, label: item.label.toUpperCase(), count: wall.filter((record) => record.type === item.type && !record.fromCommunity).length })),
    { id: 'comunidade', label: 'COMUNIDADE', count: community.length },
  ]
  function pick(record) {
    playClick()
    setPicked(picked && String(picked.id) === String(record.id) ? null : snapshot(record))
  }
  function discuss() {
    playClick()
    composeRef.current?.scrollIntoView?.({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    composeRef.current?.focus?.({ preventScroll: true })
  }
  const [reactions, setReactions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('system84_community_reactions') || '{}') } catch { return {} }
  })

  function toggleReaction(postId, reaction) {
    playClick()
    setReactions((current) => {
      const mine = current[`${postId}:${currentUser.username}`] || []
      const next = mine.includes(reaction) ? mine.filter((item) => item !== reaction) : [...mine, reaction]
      const updated = { ...current, [`${postId}:${currentUser.username}`]: next }
      try { localStorage.setItem('system84_community_reactions', JSON.stringify(updated)) } catch { /* preferência opcional */ }
      return updated
    })
  }

  function reactionCount(postId, reaction) {
    return Object.entries(reactions)
      .filter(([key]) => key.startsWith(`${postId}:`))
      .filter(([, list]) => (list || []).includes(reaction))
      .length
  }

  function myReactions(postId) {
    return reactions[`${postId}:${currentUser.username}`] || []
  }

  const members = [...new Map(posts.map((post) => [post.author, post.badge])).entries()]

  function persist(next) {
    setPosts(next)
    try {
      localStorage.setItem('system84_community_posts', JSON.stringify(next))
    } catch { /* preferência opcional */ }
  }

  function handleSend(event) {
    event.preventDefault()
    if (!draft.trim()) {
      uiError()
      return
    }
    uiConfirm()
    const post = {
      id: Date.now(),
      channel,
      author: currentUser.username,
      role: currentUser.role,
      badge: currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'creator' ? 'CRIADOR' : 'ASSINANTE',
      timestamp: new Date().toLocaleString('pt-BR'),
      content: draft.trim(),
      ...(picked ? { record: picked } : {}),
    }
    persist([post, ...posts])
    setDraft('')
    setPicked(null)
  }

  function handleDelete(id) {
    playClick()
    if (window.confirm('Apagar esta mensagem do mural?')) {
      persist(posts.filter((post) => post.id !== id))
    }
  }

  const visible = posts
    .filter((post) => (post.channel || 'geral') === channel)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || String(b.timestamp).localeCompare(String(a.timestamp)))
  const online = 12 + (posts.length % 9)

  return (
    <Layout className="dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        <section className="prancha prancha-community">
          <div className="community-grid">
            <div className="community-copy">
              <h1>MURAL DA COMUNIDADE</h1>
              <p className="hero-lead">
                Um quadro de avisos antigo para quem mantém o arquivo: teorias,
                achados, dossiês e envios. Escolha um canal e transmita.
              </p>
              <SectionMark>COMUNIDADE / BBS 84.7</SectionMark>
            </div>

            <div className="community-side">
              <Panel title="CONEXÃO" tone="acid">
                <div className="connection-readout">
                  <span>NÓ ................ 84.7</span>
                  <span>BAUD .............. 2400</span>
                  <span>OPERADOR .......... {currentUser.username}</span>
                  <span>NÍVEL ............. {currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'creator' ? 'CRIADOR' : 'ASSINANTE'}</span>
                  <span className="bbs-online">ONLINE ............ {online}</span>
                </div>
              </Panel>

              <Panel title="CANAL ABERTO" tone="ember">
                <p className="panel-copy">
                  Todo registro enviado passa pela moderação antes de virar ficha do
                  acervo. Sem fonte, a obra fica como investigação em aberto.
                </p>
                <div className="community-legend">
                  <StatusSeal status="recuperada">APROVADO</StatusSeal>
                  <StatusSeal status="fragmentária">EM ANÁLISE</StatusSeal>
                  <StatusSeal status="desaparecida">RECUSADO</StatusSeal>
                </div>
                <Link className="pill-button community-cta" to="/enviar" onClick={playClick}>ENVIAR ITEM AO CATÁLOGO ↗</Link>
              </Panel>

              <Panel title="MEMBROS DO SINAL" tone="ember">
                <ul className="system-list">
                  {members.slice(0, 6).map(([name, badge]) => (
                    <li key={name}>
                      <UiIcon name="user" size={18} />
                      <div><strong>{name}</strong><span>{badge}</span></div>
                    </li>
                  ))}
                  {members.length === 0 && <li><div><strong>NENHUM MEMBRO</strong><span>seja o primeiro a transmitir</span></div></li>}
                </ul>
              </Panel>
            </div>
          </div>
        </section>

        <section className="prancha prancha-glyphs" aria-labelledby="glyph-wall-title">
          <SectionMark tone="ember">ACERVO / MARCA ÚNICA POR FICHA</SectionMark>
          <h2 id="glyph-wall-title" className="prancha-title">FICHAS DO CATÁLOGO EM DISCUSSÃO</h2>
          <p className="panel-copy">
            Cada item do acervo tem uma logo própria, no mesmo desenho de arame do dossiê.
            Escolha uma ficha para levá-la ao mural e conversar sobre ela com a comunidade.
          </p>

          <div className="glyph-stats" aria-live="polite">
            <span><strong>{pad2(wall.length)}</strong> FICHAS</span>
            <span><strong>{pad2(uniqueLogos)}</strong> LOGOS ÚNICAS</span>
            <span><strong>{pad2(wallFiltered.length)}</strong> NA BUSCA</span>
          </div>

          <div className="glyph-tools">
            <nav className="glyph-filters" aria-label="Filtrar fichas por coleção">
              {filterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className={filter === chip.id ? 'is-active' : ''}
                  aria-pressed={filter === chip.id}
                  onClick={() => { playClick(); setFilter(chip.id); setShown(PAGE) }}
                >
                  {chip.label}<em>{pad2(chip.count)}</em>
                </button>
              ))}
            </nav>
            <label className="glyph-search">
              <UiIcon name="search" size={16} />
              <span className="sr-only">Buscar ficha</span>
              <input
                type="search"
                value={search}
                maxLength={80}
                placeholder="título, autor ou código..."
                onChange={(event) => { setSearch(event.target.value); setShown(PAGE) }}
              />
            </label>
          </div>

          {picked && (
            <div className="glyph-picked" role="status">
              <ItemGlyph record={picked} size={52} />
              <div>
                <span>FICHA ESCOLHIDA</span>
                <strong>{picked.title}</strong>
              </div>
              <button type="button" onClick={discuss}>DISCUTIR NO MURAL ▸</button>
              <Link to={`/obra/${picked.id}`} onClick={playClick}>ABRIR FICHA ↗</Link>
              <button type="button" className="glyph-clear" onClick={() => { playClick(); setPicked(null) }} aria-label="Limpar ficha escolhida">✕</button>
            </div>
          )}

          <ul className="glyph-wall">
            {wallFiltered.slice(0, shown).map((record) => {
              const active = picked && String(picked.id) === String(record.id)
              return (
                <li key={`${record.fromCommunity ? 'c' : 'o'}-${record.id}`}>
                  <button type="button" className={`glyph-tile ${active ? 'is-picked' : ''}`} onClick={() => pick(record)} aria-pressed={Boolean(active)}>
                    <span className="glyph-art"><ItemGlyph record={record} size={64} /></span>
                    <strong>{record.title}</strong>
                    <span className="glyph-meta">{record.fromCommunity ? 'COMUNIDADE' : typeLabel(record)} / {yearOf(record)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {wallFiltered.length === 0 && <p className="bbs-empty">&gt; nenhuma ficha encontrada. ajuste a busca ou a coleção.</p>}
          {wallFiltered.length > shown && (
            <button type="button" className="glyph-more" onClick={() => { playClick(); setShown((value) => value + PAGE) }}>
              MOSTRAR MAIS FICHAS ▾ <em>{pad2(wallFiltered.length - shown)}</em>
            </button>
          )}
        </section>

        <section className="prancha prancha-bbs">
          <SectionMark tone="acid">CANAL ABERTO / TRANSMISSÕES</SectionMark>

          <nav className="dossier-channels" aria-label="Canais do mural">
            {CHANNELS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={channel === item.id ? 'is-active' : ''}
                onClick={() => { playClick(); setChannel(item.id) }}
                aria-pressed={channel === item.id}
              >
                <span>{item.code}</span>
                {item.label}
                <em>{pad2(posts.filter((post) => (post.channel || 'geral') === item.id).length)}</em>
              </button>
            ))}
          </nav>

          <div className="dossier-bbs">
            <form className="dossier-compose" onSubmit={handleSend}>
              <label htmlFor="bbsInput">
                <UiIcon name="upload" size={16} />
                TRANSMITIR PARA #{channel.toUpperCase()}
              </label>
              {picked && (
                <div className="compose-ref">
                  <ItemGlyph record={picked} size={34} />
                  <span>FICHA ANEXADA / <strong>{picked.title}</strong></span>
                  <button type="button" onClick={() => { playClick(); setPicked(null) }} aria-label="Remover ficha anexada">✕</button>
                </div>
              )}
              <textarea
                id="bbsInput"
                ref={composeRef}
                rows={4}
                value={draft}
                maxLength={600}
                placeholder="digite sua mensagem para a rede..."
                onChange={(event) => { setDraft(event.target.value); playTyping() }}
              />
              <div className="compose-foot">
                <span>{draft.length}/600</span>
                <button type="submit">TRANSMITIR ▸</button>
              </div>
            </form>

            <div className="dossier-posts">
              {visible.length === 0 && (
                <p className="bbs-empty">&gt; nenhuma mensagem neste canal. seja o primeiro.</p>
              )}

              {visible.map((post) => {
                const canDelete = currentUser.role === 'admin' || post.author === currentUser.username
                return (
                  <article key={post.id} className={`dossier-post ${post.pinned ? 'is-pinned' : ''}`}>
                    <header>
                      <strong>{post.author}</strong>
                      <span className="bbs-badge">{post.badge}</span>
                      {post.pinned && <span className="bbs-badge bbs-pin">FIXADO</span>}
                      <time>{post.timestamp}</time>
                      {canDelete && (
                        <button type="button" onClick={() => handleDelete(post.id)} aria-label="Apagar mensagem">
                          [APAGAR]
                        </button>
                      )}
                    </header>
                    {post.record && (
                      <Link className="post-ref" to={`/obra/${post.record.id}`} onClick={playClick}>
                        <ItemGlyph record={post.record} size={38} />
                        <span><em>FICHA / {typeLabel(post.record)} {yearOf(post.record)}</em>{post.record.title}</span>
                        <i aria-hidden="true">↗</i>
                      </Link>
                    )}
                    <p>{post.content}</p>
                    <footer className="bbs-reactions">
                      {REACTIONS.map((reaction) => {
                        const count = reactionCount(post.id, reaction.id)
                        const mine = myReactions(post.id).includes(reaction.id)
                        return (
                          <button
                            key={reaction.id}
                            type="button"
                            className={mine ? 'is-active' : ''}
                            onClick={() => toggleReaction(post.id, reaction.id)}
                            aria-pressed={mine}
                          >
                            {reaction.label}{count > 0 ? ` ${count}` : ''}
                          </button>
                        )
                      })}
                    </footer>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="prancha prancha-envios">
          <SectionMark tone="ember">ENVIOS / FILA DE ANÁLISE</SectionMark>
          <h2 className="prancha-title">ARQUIVOS ENVIADOS PELA COMUNIDADE</h2>
          <p className="panel-copy">Todo arquivo passa pela moderação antes de virar registro no acervo.</p>

          <div className="envios-table">
            <div className="envios-row envios-head">
              <span>ARQUIVO</span>
              <span>ENVIADO POR</span>
              <span>DATA</span>
              <span>STATUS</span>
            </div>
            {ENVIOS.map((item) => (
              <div className="envios-row" key={item.id}>
                <span className="envio-title"><ItemGlyph record={{ id: `envio-${item.id}`, type: 'lost-media', title: item.title }} size={30} />{item.title}</span>
                <span>{item.by}</span>
                <span>{item.date}</span>
                <span><StatusSeal status={item.status}>{item.status}</StatusSeal></span>
              </div>
            ))}
          </div>
        </section>

        <DossierFooter page={9} total={13} />
      </div>
    </Layout>
  )
}
