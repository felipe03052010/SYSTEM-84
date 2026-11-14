import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BootScreen from '../components/BootScreen'
import Layout from '../components/Layout'
import { records } from '../data/records'
import { playClick, playTyping } from '../utils/audio'
import '../styles/home.css'

const total = records.length
const filmes = records.filter((record) => record.type === 'filme').length
const livros = records.filter((record) => record.type === 'livro').length
const perdidos = records.filter((record) => record.type === 'lost-media').length

const directories = [
  {
    to: '/filmes',
    index: '[01] DIR',
    title: 'FILMES',
    text: 'Expressionismo, ficção científica e cinema mudo preservados em cópia de acervo.',
    action: '> abrir diretório',
  },
  {
    to: '/series',
    index: '[02] DIR',
    title: 'SÉRIES',
    text: 'Seriados históricos, capítulos recuperados e transmissões interrompidas.',
    action: '> abrir diretório',
  },
  {
    to: '/livros',
    index: '[03] DIR',
    title: 'LIVROS',
    text: 'Textos integrais de domínio público, com leitor interno e progresso salvo.',
    action: '> abrir diretório',
  },
  {
    to: '/lost-media',
    index: '[04] VHS',
    title: 'LOST MEDIA',
    text: 'Dossiês de obras que sobrevivem só em fragmentos, registros e memória.',
    action: '> abrir dossiês',
  },
  {
    to: '/comunidade',
    index: '[05] MURAL',
    title: 'COMUNIDADE',
    text: 'Mural de registros enviados por quem também mantém o arquivo vivo.',
    action: '> entrar no mural',
  },
]

function HomeV2Legacy() {
  const [bootFinished, setBootFinished] = useState(
    () => {
      try {
        return sessionStorage.getItem('system84Booted') === 'true'
      } catch {
        return false
      }
    },
  )
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function completeBoot() {
    try {
      sessionStorage.setItem('system84Booted', 'true')
    } catch {
      /* Sessão opcional. */
    }
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
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="directory">ARQUIVO CULTURAL / SYS84</span>
              <span className="hero-tag is-alarm">ACESSO PÚBLICO</span>
            </div>

            <h1 className="glitch-text">
              ALGUMAS HISTÓRIAS<br />
              NÃO DEVEM SER <em>ESQUECIDAS</em>.
              <small>terminal de preservação // fita 84</small>
            </h1>

            <p>
              Um arquivo digital de filmes, séries, livros e lost media.
              Tudo é lido e assistido dentro do site — com fonte, licença
              e a história da preservação registradas em cada dossiê.
            </p>

            <div className="hero-actions">
              <Link className="hero-primary" to="/filmes" onClick={playClick}>
                Entrar no acervo →
              </Link>
              <Link className="hero-secondary" to="/lost-media" onClick={playClick}>
                Ver lost media
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{total}</strong>
                <span>registros</span>
              </div>
              <div className="hero-stat">
                <strong>{filmes}</strong>
                <span>filmes</span>
              </div>
              <div className="hero-stat">
                <strong>{livros}</strong>
                <span>livros</span>
              </div>
              <div className="hero-stat">
                <strong>{perdidos}</strong>
                <span>perdidos</span>
              </div>
            </div>
          </div>

          <div className="handheld">
            <div className="handheld-top">
              <span>SYSTEM 84 · PORTABLE ARCHIVE</span>
              <span className="handheld-led">ON</span>
            </div>

            <div className="handheld-screen">
              <div className="screen-inner">
                <div className="screen-head">
                  <span>ARQUIVO_PRINCIPAL.EXE</span>
                  <span>84%</span>
                </div>

                <div className="screen-log">
                  <p>&gt; montando banco de memória cultural</p>
                  <p>&gt; verificando registros históricos</p>
                  <p className="success">&gt; CONEXÃO ESTABELECIDA</p>
                </div>

                <p className="screen-title">
                  TERMINAL DE PRESERVAÇÃO <em>DIGITAL</em>
                </p>

                <form className="screen-search" onSubmit={search}>
                  <label htmlFor="homeSearch">&gt; pesquisar no arquivo</label>

                  <div className="screen-search-field">
                    <span>&gt;</span>
                    <input
                      id="homeSearch"
                      type="search"
                      value={query}
                      placeholder="título, autor ou ano..."
                      onChange={(event) => {
                        setQuery(event.target.value)
                        playTyping()
                      }}
                    />
                    <button type="submit">buscar</button>
                  </div>
                </form>

                <p className="screen-hint">A / enter busca · B / esc volta</p>
              </div>
            </div>

            <div className="handheld-controls">
              <div className="dpad" aria-hidden="true" />

              <div className="handheld-keys">
                <span className="key is-soft" aria-hidden="true">B</span>
                <span className="key" aria-hidden="true">A</span>
              </div>
            </div>

            <div className="handheld-caption">
              <span>arquivo offline · réplica</span>
              <span>rev 1.0.84</span>
            </div>
          </div>
        </section>

        <section className="home-directories">
          <div className="section-heading">
            <span className="directory">DIRETÓRIOS / 005</span>
            <h2>EXPLORAR O ARQUIVO</h2>
            <p>
              Cinco salas, uma só memória. Cada diretório guarda registros com
              fonte, licença e dossiê de preservação.
            </p>
          </div>

          <div className="directory-grid">
            {directories.map((item) => (
              <Link key={item.to} className="directory-card" to={item.to} onClick={playClick}>
                <span className="dir-index">{item.index}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
                <em>{item.action}</em>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-lost">
          <div className="lost-band">
            <div>
              <span className="directory">DIRETÓRIO ESPECIAL / 006</span>
              <h2>LOST MEDIA<span className="blink">_</span></h2>
              <p>
                Obras que sobrevivem apenas em registros, fragmentos, referências
                e memórias. Dossiês com fontes institucionais e classificação
                de acesso.
              </p>
              <Link to="/lost-media" onClick={playClick}>
                Explorar arquivos perdidos →
              </Link>
            </div>

            <div className="lost-figure">
              <span>STATUS: ARQUIVO INCOMPLETO</span>
              <span>REGISTROS: {perdidos}</span>
              <span>RECUPERAÇÃO: EM CURSO</span>
              <span>ACESSO: RESTRITO</span>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export { default } from './Home-v3.jsx'
