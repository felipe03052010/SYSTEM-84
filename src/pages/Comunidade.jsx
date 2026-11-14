import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../utils/auth'
import { playClick, playTyping } from '../utils/audio'

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'ArquivoCentral',
    role: 'creator',
    badge: 'CRIADOR',
    timestamp: '13/11/2026 19:42',
    content: 'Acervo de ficções analógicas atualizado. As novas fitas 07 e 08 já estão catalogadas.'
  },
  {
    id: 2,
    author: 'VigiasDaFita',
    role: 'creator',
    badge: 'CRIADOR',
    timestamp: '13/11/2026 20:10',
    content: 'O enigma do cofre 84 foi desvendado. Excelente pista matemática!'
  },
  {
    id: 3,
    author: 'SYS_ADMIN_084',
    role: 'admin',
    badge: 'ADMIN',
    timestamp: '13/11/2026 20:30',
    content: 'Avisos da moderação: mantenham as discussões focadas nos registros e investigações da rede.'
  }
]

export default function Comunidade() {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('system84_community_posts')
      if (saved) return JSON.parse(saved)
    } catch {}
    return INITIAL_POSTS
  })
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem('system84_community_posts', JSON.stringify(posts))
    } catch {}
  }, [posts])

  function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim()) return
    playClick()

    const newPost = {
      id: Date.now(),
      author: currentUser.username,
      role: currentUser.role,
      badge: currentUser.role === 'admin' ? 'ADMIN' : currentUser.role === 'creator' ? 'CRIADOR' : 'ASSINANTE',
      timestamp: new Date().toLocaleString('pt-BR'),
      content: newMessage.trim()
    }

    setPosts([newPost, ...posts])
    setNewMessage('')
  }

  function handleDelete(id) {
    playClick()
    if (window.confirm('Tem certeza que deseja apagar esta mensagem do mural da comunidade?')) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  return (
    <Layout>
      <section className="archive-header">
        <span className="directory">COMUNIDADE // CANAL 84.7</span>
        <h1>MURAL DA COMUNIDADE</h1>
        <p>Espaço aberto para criadores e operadores compartilharem descobertas, teorias e registros.</p>

        <div style={{ marginTop: '1rem', padding: '0.8rem', border: '1px solid var(--border, #33ff33)', display: 'inline-block' }}>
          <span>PERFIL ATUAL: <strong>{currentUser.username}</strong> ({currentUser.role === 'admin' ? 'ADMINISTRADOR' : currentUser.role === 'creator' ? 'CRIADOR' : 'ASSINANTE'})</span>

        </div>
      </section>

      <section style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <form onSubmit={handleSend} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="msgInput" style={{ fontFamily: 'monospace' }}>&gt; TRANSMITIR MENSAGEM:</label>
          <textarea
            id="msgInput"
            rows="3"
            value={newMessage}
            onChange={e => { setNewMessage(e.target.value); playTyping(); }}
            placeholder="Digite sua mensagem para a rede..."
            style={{ width: '100%', padding: '0.8rem', background: '#0a0a0a', color: '#33ff33', border: '1px solid #33ff33', fontFamily: 'monospace' }}
          />
          <button type="submit" style={{ alignSelf: 'flex-start', padding: '0.5rem 1.5rem', cursor: 'pointer', fontFamily: 'monospace' }}>
            ENVIAR MENSAGEM
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => {
            const canDelete = currentUser.role === 'admin' || post.author === currentUser.username

            return (
              <div
                key={post.id}
                style={{
                  border: '1px solid #225522',
                  padding: '1rem',
                  background: '#040d04',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#88cc88' }}>
                  <span>
                    <strong>{post.author}</strong> [{post.badge}] &bull; {post.timestamp}
                  </span>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      title="Apagar mensagem"
                      style={{
                        background: '#ff3333',
                        color: '#000',
                        border: 'none',
                        padding: '0.2rem 0.6rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                    >
                      [APAGAR]
                    </button>
                  )}
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#cceecc' }}>
                  {post.content}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </Layout>
  )
}
