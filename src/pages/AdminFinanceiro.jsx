import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth, accessRequest } from '../utils/auth'
import { DossierMasthead, DossierFooter } from '../components/Chassis'
import '../styles/dossie.css'

function AdminFrame({children}) {
  return <Layout className="dossie-page admin-dossier"><div className="dossier-frame"><DossierMasthead/>{children}<DossierFooter page={13} total={13} title="ADMINISTRAÇÃO — SYSTEM 84"/></div></Layout>
}
export default function AdminFinanceiro(){
  const {currentUser}=useAuth()
  const [summary,setSummary]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState('')
  async function load(){setSummary(await accessRequest('/admin/summary'))}
  useEffect(()=>{let active=true;if(currentUser.role==='admin')accessRequest('/admin/summary').then(data=>{if(active)setSummary(data)}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[currentUser.role])
  async function approve(event,item){event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));setBusy(item.ref);setError('');try{await accessRequest(`/admin/payments/${item.ref}/approve`,{method:'POST',body:JSON.stringify({bankReference:data.bankReference,confirmed:data.confirmed==='on'})});await load()}catch(e){setError(e.message)}finally{setBusy('')}}
  if(currentUser.role!=='admin')return <AdminFrame><section className="archive-header"><span className="directory">ACESSO RESTRITO</span><h1>Acesso administrativo</h1><p>Entre com uma conta de administrador para consultar pagamentos.</p><Link to="/entrada">Abrir terminal de acesso ↗</Link></section></AdminFrame>
  return <AdminFrame><section className="archive-header"><span className="directory">ADMIN / PIX NUBANK</span><h1>Painel do arquivo</h1><p>Confira aqui os pagamentos Pix manuais que ainda precisam de conferência. Pagamentos aprovados pelo Mercado Pago usam confirmação automática pelo servidor.</p></section><section className="finance-content">{error&&<p role="alert">{error}</p>}{!summary?<p role="status">Carregando dados…</p>:<><div className="finance-metrics"><article><span>RECEITA APROVADA</span><strong>{summary.revenue.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></article><article><span>ASSINATURAS ATIVAS</span><strong>{summary.activeSubscribers}</strong></article><article><span>PAGAMENTOS CONFERIDOS</span><strong>{summary.approvedPayments}</strong></article></div><h2>Conferir pagamentos</h2><p>O aviso do assinante não comprova o crédito. Use o identificador da transação do extrato, que só pode ser utilizado uma vez.</p><div className="approval-list">{summary.payments.filter(item=>item.status==='submitted').map(item=><article key={item.ref}><h3>{item.name}</h3><p>{item.email} · R$ 15,00<br/>Quem enviou: {item.payer_note}</p><form onSubmit={event=>approve(event,item)}><label>Identificador da transação no Nubank<input name="bankReference" minLength="10" maxLength="100" required placeholder="Copie o identificador do extrato"/></label><label className="approval-check"><input name="confirmed" type="checkbox" required/> Conferi o crédito de R$ 15 no Nubank.</label><button className="monitor-submit" disabled={Boolean(busy)}>{busy===item.ref?'LIBERANDO…':'APROVAR E LIBERAR UM MÊS'}</button></form></article>)}</div><h2>Histórico</h2><div className="finance-table"><table><thead><tr><th>Conta</th><th>Estado</th><th>Data</th><th>Valor</th></tr></thead><tbody>{summary.payments.map(item=><tr key={item.ref}><td>{item.name}</td><td>{item.status}</td><td>{new Date(item.created_at).toLocaleDateString('pt-BR')}</td><td>R$ 15,00</td></tr>)}</tbody></table>{!summary.payments.length&&<p>Nenhum pagamento registrado.</p>}</div></>}</section><AdminSubmissions/></AdminFrame>
}

function AdminSubmissions(){
  const [items,setItems]=useState([]),[error,setError]=useState(''),[busy,setBusy]=useState('')
  async function load(){try{const data=await accessRequest('/admin/submissions');setItems(data.submissions||[])}catch(e){setError(e.message)}}
  useEffect(()=>{load()},[])
  async function review(id,action){setBusy(id);setError('');try{await accessRequest(`/admin/submissions/${id}/${action}`,{method:'POST',body:'{}'});await load()}catch(e){setError(e.message)}finally{setBusy('')}}
  const pending=items.filter(i=>i.status==='pending')
  const done=items.filter(i=>i.status!=='pending')
  return <section className="finance-content"><h2>Envios da comunidade</h2><p>Aprove para o item entrar no catálogo com ficha e marca própria; recuse para arquivar a submissão.</p>{error&&<p role="alert">{error}</p>}<div className="approval-list">{pending.map(item=><article key={item.id}><h3>{item.title}</h3><p>{item.author_name} · {item.type} · {item.year}<br/>{item.description.slice(0,180)}{item.description.length>180?'…':''}</p><div className="compose-foot"><button className="monitor-submit" disabled={busy===item.id} onClick={()=>review(item.id,'approve')}>{busy===item.id?'PROCESSANDO…':'APROVAR E PUBLICAR'}</button><button className="monitor-mode" disabled={busy===item.id} onClick={()=>review(item.id,'reject')}>RECUSAR</button></div></article>)}{!pending.length&&<p>Nenhum envio aguardando análise.</p>}</div>{done.length>0&&<><h2>Histórico de envios</h2><div className="finance-table"><table><thead><tr><th>Obra</th><th>Autor</th><th>Status</th><th>Data</th></tr></thead><tbody>{done.slice(0,50).map(item=><tr key={item.id}><td>{item.title}</td><td>{item.author_name}</td><td>{item.status}</td><td>{new Date(item.created_at).toLocaleDateString('pt-BR')}</td></tr>)}</tbody></table></div></>}</section>
}
