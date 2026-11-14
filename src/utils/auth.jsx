import { createContext, useContext, useState, useEffect, useCallback } from 'react'
const paidBuild=import.meta.env?.VITE_ACCESS_MODE==='paid'
const AuthContext=createContext(null)
const guest={id:'usr_guest',username:'Visitante',role:'guest',isSubscriber:false,hasAccess:false,subscriptionPlan:'Sem assinatura'}
export async function accessRequest(path, options={}) {
  const response=await fetch(`/api${path}`,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers}})
  if (!(response.headers.get('content-type')||'').includes('application/json')) throw new Error('O serviço de contas ainda não está conectado. Tente novamente após a ativação.')
  const body=await response.json()
  if (!response.ok) throw new Error(body.error || 'Não foi possível concluir a solicitação.')
  return body
}
export function AuthProvider({children}) {
  const [currentUser,setCurrentUser]=useState(guest)
  const [service,setService]=useState({loading:true,ready:false,paymentReady:false,requireSubscription:paidBuild})
  const refresh=useCallback(async()=>{
    try { const data=await accessRequest('/access/me');setCurrentUser(data.user || guest);return data.user }
    catch { setCurrentUser(guest);return null }
  },[])
  useEffect(()=>{
    let active=true
    accessRequest('/access/config').then(data=>{if(active)setService({...data,loading:false})}).catch(()=>{if(active)setService({loading:false,ready:false,paymentReady:false,requireSubscription:paidBuild})})
    refresh()
    const interval=setInterval(refresh,30000)
    const focus=()=>refresh()
    window.addEventListener('focus',focus)
    return()=>{active=false;clearInterval(interval);window.removeEventListener('focus',focus)}
  },[refresh])
  async function authenticate(data,mode='register') {
    const result=await accessRequest(`/access/${mode}`,{method:'POST',body:JSON.stringify(data)})
    setCurrentUser(result.user);return result.user
  }
  async function logout(){try{await accessRequest('/access/logout',{method:'POST',body:'{}'});setCurrentUser(guest)}catch{throw new Error('Não foi possível sair. Tente novamente.')}}
  return <AuthContext.Provider value={{currentUser,service,authenticate,refresh,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext)
