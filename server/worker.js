import { handleApi, allowedMedia } from './api.js'
import assets from 'site-assets'
export default {async fetch(request,env){
 const url=new URL(request.url)
 if(url.pathname.startsWith('/api/'))return handleApi(request,env)
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405})
 if(url.pathname.startsWith('/media/')){
  if(!await allowedMedia(request,env))return Response.json({error:'Assinatura necessária ou vencida.'},{status:402,headers:{'Cache-Control':'no-store'}})
  if(!/^\/media\/[a-zA-Z0-9/_.-]+$/.test(url.pathname)||url.pathname.includes('..'))return new Response('Not found',{status:404})
  const headers={"Accept-Encoding":"identity"};if(request.headers.get('Range')&&!url.pathname.endsWith('.txt'))headers.Range=request.headers.get('Range')
  const response=await fetch(`https://felipe03052010.github.io/SYSTEM-84${url.pathname}`,{headers})
  const outgoing=new Headers(response.headers);outgoing.set('Cache-Control','private, no-store');outgoing.delete('set-cookie')
  return new Response(request.method==='HEAD'?null:response.body,{status:response.status,headers:outgoing})
 }
 const asset=assets[url.pathname==='/'?'/index.html':url.pathname]
 if(!asset)return new Response('Not found',{status:404})
 return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(asset.body),char=>char.charCodeAt(0)),{headers:{'Content-Type':asset.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY'}})
}}
