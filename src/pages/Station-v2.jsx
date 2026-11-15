import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import SoundControl from '../components/SoundControl'
import { records } from '../data/records'
import { playTyping, playClick } from '../utils/audio'
import { powerSwitch, tapeRewind } from '../utils/retro-sounds'
import '../styles/station-v2.css'

/**
 * A porta de entrada do arquivo: uma parede de monitores CRT sobre a mesa,
 * com a pesquisa embutida no console. Daqui se entra em todos os diretórios.
 */
const units = [
  { id: 'main', label: 'SYS84 · TERMINAL', className: 'monitor monitor-main', screen: 'main' },
  { id: 'tower', label: 'MONITOR 02 / DESLIGADO', className: 'monitor monitor-tower monitor-off', screen: 'off' },
  { id: 'log', label: 'LOG DE ARQUIVO', className: 'monitor monitor-log', screen: 'log' },
  { id: 'vhs', label: 'DECK / VHS', className: 'monitor monitor-vhs', screen: 'vhs' },
]

const directories = [
  { to: '/filmes', index: '[01] DIR', title: 'FILMES', text: 'Expressionismo, ficção científica e cinema mudo preservados em cópia de acervo.', action: '> abrir diretório', type: 'filme' },
  { to: '/series', index: '[02] DIR', title: 'SÉRIES', text: 'Seriados históricos, capítulos recuperados e transmissões interrompidas.', action: '> abrir diretório', type: 'série' },
  { to: '/livros', index: '[03] DIR', title: 'LIVROS', text: 'Textos integrais de domínio público, com leitor interno e progresso salvo.', action: '> abrir diretório', type: 'livro' },
  { to: '/lost-media', index: '[04] VHS', title: 'LOST MEDIA', text: 'Dossiês de obras que sobrevivem só em fragmentos, registros e memória.', action: '> abrir dossiês', type: 'lost-media' },
  { to: '/comunidade', index: '[05] BBS', title: 'COMUNIDADE', text: 'Mural de registros enviados por quem também mantém o arquivo vivo.', action: '> entrar no mural' },
]

const count = (type) => records.filter((record) => record.type === type).length
const total = records.length

export default function StationV2() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('main')
  const navigate = useNavigate()

  function search(event) {
    event.preventDefault()
    playClick()
    if (!query.trim()) return
    navigate(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <Layout className="station-page">
      <section className="station-intro">
        <div className="station-kicker">
          <span className="live-dot" /> ARQUIVO DE MEMÓRIA CULTURAL <span>SYS. 84 / VOL. 01</span>
        </div>

        <div className="station-title">
          <h1>
            O tempo passa.<br />O sinal <em>fica.</em>
          </h1>
          <p>
            Filmes, livros e fragmentos que merecem continuar existindo. Explore o arquivo.
            Encontre algo que o tempo quase levou.
          </p>
        </div>

        <div className="station-stats">
          <span><strong>{String(total).padStart(3, '0')}</strong> registros</span>
          <span><strong>{count('filme')}</strong> filmes</span>
          <span><strong>{count('livro')}</strong> livros</span>
          <span><strong>{count('lost-media')}</strong> perdidos</span>
        </div>
      </section>

      <section className="station-index">
        <div className="index-heading">
          <div>
            <span className="station-kicker">01 / EXPLORAR</span>
            <h2>Uma coleção contra<br />o esquecimento.</h2>
          </div>
          <span>{String(total).padStart(3, '0')} REGISTROS<br /><i className="live-dot" /> ACERVO ONLINE</span>
        </div>

        {/* Parede de monitores */}
        <div className="crt-wall" role="group" aria-label="Parede de monitores do arquivo">
          <div className="wall-cables" aria-hidden="true" />
          <span className="wall-lamp" aria-hidden="true" />
          <span className="wall-dust" aria-hidden="true" />

          {units.map((unit) => (
            <button
              key={unit.id}
              type="button"
              className={`${unit.className} ${active === unit.id ? 'is-active' : ''}`}
              onClick={() => {
                if (unit.id === 'vhs') tapeRewind()
                else powerSwitch()
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
                        <span className="glass-title">TERMINAL DE <em>PRESERVAÇÃO</em></span>
                      </>
                    )}

                    {unit.screen === 'off' && (
                      <span className="glass-off"><span>SEM SINAL</span></span>
                    )}

                    {unit.screen === 'log' && (
                      <>
                        <span className="glass-head">
                          <span>LOG / ARQUIVO</span>
                          <span className="glass-led">REC</span>
                        </span>
                        <span className="glass-log">
                          <span>FILMES ........ {count('filme')}</span>
                          <span>LIVROS ........ {count('livro')}</span>
                          <span>PERDIDOS ..... {count('lost-media')}</span>
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
                    <span className="monitor-knobs" aria-hidden="true"><i /><i /></span>
                  </span>
                </span>

                <span className="monitor-stand" aria-hidden="true" />
                <span className="monitor-foot" aria-hidden="true" />
              </span>

              <span className="monitor-label">{unit.label}</span>
            </button>
          ))}

          <form className="wall-console station-directories" onSubmit={search}>
            <label htmlFor="station-query">&gt; pesquisar no arquivo</label>
            <div className="wall-console-row">
              <div className="wall-console-field">
                <span>&gt;</span>
                <input
                  id="station-query"
                  aria-label="Buscar no arquivo por título, autor ou ano"
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
              <SoundControl />
            </div>
          </form>
        </div>

        <div className="station-directory-grid">
          {directories.map((item) => (
            <Link key={item.to} to={item.to} onClick={playClick}>
              <span className="index-number">{item.index}</span>
              <strong>{item.title}</strong>
              <span className="index-note">{item.text}</span>
              <span className="index-count">
                {item.type ? `${String(count(item.type)).padStart(2, '0')} REGISTROS` : 'MURAL ABERTO'}
              </span>
              <span className="index-arrow">{item.action}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="station-transmission">
        <span>02 / FREQUÊNCIA PERDIDA</span>
        <div>
          <h2>Você também<br />se lembra disso?</h2>
          <p>Uma cena. Um ruído. Uma fita sem nome.<br />Investigue as histórias por trás dos arquivos perdidos.</p>
          <Link to="/lost-media">SINTONIZAR LOST MEDIA ↗</Link>
        </div>
        <span className="transmission-orb" aria-hidden="true">◎</span>
      </section>
    </Layout>
  )
}
