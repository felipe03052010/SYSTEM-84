import { useState } from 'react'
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

export default function Station() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function search(event) {
    event.preventDefault()
    if (query.trim()) navigate(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  return <Layout className="station-page">
    <section className="station-intro">
      <div className="station-kicker"><span className="live-dot" /> ARQUIVO DE MEMÓRIA CULTURAL <span>SYS. 84 / VOL. 01</span></div>
      <div className="station-title"><h1>O tempo passa.<br />O sinal <em>fica.</em></h1><p>Filmes, livros e fragmentos que merecem continuar existindo. Explore o arquivo. Encontre algo que o tempo quase levou.</p></div>
    </section>

    <section className="station-index">
      <div className="index-heading"><div><span className="station-kicker">01 / EXPLORAR</span><h2>Uma coleção contra<br />o esquecimento.</h2></div><span>{String(records.length).padStart(3, '0')} REGISTROS<br /><i className="live-dot" /> ACERVO ONLINE</span></div>
      <form className="station-search" onSubmit={search}><label htmlFor="station-query">⌕ <span>BUSCAR NO ARQUIVO</span></label><input id="station-query" aria-label="Buscar no arquivo por título, autor ou ano" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Título, autor ou ano…" /><button type="submit" aria-label="Pesquisar no acervo">↗</button></form>
      <div className="station-directories">{channels.map((item, i) => <Link key={item.path} to={item.path}><span className="index-number">0{i + 1}</span><span className="index-symbol" aria-hidden="true">{item.mark}</span><strong>{item.title}</strong><span className="index-note">{item.note}</span><span className="index-count">{item.type ? `${String(records.filter(record => record.type === item.type).length).padStart(2, '0')} REGISTROS` : 'MURAL ABERTO'}</span><span className="index-arrow">↗</span></Link>)}</div>
    </section>
    <section className="station-transmission"><span>02 / FREQUÊNCIA PERDIDA</span><div><h2>Você também<br />se lembra disso?</h2><p>Uma cena. Um ruído. Uma fita sem nome.<br />Investigue as histórias por trás dos arquivos perdidos.</p><Link to="/lost-media">SINTONIZAR LOST MEDIA ↗</Link></div><span className="transmission-orb" aria-hidden="true">◎</span></section>
  </Layout>
}
