import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { playClick } from '../utils/audio'
import SoundControl from './SoundControl'
import { LogoLink } from './Logo'
import { useAuth } from '../utils/auth'
export default function Header() {
  const [open,setOpen]=useState(false)
  const [error,setError]=useState('')
  const {currentUser,logout}=useAuth()
  const close=()=>{setOpen(false);playClick()}
  return <><header className="main-header"><LogoLink onClick={close}/><button className="menu-button" onClick={()=>setOpen(value=>!value)} aria-expanded={open}>{open?'FECHAR':'MENU'}</button><nav className={`main-navigation ${open?'open':''}`}>
    <NavLink to="/" end onClick={close}>Início</NavLink><NavLink to="/filmes" onClick={close}>Filmes</NavLink><NavLink to="/series" onClick={close}>Séries</NavLink><NavLink to="/livros" onClick={close}>Livros</NavLink><NavLink to="/pesquisa" onClick={close}>Pesquisa</NavLink><NavLink to="/lost-media" onClick={close}>Lost media</NavLink><NavLink to="/comunidade" onClick={close}>Comunidade</NavLink>{currentUser.role==='admin'&&<NavLink to="/admin-financeiro" onClick={close}>Financeiro</NavLink>}</nav><div className="header-tools">{currentUser.role==='guest'?<Link className="pill-button" to="/entrada">Entrar</Link>:<div className="header-user"><span>{currentUser.username}</span><button className="ghost-button" onClick={async()=>{try{await logout()}catch(e){setError(e.message)}}}>Sair</button></div>}<SoundControl/></div></header>{error&&<p role="alert">{error}</p>}</>
}
