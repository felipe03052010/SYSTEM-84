import assert from 'node:assert/strict'
import { createApp, nextMonth } from '../server/index.mjs'
let clock=Date.UTC(2026,0,31,12)
const env={PUBLIC_ORIGIN:'http://127.0.0.1:5174',CREATOR_INVITE_CODE:'test-creator-code',ADMIN_INVITE_CODE:'test-admin-code',PIX_KEY:'test-key@example.test'}
const app=createApp({dbPath:':memory:',env,now:()=>clock})
await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve))
const base=`http://127.0.0.1:${app.server.address().port}`
async function call(path,data,cookie=''){const response=await fetch(base+path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(data?{body:JSON.stringify(data)}:{})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]}}
try{
 const input={name:'Test Subscriber',email:'subscriber@example.test',password:'test-password-000'}
 assert.equal((await call('/api/access/register',{...input,role:'admin',inviteCode:'wrong'})).status,403)
 const subscriber=await call('/api/access/register',{...input,role:'subscriber'})
 assert.equal(subscriber.status,200);assert.equal(subscriber.data.user.hasAccess,false)
 assert.equal((await call('/api/access/login',{email:input.email,password:'wrong'})).status,401)
 assert.equal((await call('/api/payments/create',{})).status,401)
 const pix=await call('/api/payments/create',{},subscriber.cookie)
 assert.equal(pix.data.amount,15);assert.equal(pix.data.pixKey,env.PIX_KEY)
 assert.equal((await call('/api/payments/create',{},subscriber.cookie)).data.id,pix.data.id)
 assert.equal((await call('/api/payments/report/'+pix.data.id,{payerNote:'Test Sender'},subscriber.cookie)).status,200)
 assert.equal((await call('/api/payments/status/'+pix.data.id,null,subscriber.cookie)).data.user.hasAccess,false,'Reporting payment cannot release access')
 assert.equal((await call('/api/admin/summary',null,subscriber.cookie)).status,403)
 assert.equal((await call(`/api/admin/payments/${pix.data.id}/approve`,{bankReference:'BANK-TEST-0000001',confirmed:true},subscriber.cookie)).status,403)
 const admin=await call('/api/access/register',{name:'Test Admin',email:'admin@example.test',password:'test-password-000',role:'admin',inviteCode:env.ADMIN_INVITE_CODE})
 assert.equal(admin.data.user.hasAccess,true)
 assert.equal((await call(`/api/admin/payments/${pix.data.id}/approve`,{bankReference:'BANK-TEST-0000001',confirmed:false},admin.cookie)).status,400)
 const approved=await call(`/api/admin/payments/${pix.data.id}/approve`,{bankReference:'BANK-TEST-0000001',confirmed:true},admin.cookie)
 assert.equal(approved.data.user.hasAccess,true);assert.equal(approved.data.user.expiresAt,Date.UTC(2026,1,28,12))
 assert.equal((await call(`/api/admin/payments/${pix.data.id}/approve`,{bankReference:'BANK-TEST-0000001',confirmed:true},admin.cookie)).status,200)
 assert.equal((await call('/api/access/me',null,subscriber.cookie)).data.user.expiresAt,approved.data.user.expiresAt)
 const second=await call('/api/payments/create',{},subscriber.cookie)
 await call('/api/payments/report/'+second.data.id,{payerNote:'Test Sender'},subscriber.cookie)
 assert.equal((await call(`/api/admin/payments/${second.data.id}/approve`,{bankReference:'BANK-TEST-0000001',confirmed:true},admin.cookie)).status,409,'A bank transaction cannot be reused')
 const creator=await call('/api/access/register',{name:'Creator',email:'creator@example.test',password:'test-password-000',role:'creator',inviteCode:env.CREATOR_INVITE_CODE})
 assert.equal(creator.data.user.hasAccess,true)
 assert.equal((await call('/api/payments/status/'+pix.data.id,null,creator.cookie)).status,404,'Other users cannot read payment information')
 const summary=await call('/api/admin/summary',null,admin.cookie);assert.equal(summary.data.revenue,15);assert.equal(summary.data.activeSubscribers,1)
 clock=Date.UTC(2026,2,1,12)
 const relogin=await call('/api/access/login',{email:input.email,password:input.password})
 assert.equal(relogin.data.user.hasAccess,false,'Expiration blocks access independently of localStorage')
 const cross=await fetch(base+'/api/access/logout',{method:'POST',headers:{Origin:'https://attacker.test','Content-Type':'application/json',Cookie:relogin.cookie},body:'{}'});assert.equal(cross.status,403)
 assert.equal(nextMonth(Date.UTC(2026,11,31)),Date.UTC(2027,0,31))
 console.log('PASS: invitations, password login, payment ownership, manual bank confirmation, admin authorization, duplicate payment rejection and monthly expiration.')
}finally{await new Promise(resolve=>app.server.close(resolve));app.db.close()}
