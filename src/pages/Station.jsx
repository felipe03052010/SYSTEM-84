import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { records } from '../data/records'

const channels = [
  { title: 'Filmes', type: 'filme', path: '/filmes', note: 'Imagens que resistem ao tempo.', mark: '▶' },
  { title: 'Séries', type: 'série', path: '/series', note: 'A transmissão ainda não terminou.', mark: '▤' },
  { title: 'Livros', type: 'livro', path: '/livros', note: 'Memórias entre uma página e outra.', mark: '▥' },
  { title: 'Lost media', type: 'lost-media', path: '/lost-media', note: 'Nem tudo que desaparece deixa de existir.', mark: '◉' },
  { title: 'Comunidade', path: '/comunidade', note: 'Toda memória precisa de alguém.', mark: '⌘' },
]

function SignalEye() {
  return <svg className="signal-eye" viewBox="0 0 640 300" fill="none" aria-hidden="true">
    <defs><pattern id="signal-grid" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" stroke="currentColor" strokeWidth=".4" opacity=".3" /></pattern></defs>
    <rect width="640" height="300" fill="url(#signal-grid)" />
    <g className="eye-orbits" stroke="currentColor" opacity=".35">
      <ellipse cx="320" cy="150" rx="132" ry="132" /><ellipse cx="320" cy="150" rx="96" ry="132" /><ellipse cx="320" cy="150" rx="44" ry="132" />
      {[64, 106, 150, 194, 236].map(y => <ellipse key={y} cx="320" cy={y} rx={Math.sqrt(132 ** 2 - (y - 150) ** 2)} ry="15" />)}
      <path d="M30 150H610M320 5V295" />
    </g>
    <path d="M45 150Q320 -65 595 150Q320 365 45 150Z" fill="#071710" stroke="currentColor" strokeWidth="2" />
    <path d="M60 151Q320 -26 580 151M60 151Q320 326 580 151" stroke="currentColor" opacity=".4" />
    <g className="eye-iris" stroke="currentColor">
      <circle cx="320" cy="150" r="89" /><circle cx="320" cy="150" r="79" strokeDasharray="1 4" strokeWidth="10" />
      <circle cx="320" cy="150" r="61" /><circle cx="320" cy="150" r="48" strokeDasharray="1 3" strokeWidth="20" />
      <circle cx="320" cy="150" r="33" fill="#030906" /><circle cx="337" cy="130" r="9" fill="currentColor" stroke="none" />
    </g>
    <g stroke="currentColor"><path d="M20 40V20H45M595 20H620V40M20 260V280H45M595 280H620V260" /><path d="M300 150H310M330 150H340M320 130V140M320 160V170" /></g>
    <g fill="currentColor" fontFamily="monospace" fontSize="9"><text x="30" y="55">OPTICAL MEMORY</text><text x="500" y="55">SYS.84 / LIVE</text><text x="30" y="260">NO SIGNAL IS EVER LOST</text><text x="522" y="260">REC ● 0084</text></g>
  </svg>
}

export default function Station() {
  const [channel, setChannel] = useState(0)
  const [power, setPower] = useState(true)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const selected = channels[channel]
  const move = delta => setChannel(value => (value + delta + channels.length) % channels.length)

  useEffect(() => {
    const handle = event => {
      if (event.target.closest?.('input, textarea, select, button, a, [contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey) return
      if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(event.key) && power) {
        event.preventDefault()
        setChannel(value => (value + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + channels.length) % channels.length)
      }
      if (event.key === 'Enter') { event.preventDefault(); if (power) navigate(channels[channel].path); else setPower(true) }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [channel, power, navigate])

  function search(event) {
    event.preventDefault()
    if (query.trim()) navigate(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  return <Layout className="station-page">
    <section className="station-intro">
      <div className="station-kicker"><span className="live-dot" /> ARQUIVO DE MEMÓRIA CULTURAL <span>SYS. 84 / VOL. 01</span></div>
      <div className="station-title"><h1>O tempo passa.<br />O sinal <em>fica.</em></h1><p>Filmes, livros e fragmentos que merecem continuar existindo. Sintonize uma frequência. Encontre algo que o tempo quase levou.</p></div>
    </section>

    <section className="station-stage" aria-label="Terminal interativo do acervo">
      <div className="stage-coordinate" aria-hidden="true">S84—001<br />MEMORY<br />RECEIVER</div>
      <div className={`receiver ${power ? 'is-on' : 'is-off'}`}>
        <div className="receiver-top"><span>SYS / 84</span><span>PERSONAL ARCHIVE SYSTEM</span><span>◎</span></div>
        <div className="receiver-body">
          <div className="receiver-bezel">
            <div className="receiver-screen">
              {power ? <>
                <div className="screen-status"><span>● SINAL ESTABELECIDO</span><span>CH / 0{channel + 1}</span></div>
                <SignalEye />
                <div className="screen-channel" aria-live="polite"><span>0{channel + 1} / DIRETÓRIO</span><h2>{selected.title}</h2><p>{selected.note}</p></div>
                <div className="screen-menu" aria-label="Selecionar diretório">{channels.map((item, i) => <button key={item.path} type="button" onClick={() => setChannel(i)} aria-pressed={channel === i} aria-label={`Canal ${i + 1}: ${item.title}`}>{String(i + 1).padStart(2, '0')}<span>{item.title}</span></button>)}</div>
                <Link className="screen-enter" to={selected.path}>ABRIR {selected.title.toUpperCase()} <span>ENTER ↵</span></Link>
              </> : <div className="screen-standby"><span>84</span><p>O ARQUIVO ESTÁ EM REPOUSO</p><button onClick={() => setPower(true)}>LIGAR TERMINAL ↗</button></div>}
            </div>
          </div>
          <div className="receiver-panel">
            <span className="hardware-label">TUNING / CH.</span>
            <div className="tuning-controls"><button type="button" onClick={() => move(-1)} disabled={!power} aria-label="Diretório anterior">−</button><span>0{channel + 1}</span><button type="button" onClick={() => move(1)} disabled={!power} aria-label="Próximo diretório">+</button></div>
            <div className="speaker-grille" aria-hidden="true" />
            <div className="receiver-seal" aria-hidden="true">84<span>MEMORY<br />PRESERVATION</span></div>
            <button className="receiver-power" type="button" onClick={() => setPower(value => !value)} aria-pressed={power} aria-label={power ? 'Desligar terminal' : 'Ligar terminal'}><i /> POWER</button>
          </div>
        </div>
        <div className="receiver-bottom"><span>ANALOG SOUL. DIGITAL MEMORY.</span><span>STEREO ▰▰▰</span><span>MODEL S84—CRT</span></div>
      </div>
      <div className="stage-caption"><span>↑ ↓ ESCOLHER CANAL <b>↵ ABRIR DIRETÓRIO</b></span><span>SEM PRAZO DE VALIDADE.</span></div>
    </section>

    <section className="station-index">
      <div className="index-heading"><div><span className="station-kicker">01 / EXPLORAR</span><h2>Uma coleção contra<br />o esquecimento.</h2></div><span>{String(records.length).padStart(3, '0')} REGISTROS<br /><i className="live-dot" /> ACERVO ONLINE</span></div>
      <form className="station-search" onSubmit={search}><label htmlFor="station-query">⌕ <span>BUSCAR NO ARQUIVO</span></label><input id="station-query" aria-label="Buscar no arquivo por título, autor ou ano" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Título, autor ou ano…" /><button type="submit" aria-label="Pesquisar no acervo">↗</button></form>
      <div className="station-directories">{channels.map((item, i) => <Link key={item.path} to={item.path}><span className="index-number">0{i + 1}</span><span className="index-symbol" aria-hidden="true">{item.mark}</span><strong>{item.title}</strong><span className="index-note">{item.note}</span><span className="index-count">{item.type ? `${String(records.filter(record => record.type === item.type).length).padStart(2, '0')} REGISTROS` : 'MURAL ABERTO'}</span><span className="index-arrow">↗</span></Link>)}</div>
    </section>
    <section className="station-transmission"><span>02 / FREQUÊNCIA PERDIDA</span><div><h2>Você também<br />se lembra disso?</h2><p>Uma cena. Um ruído. Uma fita sem nome.<br />Investigue as histórias por trás dos arquivos perdidos.</p><Link to="/lost-media">SINTONIZAR LOST MEDIA ↗</Link></div><span className="transmission-orb" aria-hidden="true">◎</span></section>
  </Layout>
}
