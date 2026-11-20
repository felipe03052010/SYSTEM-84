import {useState} from 'react'
import {Link} from 'react-router-dom'
import {LogoLink} from './Logo'
import {useAuth} from '../utils/auth'
const nav=[['Acervo','/pesquisa'],['Lost media','/lost-media'],['Comunidade','/comunidade'],['Enviar ↑','/enviar']]
export default function Header(){
  const [open,setOpen]=useState(false),[error,setError]=useState('')
  const {currentUser,logout}=useAuth()
  return <header className="s84-header"><LogoLink/><nav>{nav.map(([label,to])=><Link key={to} to={to}>{label}</Link>)}</nav>
    <div className="s84-account"><Link to="/pesquisa">Buscar　/</Link><button aria-expanded={open} onClick={()=>setOpen(!open)}><span className="desktop-label">Minha conta ↗</span><span className="mobile-label">Menu +</span></button></div>
    {open&&<div className="s84-menu">{[...nav,['Filmes','/filmes'],['Séries','/series'],['Livros','/livros'],['Analog horror','/analog-horror'],['ARG','/arg'],['Linha do tempo','/linha-do-tempo'],['Sobre','/sobre'],['Acesso','/entrada']].map(([l,to])=><Link key={to} onClick={()=>setOpen(false)} to={to}>{l}</Link>)}
    {currentUser.role==='admin'&&<Link to="/admin-financeiro">Financeiro</Link>}{currentUser.role!=='guest'&&<button onClick={async()=>{try{await logout();setOpen(false)}catch(e){setError(e.message)}}}>Sair</button>}{error&&<p role="alert">{error}</p>}</div>}</header>
}
