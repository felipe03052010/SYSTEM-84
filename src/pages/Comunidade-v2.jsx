import { useState } from 'react'
import { useAuth } from '../utils/auth'
import Layout from '../components/Layout'
import { playClick, playTyping } from '../utils/audio'
import { uiConfirm, uiError } from '../utils/retro-sounds'
import '../styles/community.css'

const CHANNELS = [
  { id: 'geral', label: 'GERAL', code: 'CH 01' },
  { id: 'teorias', label: 'TEORIAS', code: 'CH 02' },
  { id: 'perdidos', label: 'PERDIDOS', code: 'CH 03' },
  { id: 'envios', label: 'ENVIOS', code: 'CH 04' },
]

const INITIAL_POSTS = [
  {
    id: 1,
    channel: 'geral',
    author: 'ArquivoCentral',
    role: 'creator',
    badge: 'CRIADOR',
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
  },
  {
    id: 3,
    channel: 'perdidos',
    author: 'SYS_ADMIN_084',
    role: 'admin',
    badge: 'ADMIN',
    timestamp: '13/11/2026 20:30',
    content: 'Aviso da moderação: dossiês de obras perdidas só entram com fonte institucional. Sem fonte, fica como investigação.',
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
    }
    persist([post, ...posts])
    setDraft('')
  }

  function handleDelete(id) {
    playClick()
    if (window.confirm('Apagar esta mensagem do mural?')) {
      persist(posts.filter((post) => post.id !== id))
    }
  }

  const visible = posts.filter((post) => (post.channel || 'geral') === channel)
  const online = 12 + (posts.length % 9)

  return (
    <Layout>
      <section className="archive-hero community-hero">
        <div>
          <span className="directory">COMUNIDADE // BBS 84.7</span>
          <h1>MURAL DA COMUNIDADE</h1>
          <p>
            Um quadro de avisos antigo para quem mantém o arquivo: teorias, achados,
            dossiês e envios. Escolha um canal e transmita.
          </p>
        </div>

        <aside className="bbs-panel">
          <span className="bbs-title">CONEXÃO</span>
          <span>NÓ ................ 84.7</span>
          <span>BAUD .............. 2400</span>
          <span>OPERADOR .......... {currentUser.username}</span>
          <span>NÍVEL ............. {currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'creator' ? 'CRIADOR' : 'ASSINANTE'}</span>
          <span className="bbs-online">ONLINE ............ {online}</span>
        </aside>
      </section>

      <section className="bbs-body">
        <nav className="bbs-channels" aria-label="Canais do mural">
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
              <em>{posts.filter((post) => (post.channel || 'geral') === item.id).length}</em>
            </button>
          ))}
        </nav>

        <div className="bbs-stream">
          <form className="bbs-compose" onSubmit={handleSend}>
            <label htmlFor="bbsInput">&gt; TRANSMITIR PARA #{channel.toUpperCase()}</label>
            <textarea
              id="bbsInput"
              rows={3}
              value={draft}
              maxLength={600}
              placeholder="digite sua mensagem para a rede..."
              onChange={(event) => { setDraft(event.target.value); playTyping() }}
            />
            <div className="bbs-compose-foot">
              <span>{draft.length}/600</span>
              <button type="submit">TRANSMITIR ▸</button>
            </div>
          </form>

          <div className="bbs-posts">
            {visible.length === 0 && (
              <p className="bbs-empty">&gt; nenhuma mensagem neste canal. seja o primeiro.</p>
            )}

            {visible.map((post) => {
              const canDelete = currentUser.role === 'admin' || post.author === currentUser.username
              return (
                <article key={post.id} className="bbs-post">
                  <header>
                    <strong>{post.author}</strong>
                    <span className="bbs-badge">{post.badge}</span>
                    <time>{post.timestamp}</time>
                    {canDelete && (
                      <button type="button" onClick={() => handleDelete(post.id)} aria-label="Apagar mensagem">
                        [APAGAR]
                      </button>
                    )}
                  </header>
                  <p>{post.content}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="archive-section">
        <div className="section-heading">
          <span className="directory">ENVIOS / FILA DE ANÁLISE</span>
          <h2>ARQUIVOS ENVIADOS PELA COMUNIDADE</h2>
          <p>Todo arquivo passa pela moderação antes de virar registro no acervo.</p>
        </div>

        <div className="envios-table">
          <div className="envios-row envios-head">
            <span>ARQUIVO</span>
            <span>ENVIADO POR</span>
            <span>DATA</span>
            <span>STATUS</span>
          </div>
          {ENVIOS.map((item) => (
            <div className="envios-row" key={item.id}>
              <span>{item.title}</span>
              <span>{item.by}</span>
              <span>{item.date}</span>
              <span className={`envio-status is-${item.status.toLowerCase().replace(/[^a-z]/g, '')}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
