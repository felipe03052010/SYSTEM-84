import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BootScreen from '../components/BootScreen'
import Layout from '../components/Layout'
import { playClick, playTyping } from '../utils/audio'
import '../styles/home.css'

export default function Home() {
  const [bootFinished, setBootFinished] = useState(
    () => { try { return sessionStorage.getItem('system84Booted') === 'true' } catch { return false } },
  )
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function completeBoot() {
    try { sessionStorage.setItem('system84Booted', 'true') } catch { /* Optional session. */ }
    setBootFinished(true)
  }

  function search(event) {
    event.preventDefault()
    playClick()

    if (!query.trim()) return

    navigate(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      {!bootFinished && <BootScreen onComplete={completeBoot} />}

      <Layout className={bootFinished ? 'site-ready' : 'site-hidden'}>
        <section className="home-hero">
          <div className="terminal-window">
            <div className="terminal-bar">
              <span>ARQUIVO_PRINCIPAL.EXE</span>
              <span>_ □ ×</span>
            </div>

            <div className="terminal-body">
              <div className="system-log">
                <p>&gt; Inicializando banco de memória cultural...</p>
                <p>&gt; Verificando registros históricos...</p>
                <p className="success">&gt; CONEXÃO ESTABELECIDA.</p>
              </div>

              <span className="directory">SYS84 // ARQUIVO CULTURAL</span>

              <h1 className="glitch-text">
                ALGUMAS HISTÓRIAS<br />
                NÃO DEVEM SER<br />
                <span>ESQUECIDAS.</span>
              </h1>

              <p className="home-intro">
                Um arquivo digital dedicado à preservação, documentação
                e redescoberta de filmes, séries e livros.
              </p>

              <form className="home-search" onSubmit={search}>
                <label htmlFor="homeSearch">&gt; PESQUISAR NO ARQUIVO</label>

                <div>
                  <span>C:\ARQUIVO&gt;</span>
                  <input
                    id="homeSearch"
                    type="search"
                    value={query}
                    placeholder="Digite título, autor ou ano..."
                    onChange={(event) => {
                      setQuery(event.target.value)
                      playTyping()
                    }}
                  />
                  <button type="submit">BUSCAR</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="home-directories">
          <div className="section-heading">
            <span className="directory">DIRETÓRIO / 001</span>
            <h2>EXPLORAR O ARQUIVO</h2>
          </div>

          <div className="directory-grid">
            <Link to="/filmes">
              <span>[01] DIR</span>
              <strong>FILMES</strong>
              <p>Cinema clássico, experimental, independente e histórico.</p>
              <em>&gt; ACESSAR DIRETÓRIO</em>
            </Link>

            <Link to="/series">
              <span>[02] DIR</span>
              <strong>SÉRIES</strong>
              <p>Séries clássicas, antologias e produções difíceis de localizar.</p>
              <em>&gt; ACESSAR DIRETÓRIO</em>
            </Link>

            <Link to="/livros">
              <span>[03] DIR</span>
              <strong>LIVROS</strong>
              <p>Literatura histórica, obras esgotadas e publicações antigas.</p>
              <em>&gt; ACESSAR DIRETÓRIO</em>
            </Link>
            <Link to="/analog-horror"><span>[04] VHS</span><strong>ANALOG HORROR</strong><p>Transmissões impossíveis e fitas de treinamento. Ficções originais em português.</p><em>&gt; SINTONIZAR FITAS</em></Link>
            <Link to="/arg"><span>[05] ARG</span><strong>ARQUIVOS INTERATIVOS</strong><p>Decifre pistas e desbloqueie os desfechos de seis investigações fictícias.</p><em>&gt; INICIAR INVESTIGAÇÃO</em></Link>
          </div>
        </section>

        <section className="home-lost">
          <div>
            <span className="directory">DIRETÓRIO ESPECIAL / 003</span>
            <h2>LOST MEDIA<span className="blink">_</span></h2>
            <p>
              Documente obras que sobrevivem apenas em registros,
              fragmentos, referências e memórias.
            </p>
            <Link to="/lost-media" onClick={playClick}>
              EXPLORAR ARQUIVOS PERDIDOS &gt;
            </Link>
          </div>
        </section>
      </Layout>
    </>
  )
}
