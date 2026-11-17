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
const schemaDone=new WeakSet()
export async function handleApi(request,env,{now=Date.now}={}){
  const url=new URL(request.url),path=url.pathname,db=env.DB
  const query=(sql,...args)=>db.prepare(sql).bind(...args)
  async function ensureSchema(){
    if(schemaDone.has(db))return
    await query(`CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      year INTEGER,
      author TEXT,
      author_name TEXT,
      description TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      sources TEXT NOT NULL DEFAULT '[]',
      article TEXT,
      media_url TEXT,
      media_kind TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at INTEGER NOT NULL,
      reviewed_at INTEGER,
      reviewer_id TEXT
    )`).run()
    for(const column of ['mp_preference_id TEXT','mp_init_point TEXT','mp_payment_id TEXT','payment_provider TEXT']){
      try{await query(`ALTER TABLE payments ADD COLUMN ${column}`).run()}
      catch(error){if(!/duplicate column name/i.test(String(error?.message||error)))throw error}
    }
    await query(`CREATE TABLE IF NOT EXISTS subscriptions (
      preapproval_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      amount REAL,
      init_point TEXT,
      granted_quantity INTEGER NOT NULL DEFAULT 0,
      next_payment_date TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER
    )`).run()
    await query('CREATE INDEX IF NOT EXISTS subscriptions_user ON subscriptions(user_id)').run()
    schemaDone.add(db)
  }
  const publicUser=user=>user?{id:user.id,username:user.name,role:user.role,isSubscriber:user.expires_at>now(),expiresAt:user.expires_at||null,subscriptionPlan:user.role==='subscriber'?'Mensal / R$ 15':'Convite',hasAccess:user.role==='creator'||user.role==='admin'||user.expires_at>now()}:null
  async function currentUser(){const token=(request.headers.get('Cookie')||'').match(/(?:^|;\s*)s84_session=([a-f0-9]{64})(?:;|$)/)?.[1];return token?query('SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.hash=? AND s.expires_at>?',await sha(token),now()).first():null}
  async function session(user){const token=randomToken();await query('INSERT INTO sessions VALUES(?,?,?)',await sha(token),user.id,now()+7*86400000).run();return json({user:publicUser(user)},200,{'Set-Cookie':`s84_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${url.protocol==='https:'?'; Secure':''}`})}
  async function limit(){const ip=request.headers.get('CF-Connecting-IP')||env.REQUEST_IP||'unknown',window=Math.floor(now()/600000),bucket=await sha(`${ip}:${window}`);await query('DELETE FROM rate_limits WHERE expires_at<?',now()-600000).run();await query('INSERT INTO rate_limits(bucket,hits,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET hits=hits+1',bucket,(window+1)*600000).run();if((await query('SELECT hits FROM rate_limits WHERE bucket=?',bucket).first()).hits>30)throw failure(429,'Muitas tentativas. Aguarde dez minutos.')}
  async function body(){const text=await request.text();if(encoder.encode(text).length>65536)throw failure(413,'Solicitação muito grande.');try{return JSON.parse(text||'{}')}catch{throw failure(400,'Dados inválidos.')}}

  const mpPrice=()=>Number(env.MP_PRICE)||15
  async function mp(method,endpoint,payload,idempotencyKey){
    const response=await fetch('https://api.mercadopago.com'+endpoint,{method,headers:{Authorization:`Bearer ${env.MP_ACCESS_TOKEN}`,'Content-Type':'application/json',...(idempotencyKey?{'X-Idempotency-Key':idempotencyKey}:{})},...(payload?{body:JSON.stringify(payload)}:{})})
    const data=await response.json().catch(()=>({}))
    if(!response.ok)throw failure(502,'O Mercado Pago não aceitou a solicitação. Tente novamente em instantes.')
    return data
  }
  /* Concilia a assinatura local com o Mercado Pago. Cada cobrança concluída
     (summarized.charged_quantity) vira exatamente um mês de acesso; o contador
     granted_quantity e a referência única mp-sub-<id>-<n> tornam o processo
     idempotente, mesmo com webhook repetido ou concorrente. */
  async function reconcileSubscription(sub){
    const remote=await mp('GET','/preapproval/'+encodeURIComponent(sub.preapproval_id))
    let status=String(remote.status||sub.status)
    const user=await query('SELECT * FROM users WHERE id=?',sub.user_id).first()
    if(!user)return null
    if(status==='authorized'){
      const older=await query("SELECT preapproval_id FROM subscriptions WHERE user_id=? AND status='authorized' AND preapproval_id<>? AND created_at<?",sub.user_id,sub.preapproval_id,sub.created_at).first()
      if(older){try{await mp('PUT','/preapproval/'+encodeURIComponent(sub.preapproval_id),{status:'cancelled'})}catch{}status='cancelled'}
    }
    const charged=Number(remote.summarized?.charged_quantity)||0
    const provisional=env.MP_GRANT_ON_AUTHORIZE==='1'&&status==='authorized'&&charged===0&&sub.granted_quantity===0?1:0
    const target=status==='cancelled'&&sub.status!=='authorized'&&charged===0?0:charged+provisional
    const missing=Math.max(0,target-sub.granted_quantity)
    let until=user.expires_at
    const statements=[]
    for(let n=sub.granted_quantity+1;n<=sub.granted_quantity+missing;n++){
      until=nextMonth(Math.max(now(),until))
      statements.push(query("INSERT INTO payments(ref,user_id,status,created_at,approved_at,bank_reference,payment_provider) VALUES(?,?,'approved',?,?,?,'mercadopago')",crypto.randomUUID(),user.id,now(),now(),`mp-sub-${sub.preapproval_id}-${n}`))
    }
    if(missing)statements.push(query('UPDATE users SET expires_at=? WHERE id=?',until,user.id))
    statements.push(query('UPDATE subscriptions SET status=?,granted_quantity=?,next_payment_date=?,updated_at=? WHERE preapproval_id=?',status,sub.granted_quantity+missing,remote.next_payment_date||null,now(),sub.preapproval_id))
    try{await db.batch(statements)}
    catch(error){if(!/unique/i.test(String(error?.message||error)))throw error}
    return query('SELECT * FROM users WHERE id=?',user.id).first()
  }
  try{
    if(!db)throw failure(503,'Banco de dados ainda não conectado.')
    await ensureSchema()
    if(request.method==='POST'&&path!=='/api/payments/mp/webhook'){
      const origin=request.headers.get('Origin');if(origin&&origin!==url.origin)throw failure(403,'Origem não permitida.')
      if(!(request.headers.get('Content-Type')||'').includes('application/json'))throw failure(415,'Envie JSON.')
    }
    if(path==='/api/access/config'&&request.method==='GET')return json({ready:true,paymentReady:Boolean(env.PIX_KEY||env.MP_ACCESS_TOKEN),requireSubscription:true,monthlyPrice:Number(env.MP_PRICE)||15,paymentMode:env.MP_ACCESS_TOKEN?'mercadopago':'manual-nubank',subscriptionMode:env.MP_ACCESS_TOKEN?'recurring':'manual',mpPublicKey:env.MP_PUBLIC_KEY||null})
    if(path==='/api/access/me'&&request.method==='GET'){
      let user=await currentUser()
      if(user?.role==='subscriber'&&user.expires_at<=now()&&env.MP_ACCESS_TOKEN){
        // Renovação automática: se o webhook atrasou, confere o Mercado Pago (no máximo a cada 2 minutos).
        const sub=await query("SELECT * FROM subscriptions WHERE user_id=? AND (status='authorized' OR (status='pending' AND created_at>?)) AND COALESCE(updated_at,0)<? ORDER BY created_at DESC",user.id,now()-3*864e5,now()-12e4).first()
        if(sub){try{user=await reconcileSubscription(sub)||user}catch{}}
      }
      return json({user:publicUser(user)})
    }
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
      return json({revenue:approvedPayments*mpPrice(),activeSubscribers,approvedPayments,payments})
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
    // ── Mercado Pago: assinatura mensal automática (renovação recorrente) ──
    if(path==='/api/payments/mp/subscribe'&&request.method==='POST'){
      await limit();const user=await currentUser();if(!user)throw failure(401,'Entre na sua conta para assinar.')
      if(!env.MP_ACCESS_TOKEN)throw failure(503,'O Mercado Pago ainda não foi configurado no servidor.')
      if(user.role!=='subscriber')throw failure(400,'Seu convite já libera acesso.')
      if(await query("SELECT preapproval_id FROM subscriptions WHERE user_id=? AND status='authorized'",user.id).first())throw failure(409,'Você já tem uma assinatura ativa com renovação automática.')
      const fresh=await query("SELECT * FROM subscriptions WHERE user_id=? AND status='pending' AND init_point IS NOT NULL AND created_at>? ORDER BY created_at DESC",user.id,now()-432e5).first()
      if(fresh)return json({id:fresh.preapproval_id,initPoint:fresh.init_point,amount:fresh.amount})
      const price=mpPrice()
      const data=await mp('POST','/preapproval',{reason:'SYSTEM 84 — Assinatura mensal',external_reference:`s84-${user.id}`,payer_email:user.email,auto_recurring:{frequency:1,frequency_type:'months',transaction_amount:price,currency_id:'BRL'},back_url:`${url.origin}/?assinatura=retorno`,status:'pending'},crypto.randomUUID())
      if(!data.id||!data.init_point)throw failure(502,'O Mercado Pago não devolveu o link de assinatura. Tente novamente.')
      await query('INSERT INTO subscriptions(preapproval_id,user_id,status,amount,init_point,created_at) VALUES(?,?,?,?,?,?)',String(data.id),user.id,'pending',price,String(data.init_point),now()).run()
      return json({id:String(data.id),initPoint:String(data.init_point),amount:price})
    }
    if(path==='/api/payments/mp/sync'&&request.method==='POST'){
      const user=await currentUser();if(!user)throw failure(401,'Entre novamente.')
      if(!env.MP_ACCESS_TOKEN)throw failure(503,'O Mercado Pago ainda não foi configurado no servidor.')
      const sub=await query("SELECT * FROM subscriptions WHERE user_id=? ORDER BY CASE status WHEN 'authorized' THEN 0 WHEN 'pending' THEN 1 ELSE 2 END,created_at DESC",user.id).first()
      if(!sub)throw failure(404,'Nenhuma assinatura foi iniciada nesta conta.')
      const updated=await reconcileSubscription(sub)||user
      const current=await query('SELECT * FROM subscriptions WHERE preapproval_id=?',sub.preapproval_id).first()
      return json({status:current.status,nextPaymentDate:current.next_payment_date||null,user:publicUser(updated)})
    }
    if(path==='/api/payments/mp/subscription'&&request.method==='GET'){
      const user=await currentUser();if(!user)throw failure(401,'Entre novamente.')
      const sub=await query("SELECT status,amount,next_payment_date FROM subscriptions WHERE user_id=? AND status IN ('authorized','pending','paused') ORDER BY created_at DESC",user.id).first()
      return json({subscription:sub?{status:sub.status,amount:sub.amount,nextPaymentDate:sub.next_payment_date||null}:null,user:publicUser(user)})
    }
    if(path==='/api/payments/mp/cancel'&&request.method==='POST'){
      const user=await currentUser();if(!user)throw failure(401,'Entre novamente.')
      if(!env.MP_ACCESS_TOKEN)throw failure(503,'O Mercado Pago ainda não foi configurado no servidor.')
      const sub=await query("SELECT * FROM subscriptions WHERE user_id=? AND status IN ('authorized','paused') ORDER BY created_at DESC",user.id).first()
      if(!sub)throw failure(404,'Nenhuma assinatura ativa para cancelar.')
      await mp('PUT','/preapproval/'+encodeURIComponent(sub.preapproval_id),{status:'cancelled'})
      await query("UPDATE subscriptions SET status='cancelled',updated_at=? WHERE preapproval_id=?",now(),sub.preapproval_id).run()
      return json({success:true,message:'Renovação automática cancelada. Seu acesso continua até o fim do período já pago.',user:publicUser(user)})
    }
    // Pagamento avulso (um mês por vez), mantido por compatibilidade.
    if(path==='/api/payments/mp/preference'&&request.method==='POST'){
      await limit();const user=await currentUser();if(!user)throw failure(401,'Entre na sua conta para assinar.')
      if(!env.MP_ACCESS_TOKEN)throw failure(503,'O Mercado Pago ainda não foi configurado no servidor.')
      if(user.role!=='subscriber')throw failure(400,'Seu convite já libera acesso.')
      if(user.expires_at>now())throw failure(400,'Seu acesso já está ativo.')
      const price=Number(env.MP_PRICE)||15
      let order=await query("SELECT * FROM payments WHERE user_id=? AND status IN ('pending','submitted')",user.id).first()
      const ref=order?.ref||crypto.randomUUID()
      if(!order)await query('INSERT INTO payments(ref,user_id,created_at) VALUES(?,?,?)',ref,user.id,now()).run()
      const preference=await fetch('https://api.mercadopago.com/checkout/preferences',{
        method:'POST',
        headers:{Authorization:`Bearer ${env.MP_ACCESS_TOKEN}`,'Content-Type':'application/json','X-Idempotency-Key':ref},
        body:JSON.stringify({
          items:[{title:'SYSTEM 84 — Assinatura mensal',description:'Acesso completo ao acervo por um mês',quantity:1,unit_price:price,currency_id:'BRL'}],
          external_reference:ref,
          back_urls:{success:`${url.origin}/`,failure:`${url.origin}/`,pending:`${url.origin}/`},
          auto_return:'approved',
          notification_url:`${url.origin}/api/payments/mp/webhook`,
          statement_descriptor:'SYSTEM84',
        }),
      })
      if(!preference.ok)throw failure(502,'O Mercado Pago recusou a criação do pagamento. Tente novamente.')
      const data=await preference.json()
      await query("UPDATE payments SET mp_preference_id=?,mp_init_point=?,payment_provider='mercadopago' WHERE ref=?",String(data.id||''),String(data.init_point||''),ref).run()
      return json({id:ref,initPoint:data.init_point,publicKey:env.MP_PUBLIC_KEY||null,amount:price})
    }
    if(path==='/api/payments/mp/webhook'&&request.method==='POST'){
      const contentType=request.headers.get('Content-Type')||''
      const raw=await request.text()
      let payload={}
      try{payload=contentType.includes('application/json')?JSON.parse(raw||'{}'):Object.fromEntries(new URLSearchParams(raw))}catch{payload={}}
      const queryId=url.searchParams.get('data.id')
      const dataId=queryId??payload.data?.id??payload.data_id??url.searchParams.get('id')??payload.id
      const type=String(payload.type||payload.topic||url.searchParams.get('type')||url.searchParams.get('topic')||payload.action||'')
      const kind=/authorized_payment/.test(type)?'authorized':/preapproval|subscription/.test(type)?'preapproval':/payment/.test(type)?'payment':null
      if(!dataId||!kind)return json({received:true})
      if(env.MP_WEBHOOK_SECRET){
        const signature=request.headers.get('x-signature')||''
        const ts=signature.match(/ts=([^,]+)/)?.[1]||''
        const v1=signature.match(/v1=([^,]+)/)?.[1]||''
        const requestId=request.headers.get('x-request-id')||''
        const signedId=String(queryId??dataId),manifestId=/^[a-z0-9]+$/i.test(signedId)?signedId.toLowerCase():signedId
        const manifest=`id:${manifestId};request-id:${requestId};ts:${ts};`
        const key=await crypto.subtle.importKey('raw',encoder.encode(env.MP_WEBHOOK_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign'])
        const expected=hex(await crypto.subtle.sign('HMAC',key,encoder.encode(manifest)))
        if(!v1||!await equal(v1,expected))throw failure(401,'Assinatura do webhook inválida.')
      }
      if(!env.MP_ACCESS_TOKEN)return json({received:true})
      if(kind!=='payment'){
        // Assinatura recorrente: qualquer aviso (assinatura ou cobrança) dispara a conciliação.
        let preapprovalId=String(dataId)
        if(kind==='authorized'){
          try{preapprovalId=String((await mp('GET','/authorized_payments/'+encodeURIComponent(dataId))).preapproval_id||'')}
          catch{return json({received:true})}
        }
        const sub=preapprovalId?await query('SELECT * FROM subscriptions WHERE preapproval_id=?',preapprovalId).first():null
        if(!sub)return json({received:true})
        await reconcileSubscription(sub)
        return json({received:true,status:'reconciled'})
      }
      const lookup=await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`,{headers:{Authorization:`Bearer ${env.MP_ACCESS_TOKEN}`}})
      if(!lookup.ok)return json({received:true})
      const payment=await lookup.json()
      if(payment.status!=='approved')return json({received:true,status:payment.status})
      const ref=payment.external_reference
      const order=ref?await query('SELECT * FROM payments WHERE ref=?',ref).first():null
      if(!order)return json({received:true})
      if(order.status==='approved')return json({received:true,status:'approved'})
      const subscriber=await query('SELECT * FROM users WHERE id=?',order.user_id).first()
      const until=nextMonth(Math.max(now(),subscriber.expires_at))
      try{
        await db.batch([
          query("UPDATE payments SET status='approved',approved_at=?,mp_payment_id=?,payment_provider='mercadopago',bank_reference=? WHERE ref=? AND status IN ('pending','submitted')",now(),String(payment.id),`mp-${payment.id}`,ref),
          query('UPDATE users SET expires_at=? WHERE id=? AND EXISTS(SELECT 1 FROM payments WHERE ref=? AND mp_payment_id=?)',until,subscriber.id,ref,String(payment.id)),
        ])
      }catch(error){if(!/unique/i.test(String(error?.message||error)))throw error}
      return json({received:true,status:'approved'})
    }
    // ── Envios da comunidade ao catálogo ────────────────────────────
    const parseJson=(text)=>{try{return JSON.parse(text||'[]')}catch{return []}}
    const publicSubmission=row=>row&&{id:row.id,title:row.title,type:row.type,year:row.year,author_name:row.author_name,description:row.description,tags:parseJson(row.tags),sources:parseJson(row.sources),article:row.article,media_url:row.media_url,media_kind:row.media_kind,created_at:row.created_at}
    if(path==='/api/submissions'&&request.method==='GET'){
      const rows=(await query("SELECT * FROM submissions WHERE status='approved' ORDER BY created_at DESC LIMIT 200").all()).results
      return json({submissions:rows.map(publicSubmission)})
    }
    if(path==='/api/submissions/mine'&&request.method==='GET'){
      const user=await currentUser();if(!user)throw failure(401,'Entre na sua conta.')
      const rows=(await query('SELECT * FROM submissions WHERE user_id=? ORDER BY created_at DESC LIMIT 50',user.id).all()).results
      return json({submissions:rows.map(publicSubmission)})
    }
    if(path==='/api/submissions'&&request.method==='POST'){
      await limit();const user=await currentUser();if(!user)throw failure(401,'Entre na sua conta para publicar no catálogo.')
      const input=await body()
      const title=String(input.title||'').trim(),description=String(input.description||'').trim(),type=String(input.type||'')
      const author=String(input.author||'').trim(),article=String(input.article||'').trim(),mediaUrl=String(input.mediaUrl||'').trim()
      if(title.length<3||title.length>200)throw failure(400,'Título deve ter entre 3 e 200 caracteres.')
      if(!['filme','livro','série','lost-media','analog-horror'].includes(type))throw failure(400,'Tipo de obra inválido.')
      if(description.length<10||description.length>2000)throw failure(400,'Descrição deve ter entre 10 e 2000 caracteres.')
      if(author.length>120)throw failure(400,'Autoria muito longa.')
      const year=Number(input.year);if(!Number.isFinite(year)||year<0||year>2100)throw failure(400,'Informe um ano válido.')
      const tags=(Array.isArray(input.tags)?input.tags:[]).map(t=>String(t).trim().toLowerCase()).filter(Boolean).slice(0,8)
      if(tags.some(t=>t.length>40))throw failure(400,'Tags muito longas.')
      const sources=(Array.isArray(input.sources)?input.sources:[]).slice(0,5).map(s=>({title:String(s.title||'Fonte').slice(0,200),url:String(s.url||'')})).filter(s=>s.url.startsWith('https://'))
      const mediaKind=['text','video'].includes(input.mediaKind)?input.mediaKind:null
      if(mediaUrl&&!mediaUrl.startsWith('https://'))throw failure(400,'O link da mídia precisa ser https.')
      if(mediaUrl&&!mediaKind)throw failure(400,'Informe se a mídia é texto ou vídeo.')
      if(!article&&!mediaUrl&&!sources.length)throw failure(400,'Envie um texto, um link de mídia ou ao menos uma fonte.')
      if(article.length>50000)throw failure(413,'Texto muito longo.')
      const id=`sub-${crypto.randomUUID()}`
      await query('INSERT INTO submissions(id,user_id,title,type,year,author,author_name,description,tags,sources,article,media_url,media_kind,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        id,user.id,title,type,Math.round(year),author||null,user.name,description,JSON.stringify(tags),JSON.stringify(sources),article||null,mediaUrl||null,mediaKind,now()).run()
      return json({submission:{id,status:'pending'}},201)
    }
    if(path==='/api/admin/submissions'&&request.method==='GET'){
      const admin=await currentUser();if(admin?.role!=='admin')throw failure(403,'Acesso administrativo necessário.')
      const rows=(await query('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 200').all()).results
      return json({submissions:rows.map(row=>({...publicSubmission(row),status:row.status,user_id:row.user_id,reviewer_id:row.reviewer_id,reviewed_at:row.reviewed_at}))})
    }
    const review=path.match(/^\/api\/admin\/submissions\/([A-Za-z0-9-]+)\/(approve|reject)$/)
    if(review&&request.method==='POST'){
      const admin=await currentUser();if(admin?.role!=='admin')throw failure(403,'Acesso administrativo necessário.')
      const ref=review[1],action=review[2]
      const item=await query('SELECT * FROM submissions WHERE id=?',ref).first();if(!item)throw failure(404,'Envio não encontrado.')
      await query("UPDATE submissions SET status=?,reviewed_at=?,reviewer_id=? WHERE id=? AND status='pending'",action==='approve'?'approved':'rejected',now(),admin.id,ref).run()
      return json({success:true,status:action==='approve'?'approved':'rejected'})
    }
    throw failure(404,'Endpoint não encontrado.')
  }catch(e){return json({error:e.status?e.message:'Não foi possível concluir a operação. Tente novamente.'},e.status||500)}
}
export async function allowedMedia(request,env,options){const response=await handleApi(new Request(new URL('/api/access/me',request.url),{headers:request.headers}),env,options);if(!response.ok)return false;return Boolean((await response.json()).user?.hasAccess)}
