const failure=(status,message)=>Object.assign(new Error(message),{status})
const hex=bytes=>Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('')
const unhex=text=>Uint8Array.from(text.match(/../g)||[],byte=>parseInt(byte,16))
const encoder=new TextEncoder()
const sha=async text=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(text)))
async function equal(a,b){const [x,y]=await Promise.all([sha(String(a)),sha(String(b))]);let diff=0;for(let i=0;i<x.length;i++)diff|=x.charCodeAt(i)^y.charCodeAt(i);return diff===0}
async function passwordHash(password,salt){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:unhex(salt),iterations:100000,hash:'SHA-256'},key,256))}
const randomToken=()=>hex(crypto.getRandomValues(new Uint8Array(32)))
export function nextMonth(timestamp){const date=new Date(timestamp),day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+1);const last=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();date.setUTCDate(Math.min(day,last));return date.getTime()}
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}})
export async function handleApi(request,env,{now=Date.now}={}){
  const url=new URL(request.url),path=url.pathname,db=env.DB
  const query=(sql,...args)=>db.prepare(sql).bind(...args)
  const publicUser=user=>user?{id:user.id,username:user.name,role:user.role,isSubscriber:user.expires_at>now(),expiresAt:user.expires_at||null,subscriptionPlan:user.role==='subscriber'?'Mensal / R$ 15':'Convite',hasAccess:user.role==='creator'||user.role==='admin'||user.expires_at>now()}:null
  async function currentUser(){const token=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)s84_session=([a-f0-9]{64})(?:;|$)/)?.[1];return token?query('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.hash=? AND s.expires_at>?',await sha(token),now()).first():null}
  async function session(user){const token=randomToken();await query('INSERT INTO sessions VALUES(?,?,?)',await sha(token),user.id,now()+7*86400000).run();return json({user:publicUser(user)},200,{'Set-Cookie':`s84_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${url.protocol==='https:'?'; Secure':''}`})}
  async function limit(){const ip=request.headers.get('CF-Connecting-IP')||env.REQUEST_IP||'unknown',window=Math.floor(now()/600000),bucket=await sha(`${ip}:${window}`);await query('DELETE FROM rate_limits WHERE expires_at<?',now()-600000).run();await query('INSERT INTO rate_limits(bucket,hits,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET hits=hits+1',bucket,(window+1)*600000).run();if((await query('SELECT hits FROM rate_limits WHERE bucket=?',bucket).first()).hits>30)throw failure(429,'Muitas tentativas. Aguarde dez minutos.')}
  async function body(){const text=await request.text();if(encoder.encode(text).length>16384)throw failure(413,'Solicitação muito grande.');try{return JSON.parse(text||'{}')}catch{throw failure(400,'Dados inválidos.')}}
  try{
    if(!db)throw failure(503,'Banco de dados ainda não conectado.')
    if(request.method==='POST'){
      const origin=request.headers.get('Origin');if(origin&&origin!==url.origin)throw failure(403,'Origem não permitida.')
      if(!(request.headers.get('Content-Type')||'').includes('application/json'))throw failure(415,'Envie JSON.')
    }
    if(path==='/api/access/config'&&request.method==='GET')return json({ready:true,paymentReady:Boolean(env.PIX_KEY),requireSubscription:true,monthlyPrice:15,paymentMode:'manual-nubank'})
    if(path==='/api/access/me'&&request.method==='GET')return json({user:publicUser(await currentUser())})
    if(path==='/api/access/register'&&request.method==='POST'){
      await limit();const input=await body(),role=input.role
      if(!['creator','admin','subscriber'].includes(role))throw failure(400,'Tipo de acesso inválido.')
      const email=String(input.email||'').trim().toLowerCase(),name=String(input.name||'').trim(),password=String(input.password||'')
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!name||name.length>80||password.length<10||password.length>128)throw failure(400,'Informe nome, e-mail e senha pessoal de 10 a 128 caracteres.')
      if(role!=='subscriber'){const code=env[role==='admin'?'ADMIN_INVITE_CODE':'CREATOR_INVITE_CODE'];if(!code)throw failure(503,'Convites ainda não configurados.');if(!await equal(input.inviteCode||'',code))throw failure(403,'Senha de convite inválida.')}
      if(await query('SELECT id FROM users WHERE email=?',email).first())throw failure(409,'Se já possui uma conta com esse e-mail, entre com sua senha.')
      const salt=randomToken().slice(0,32),hash=await passwordHash(password,salt),id=crypto.randomUUID()
      await query('INSERT INTO users(id,name,email,password,role) VALUES(?,?,?,?,?)',id,name,email,`${salt}:${hash}`,role).run()
      return session(await query('SELECT * FROM users WHERE id=?',id).first())
    }
    if(path==='/api/access/login'&&request.method==='POST'){
      await limit();const input=await body(),password=String(input.password||'');if(password.length>128)throw failure(400,'Dados inválidos.')
      const user=await query('SELECT * FROM users WHERE email=?',String(input.email||'').trim().toLowerCase()).first()
      const [salt,saved]=(user?.password||`${'0'.repeat(32)}:${'0'.repeat(64)}`).split(':')
      const hash=await passwordHash(password,salt);if(!user||!await equal(hash,saved))throw failure(401,'E-mail ou senha incorretos.')
      return session(user)
    }
    if(path==='/api/access/logout'&&request.method==='POST'){
      const token=(request.headers.get('Cookie')||'').match(/s84_session=([a-f0-9]{64})/)?.[1];if(token)await query('DELETE FROM sessions WHERE hash=?',await sha(token)).run()
      return json({success:true},200,{'Set-Cookie':`s84_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${url.protocol==='https:'?'; Secure':''}`})
    }
    if(path==='/api/payments/create'&&request.method==='POST'){
      await limit();const user=await currentUser();if(!user)throw failure(401,'Entre na sua conta para consultar o Pix.');if(user.role!=='subscriber')throw failure(400,'Seu convite já libera acesso.');if(!env.PIX_KEY)throw failure(503,'A chave Pix ainda não foi configurada.')
      let order=await query("SELECT * FROM payments WHERE user_id=? AND status IN ('pending','submitted')",user.id).first()
      if(!order){const ref=crypto.randomUUID();await query('INSERT OR IGNORE INTO payments(ref,user_id,created_at) VALUES(?,?,?)',ref,user.id,now()).run();order=await query("SELECT * FROM payments WHERE user_id=? AND status IN ('pending','submitted')",user.id).first()}
      return json({id:order.ref,pixKey:env.PIX_KEY,amount:15,status:order.status,bank:'Nubank',mode:'manual'})
    }
    if(path.startsWith('/api/payments/report/')&&request.method==='POST'){
      const user=await currentUser();if(!user)throw failure(401,'Entre novamente.');const ref=path.split('/').pop(),input=await body(),note=String(input.payerNote||'').trim()
      if(!note||note.length>200)throw failure(400,'Informe o nome de quem enviou o Pix (até 200 caracteres).')
      const order=await query('SELECT * FROM payments WHERE ref=? AND user_id=?',ref,user.id).first();if(!order)throw failure(404,'Pagamento não encontrado.')
      await query("UPDATE payments SET status='submitted',submitted_at=?,payer_note=? WHERE ref=? AND status='pending'",now(),note,ref).run()
      return json({status:order.status==='approved'?'approved':'submitted',message:'Aviso recebido. O administrador precisa conferir o crédito no Nubank antes de liberar o acesso.'})
    }
    if(path.startsWith('/api/payments/status/')&&request.method==='GET'){
      const user=await currentUser();if(!user)throw failure(401,'Entre novamente.');const order=await query('SELECT status FROM payments WHERE ref=? AND user_id=?',path.split('/').pop(),user.id).first();if(!order)throw failure(404,'Pagamento não encontrado.');return json({status:order.status,user:publicUser(user)})
    }
    if(path==='/api/admin/summary'&&request.method==='GET'){
      const user=await currentUser();if(user?.role!=='admin')throw failure(403,'Acesso administrativo necessário.')
      const approvedPayments=(await query("SELECT COUNT(*) AS count FROM payments WHERE status='approved'").first()).count
      const activeSubscribers=(await query("SELECT COUNT(*) AS count FROM users WHERE role='subscriber' AND expires_at>?",now()).first()).count
      const payments=(await query('SELECT p.ref,p.status,p.created_at,p.payer_note,p.bank_reference,u.name,u.email FROM payments p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC LIMIT 100').all()).results
      return json({revenue:approvedPayments*15,activeSubscribers,approvedPayments,payments})
    }
    const approval=path.match(/^\/api\/admin\/payments\/([a-zA-Z0-9-]+)\/(approve|reject)$/)
    if(approval&&request.method==='POST'){
      const admin=await currentUser();if(admin?.role!=='admin')throw failure(403,'Acesso administrativo necessário.')
      const [,,action]=approval,ref=approval[1],order=await query('SELECT * FROM payments WHERE ref=?',ref).first()
      if(!order)throw failure(404,'Pagamento não encontrado.')
      if(order.status==='approved')return json({success:true,message:'Pagamento já aprovado. Nenhum mês adicional foi concedido.'})
      if(action==='reject'){await query("UPDATE payments SET status='rejected' WHERE ref=? AND status IN ('pending','submitted')",ref).run();return json({success:true})}
      if(order.status!=='submitted')throw failure(400,'O usuário ainda não informou este pagamento.')
      const input=await body(),bankReference=String(input.bankReference||'').trim()
      if(!input.confirmed||bankReference.length<10||bankReference.length>100)throw failure(400,'Confirme o crédito de R$ 15 no app Nubank e informe o identificador único da transação.')
      if(await query('SELECT ref FROM payments WHERE bank_reference=?',bankReference).first())throw failure(409,'Esta transação já foi utilizada. Confira o identificador.')
      const user=await query('SELECT * FROM users WHERE id=?',order.user_id).first(),until=nextMonth(Math.max(now(),user.expires_at)),approvalId=crypto.randomUUID()
      await db.batch([
        query("UPDATE payments SET status='approved',approved_at=?,approved_by=?,bank_reference=?,approval_id=? WHERE ref=? AND status='submitted'",now(),admin.id,bankReference,approvalId,ref),
        query('UPDATE users SET expires_at=? WHERE id=? AND EXISTS(SELECT 1 FROM payments WHERE ref=? AND approval_id=?)',until,user.id,ref,approvalId),
      ])
      return json({success:true,user:publicUser(await query('SELECT * FROM users WHERE id=?',user.id).first())})
    }
    throw failure(404,'Endpoint não encontrado.')
  }catch(e){return json({error:e.status?e.message:'Não foi possível concluir a operação. Tente novamente.'},e.status||500)}
}
export async function allowedMedia(request,env,options){const response=await handleApi(new Request(new URL('/api/access/me',request.url),{headers:request.headers}),env,options);if(!response.ok)return false;return Boolean((await response.json()).user?.hasAccess)}
