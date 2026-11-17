import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, readFileSync, existsSync, statSync, createReadStream } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleApi, allowedMedia, nextMonth } from './api.js'
export { nextMonth }
export function sqliteBinding(db){
  function prepare(sql){let args=[];const wrapper={bind(...values){args=values;return wrapper},first(){return db.prepare(sql).get(...args)||null},all(){return {results:db.prepare(sql).all(...args)}},run(){const r=db.prepare(sql).run(...args);return {meta:{changes:r.changes}}},execute(){return wrapper.run()}};return wrapper}
  return {prepare,batch(statements){db.exec('BEGIN IMMEDIATE');try{const result=statements.map(stmt=>stmt.execute());db.exec('COMMIT');return result}catch(e){db.exec('ROLLBACK');throw e}}}
}
export function createApp({dbPath='server/data/access.sqlite',distPath='dist',env=process.env,now=Date.now}={}){
  if(dbPath!==':memory:')mkdirSync(resolve(dbPath,'..'),{recursive:true})
  const db=new DatabaseSync(dbPath);db.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;')
  const hasSchema=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get()
  if(!hasSchema)db.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8').replaceAll('--> statement-breakpoint',''))
  const binding=sqliteBinding(db),dist=resolve(distPath)
  const server=createServer(async(req,res)=>{
    const origin=env.PUBLIC_ORIGIN||`http://${req.headers.host}`,url=new URL(req.url,origin)
    const headers=new Headers();for(const [key,value]of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(', '):value)
    try{
      let data
      if(req.method!=='GET'&&req.method!=='HEAD'){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>16384){res.writeHead(413);res.end();return}chunks.push(chunk)}data=Buffer.concat(chunks)}
      const request=new Request(url,{method:req.method,headers,...(data?{body:data}:{})}),runtime={...env,DB:binding,REQUEST_IP:req.socket.remoteAddress}
      if(url.pathname.startsWith('/api/')){const response=await handleApi(request,runtime,{now});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return}
      const decoded=decodeURIComponent(url.pathname),file=resolve(dist,`.${decoded==='/'?'/index.html':decoded}`)
      if(!['GET','HEAD'].includes(req.method)||!file.startsWith(dist+sep)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
      if(decoded.startsWith('/media/')&&!await allowedMedia(request,runtime,{now})){res.writeHead(402,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Assinatura necessária ou vencida.'}));return}
      const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.json':'application/json','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8'}[extname(file)]||'application/octet-stream',size=statSync(file).size
      res.setHeader('Content-Type',mime);res.setHeader('Cache-Control',decoded.startsWith('/media/')?'private, no-store':'no-cache');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Accept-Ranges','bytes')
      const range=req.headers.range
      if(range){const match=range.match(/^bytes=(\d+)-(\d*)$/),start=Number(match?.[1]),end=match?.[2]?Math.min(Number(match[2]),size-1):size-1;if(!match||start>end||start>=size){res.writeHead(416);res.end();return}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});if(req.method==='HEAD')res.end();else createReadStream(file,{start,end}).pipe(res);return}
      res.writeHead(200,{'Content-Length':size});if(req.method==='HEAD')res.end();else createReadStream(file).pipe(res)
    }catch{if(!res.headersSent)res.writeHead(500);res.end('Internal error')}
  })
  return {server,db}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const app=createApp(),port=Number(process.env.PORT||5174);app.server.listen(port,process.env.HOST||'127.0.0.1',()=>console.log(`SYSTEM 84 server: http://127.0.0.1:${port}`))}
