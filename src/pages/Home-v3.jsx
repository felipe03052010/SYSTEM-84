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

const wall = [
  {
    id: 'main',
    label: 'SYS84 · TERMINAL',
    className: 'monitor monitor-main',
    screen: 'main',
  },
  {
    id: 'log',
    label: 'LOG DE ARQUIVO',
    className: 'monitor monitor-log',
    screen: 'log',
  },
  {
    id: 'vhs',
    label: 'DECK / VHS',
    className: 'monitor monitor-vhs',
    screen: 'vhs',
  },
]

export default function Home() {
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
  const [active, setActive] = useState('main')
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

          {/* Parede de monitores CRT: a sala do arquivo */}
          <div className="crt-wall" role="group" aria-label="Parede de monitores do arquivo">
            <div className="wall-cables" aria-hidden="true" />

            {wall.map((unit) => (
              <button
                key={unit.id}
                type="button"
                className={`${unit.className} ${active === unit.id ? 'is-active' : ''}`}
                onClick={() => {
                  playClick()
                  setActive(unit.id)
                }}
                aria-pressed={active === unit.id}
              >
                <span className="monitor-shell">
                  <span className="monitor-bezel">
                    <span className="monitor-glass">
                      {unit.screen === 'main' && (
                        <>
                          <span className="glass-head">
                            <span>ARQUIVO_PRINCIPAL.EXE</span>
                            <span className="glass-led">84%</span>
                          </span>

                          <span className="glass-log">
                            <span>&gt; montando banco de memória</span>
                            <span>&gt; verificando registros</span>
                            <span className="glass-ok">&gt; CONEXÃO ESTABELECIDA</span>
                          </span>

                          <span className="glass-title">
                            TERMINAL DE <em>PRESERVAÇÃO</em>
                          </span>
                        </>
                      )}

                      {unit.screen === 'log' && (
                        <>
                          <span className="glass-head">
                            <span>LOG / ARQUIVO</span>
                            <span className="glass-led">REC</span>
                          </span>

                          <span className="glass-log">
                            <span>FILMES ........ {filmes}</span>
                            <span>LIVROS ........ {livros}</span>
                            <span>PERDIDOS ..... {perdidos}</span>
                            <span className="glass-ok">TOTAL ........ {total}</span>
                          </span>
                        </>
                      )}

                      {unit.screen === 'vhs' && (
                        <>
                          <span className="glass-head">
                            <span>DECK / VHS</span>
                            <span className="glass-led">SP</span>
                          </span>

                          <span className="glass-vhs">
                            <span className="vhs-bars" aria-hidden="true" />
                            <span className="vhs-text">PLAY ▶ 00:00:84</span>
                          </span>

                          <span className="glass-log">
                            <span>&gt; sinal encontrado</span>
                            <span className="glass-ok">&gt; fita 84 / lost media</span>
                          </span>
                        </>
                      )}

                      <span className="glass-scan" aria-hidden="true" />
                      <span className="glass-glare" aria-hidden="true" />
                    </span>

                    <span className="monitor-brand">
                      <span>SYSTEM 84</span>
                      <span className="monitor-knobs" aria-hidden="true">
                        <i />
                        <i />
                      </span>
                    </span>
                  </span>

                  <span className="monitor-stand" aria-hidden="true" />
                  <span className="monitor-foot" aria-hidden="true" />
                </span>

                <span className="monitor-label">{unit.label}</span>
              </button>
            ))}

            <form className="wall-console" onSubmit={search}>
              <label htmlFor="homeSearch">&gt; pesquisar no arquivo</label>

              <div className="wall-console-field">
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
