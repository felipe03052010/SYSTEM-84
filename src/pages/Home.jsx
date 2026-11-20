import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { Cover } from '../components/ReferenceArt'
import { records } from '../data/records'

const tabs = [['Todos',''],['Filmes','filme'],['Séries','série'],['Livros','livro'],['Analog horror','analog-horror'],['ARG','arg']]
const highlights = [['filme',/nosferatu/i],['filme',/metr[oó]polis/i],['livro',/frankenstein/i],['série',/phantom creeps/i]]
const featured = highlights.map(([type,title])=>records.find(r=>r.type===type && title.test(r.title))).filter(Boolean)
const shortcuts = [['Assistir','/filmes'],['Ler','/livros'],['Descobrir','/pesquisa'],['Preservar','/enviar']]
export default function Home(){
  const [type,setType]=useState('')
  const shelf = type ? records.filter(r=>r.type===type).slice(0,4) : featured
  return <Layout className="s84-home"><section className="s84-section">
    <div className="s84-meta"><small>ARQUIVO CULTURAL INDEPENDENTE / VOL. 084</small><small>▪ SISTEMA ONLINE</small></div>
    <div className="s84-hero"><h1>Memória<br/>fora do<br/>tempo.</h1><div className="s84-hero-intro"><p>Cinema, literatura e fragmentos fora de órbita.<br/>Um arquivo vivo para tudo que merece continuar existindo.</p>
    <Link className="s84-btn" to="/pesquisa">Explorar acervo ↗</Link> <Link className="s84-btn outline" to="/lost-media">Sintonizar lost media</Link></div>
    </div></section>
    <nav className="s84-strip">{shortcuts.map(([label,to])=><Link key={to} to={to}>{label} <span>↗</span></Link>)}</nav>
    <section className="s84-section"><small>01 / ACERVO EM DESTAQUE</small><div className="s84-meta"><h2>Memórias em circulação.</h2><Link to="/pesquisa">Ver todos os registros ↗</Link></div>
    <div className="s84-tabs">{tabs.map(([name,value])=><button key={name} aria-pressed={type===value} onClick={()=>setType(value)}>{name}</button>)}</div>
    <div className="s84-shelf">{shelf.map(record=><Cover key={record.id} record={record}/>)}</div>{!shelf.length && <p>Nenhum registro nesta coleção.</p>}</section>
    <section className="s84-section s84-lost"><div><small>02 / FREQUÊNCIAS PERDIDAS</small><h2>Nem tudo<br/>desaparece<br/>por completo.</h2><p>Rastreie fragmentos. Cruze fontes. Reconstrua a história.</p><Link className="s84-btn" to="/lost-media">Abrir dossiês ↗</Link></div><div aria-hidden="true" className="s84-signal">[ ? ]<small>SINAL NÃO IDENTIFICADO<br/>AGUARDANDO NOVAS PISTAS_</small></div></section>
    <section className="s84-section"><small>03 / CANAL ABERTO</small><h2>Toda memória precisa de alguém.</h2><div className="s84-meta"><p>Compartilhe descobertas, documente pistas e encontre outras pessoas na mesma frequência.</p><Link className="s84-btn" to="/comunidade">Entrar na comunidade ↗</Link></div></section>
  </Layout>
}
