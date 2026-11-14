import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import SoundControl from '../components/SoundControl'
import { useAuth, accessRequest } from '../utils/auth'

const terminals = [
  { id:'creator',channel:'01',title:'Criador',subtitle:'Toda memória começa com alguém.',action:'ACESSO POR CONVITE',className:'terminal-creator' },
  { id:'admin',channel:'02',title:'Administrador',subtitle:'Mantenha o sinal em funcionamento.',action:'ACESSO POR CONVITE',className:'terminal-admin' },
  { id:'subscriber',channel:'03',title:'Assinar o arquivo',subtitle:'R$ 15 / mês · renovação por Pix',action:'ASSINATURA MENSAL',className:'terminal-support' },
]
const monitorImage=`${import.meta.env.BASE_URL}images/crt-monitor.webp`
function Monitor({children,className=''}) {
  return <div className={`photo-monitor ${className}`}><img src={monitorImage} width="1000" height="1000" alt="" draggable="false"/><div className="photo-monitor-screen">{children}</div></div>
}
export default function Entrance({onEnter}) {
  const [selected,setSelected]=useState(null)
  const [mode,setMode]=useState('register')
  const [status,setStatus]=useState('')
  const [busy,setBusy]=useState(false)
  const [payment,setPayment]=useState(null)
  const {currentUser,service,authenticate,refresh,logout}=useAuth()
  const navigate=useNavigate(),location=useLocation()
  const terminal=terminals.find(item=>item.id===selected)
  function enter(){onEnter();const target=location.state?.returnTo;navigate(target&&target.startsWith('/')&&!target.startsWith('//')&&!target.startsWith('/entrada')?target:'/',{replace:true})}
  function select(id){setSelected(id);setStatus('');setPayment(null);setMode('register');window.requestAnimationFrame?.(()=>document.getElementById('access-workbench')?.scrollIntoView?.({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}))}
  async function submit(event){
    event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));setBusy(true);setStatus('')
    try{const user=await authenticate({...data,role:selected},mode);if(user.hasAccess)enter();else{setSelected('subscriber');setStatus('Conta conectada. Consulte a chave Pix para solicitar seu mês de acesso.')}}catch(e){setStatus(e.message)}finally{setBusy(false)}
  }
  async function createPix(){setBusy(true);setStatus('');try{setPayment(await accessRequest('/payments/create',{method:'POST',body:'{}'}))}catch(e){setStatus(e.message)}finally{setBusy(false)}}
  async function checkPix(){setBusy(true);try{const result=await accessRequest(`/payments/status/${encodeURIComponent(payment.id)}`);if(result.user?.hasAccess){await refresh();enter()}else setStatus('Pagamento aguardando conferência do administrador no Nubank. O acesso continua bloqueado.')}catch(e){setStatus(e.message)}finally{setBusy(false)}}
  async function copyPix(){try{await navigator.clipboard.writeText(payment.pixKey);setStatus('Chave Pix copiada. Confira o recebedor no app do banco e envie R$ 15.')}catch{setStatus('Selecione e copie o código Pix abaixo.')}}
  return <main className="entrance-page">
    <header className="entrance-header"><Logo/><span>ACCESS ROOM / 084</span><SoundControl/></header>
    <section className="entrance-heading"><span className="station-kicker"><i className="live-dot"/> TERMINAIS DE ACESSO / ONLINE</span><h1>Há um lugar<br/>para a sua <em>memória.</em></h1><p>Escolha um terminal. Faça parte do arquivo.</p></section>
    <section className="monitor-room" aria-label="Escolha seu terminal de cadastro"><div className="room-grid" aria-hidden="true"/>
      <div className="monitor-options">{terminals.map(item=><button key={item.id} className={`monitor-option ${item.className} ${selected===item.id?'is-selected':''}`} onClick={()=>select(item.id)} aria-label={`Abrir terminal ${item.title}`} aria-pressed={selected===item.id} aria-controls="access-workbench"><Monitor><span className="monitor-channel">SYS84 / CH.{item.channel}</span><span className="monitor-eye" aria-hidden="true">◉</span><strong>{item.title}</strong><span className="monitor-subtitle">{item.subtitle}</span><span className="monitor-cta">{item.action} ↗</span></Monitor><span className="terminal-sticker">{item.channel} / {item.title.toUpperCase()}<i/></span></button>)}</div>
      <div className="room-caption"><span>TRÊS TERMINAIS. UMA SÓ FREQUÊNCIA.</span><span>NO MEMORY LEFT BEHIND.</span></div>
    </section>
    <section id="access-workbench" className="access-workbench" aria-label="Preenchimento de dados">
      {terminal?<><div className="workbench-info"><span className="station-kicker">CANAL {terminal.channel} / CONEXÃO ABERTA</span><h2>{terminal.title}</h2><p>{selected==='subscriber'?'R$ 15 por mês, com pagamento Pix a cada renovação. O acesso é liberado após a conferência manual no Nubank e fica bloqueado quando vencer.':`Recebeu a senha de convite de ${selected==='admin'?'administrador':'criador'}? Use-a no cadastro e escolha uma senha pessoal para entrar depois.`}</p>{!service.ready&&<p className="access-pending">Contas e cobrança em ativação. Nenhum pagamento está sendo cobrado.</p>}<button className="workbench-back" onClick={()=>setSelected(null)}>← FECHAR TERMINAL</button></div>
        <Monitor className={`form-monitor ${terminal.className}`}><div className="monitor-form-heading"><span>CH.{terminal.channel} / {mode==='login'?'LOGIN':'CADASTRO'}</span><strong>{currentUser.role!=='guest'?'Seu acesso ao arquivo.':mode==='login'?'Bem-vindo de volta.':'Seu próximo registro.'}</strong></div>
          {currentUser.role==='guest'?<form className="monitor-form" onSubmit={submit}>
            {mode==='register'&&<label>Nome<input name="name" autoComplete="name" maxLength="80" placeholder="Como podemos chamar você?" required/></label>}
            <label>E-mail<input name="email" type="email" autoComplete="email" maxLength="254" placeholder="voce@exemplo.com" required/></label>
            <label>Senha pessoal<input name="password" type="password" minLength="10" maxLength="128" autoComplete={mode==='login'?'current-password':'new-password'} placeholder="Pelo menos 10 caracteres" required/></label>
            {mode==='register'&&selected!=='subscriber'&&<label>Senha de convite<input name="inviteCode" type="password" autoComplete="off" maxLength="128" placeholder={`Convite de ${selected==='admin'?'administrador':'criador'}`} required/></label>}
            <button className="monitor-submit" type="submit" disabled={busy}>{busy?'CONECTANDO…':mode==='login'?'ENTRAR ↗':'CRIAR CONTA ↗'}</button>
            <button className="monitor-mode" type="button" onClick={()=>{setMode(value=>value==='login'?'register':'login');setStatus('')}}>{mode==='login'?'Primeiro acesso? Criar conta':'Já tem conta? Entrar'}</button>
          </form>:<div className="payment-terminal"><p>{currentUser.username}</p>{currentUser.hasAccess?<><span>{currentUser.expiresAt?`Acesso até ${new Date(currentUser.expiresAt).toLocaleDateString('pt-BR')}`:'Acesso liberado por convite.'}</span><button className="monitor-submit" onClick={enter}>ENTRAR NO ARQUIVO ↗</button></>:<><span className="subscription-price">R$ 15 <small>/ mês</small></span>{payment?<><span>PIX DIRETO / NUBANK</span><label className="pix-key-label">Chave Pix<input aria-label="Chave Pix Nubank" readOnly value={payment.pixKey}/></label><button className="monitor-submit" onClick={copyPix}>COPIAR CHAVE PIX</button><form className="monitor-form" onSubmit={async event=>{event.preventDefault();setBusy(true);try{const data=Object.fromEntries(new FormData(event.currentTarget));const result=await accessRequest(`/payments/report/${encodeURIComponent(payment.id)}`,{method:'POST',body:JSON.stringify(data)});setStatus(result.message)}catch(e){setStatus(e.message)}finally{setBusy(false)}}}><label>Nome de quem enviou o Pix<input name="payerNote" maxLength="200" placeholder="Para o admin conferir no extrato" required/></label><button className="monitor-submit" disabled={busy} type="submit">AVISAR QUE ENVIEI O PIX</button></form><button className="monitor-mode" onClick={checkPix} disabled={busy}>{busy?'CONSULTANDO…':'Consultar liberação do acesso'}</button></>:<button className="monitor-submit" onClick={createPix} disabled={busy||!service.paymentReady}>{busy?'CONSULTANDO…':service.paymentReady?'VER CHAVE PIX / R$ 15 ↗':'PIX EM CONFIGURAÇÃO'}</button>}<small>O administrador confere o Pix no Nubank e libera um mês de acesso.</small></>}<button className="monitor-mode" onClick={async()=>{try{await logout();setPayment(null)}catch(e){setStatus(e.message)}}}>Sair desta conta</button></div>}
          {status&&<p className="terminal-feedback" role="status">{status}</p>}
        </Monitor></>:<p className="choose-terminal"><span>↑</span> SELECIONE UM DOS MONITORES PARA PREENCHER SEUS DADOS.</p>}
    </section>
    <footer className="entrance-footer"><div><span className="live-dot"/> {service.requireSubscription?'ACESSO POR CONVITE OU ASSINATURA':'PRÉVIA DO ARQUIVO / COBRANÇA EM ATIVAÇÃO'}<p>{service.requireSubscription?'Já está conectado? Continue para o acervo.':'Explore o acervo enquanto preparamos o novo acesso.'}</p></div>{(!service.requireSubscription||currentUser.hasAccess)&&<button onClick={enter}>{currentUser.hasAccess?'ENTRAR NO ARQUIVO':'EXPLORAR PRÉVIA DO ACERVO'} <span>↗</span></button>}<span>SYSTEM 84 © 2026<br/>OPTICAL MEMORY SYSTEM</span></footer>
  </main>
}
