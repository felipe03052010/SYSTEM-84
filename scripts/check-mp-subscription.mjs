// Teste da assinatura recorrente do Mercado Pago, com a API do MP simulada.
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { createApp, nextMonth } from '../server/index.mjs'

const realFetch = globalThis.fetch
const mpState = { status: 'pending', charged: 0, nextPayment: '2026-03-05T10:00:00.000-03:00', calls: [] }
globalThis.fetch = async (input, init = {}) => {
  const url = String(input?.url || input)
  if (!url.startsWith('https://api.mercadopago.com')) return realFetch(input, init)
  const path = url.replace('https://api.mercadopago.com', ''), method = init.method || 'GET'
  mpState.calls.push(`${method} ${path}`)
  const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
  assert.equal(init.headers.Authorization, 'Bearer TEST-TOKEN')
  if (method === 'POST' && path === '/preapproval') {
    const body = JSON.parse(init.body)
    assert.equal(body.auto_recurring.frequency, 1)
    assert.equal(body.auto_recurring.frequency_type, 'months')
    assert.equal(body.auto_recurring.transaction_amount, 15)
    assert.equal(body.auto_recurring.currency_id, 'BRL')
    assert.equal(body.status, 'pending')
    assert.equal(body.payer_email, 'sub@example.test')
    return reply({ id: 'PRE-1', init_point: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_id=PRE-1', status: 'pending' }, 201)
  }
  if (method === 'GET' && path === '/preapproval/PRE-1') return reply({ id: 'PRE-1', status: mpState.status, next_payment_date: mpState.nextPayment, summarized: { charged_quantity: mpState.charged } })
  if (method === 'GET' && path === '/authorized_payments/AP-1') return reply({ id: 'AP-1', preapproval_id: 'PRE-1', status: 'processed' })
  if (method === 'PUT' && path === '/preapproval/PRE-1') { mpState.status = JSON.parse(init.body).status; return reply({ id: 'PRE-1', status: mpState.status }) }
  return reply({ message: 'not found' }, 404)
}

let clock = Date.UTC(2026, 1, 5, 12)
const env = { PUBLIC_ORIGIN: 'http://127.0.0.1:5174', CREATOR_INVITE_CODE: 'c', ADMIN_INVITE_CODE: 'a', PIX_KEY: 'k@example.test', MP_ACCESS_TOKEN: 'TEST-TOKEN', MP_WEBHOOK_SECRET: 'segredo-de-teste' }
const app = createApp({ dbPath: ':memory:', env, now: () => clock })
await new Promise((resolve) => app.server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${app.server.address().port}`
async function call(path, data, cookie = '', method = data ? 'POST' : 'GET') {
  const response = await realFetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}) })
  return { status: response.status, data: await response.json().catch(() => ({})), cookie: (response.headers.get('set-cookie') || '').split(';')[0] }
}
function webhook(type, id, { signed = true, badSignature = false } = {}) {
  const ts = '1700000000', requestId = 'req-' + Math.random()
  const v1 = createHmac('sha256', env.MP_WEBHOOK_SECRET).update(`id:${/^[a-z0-9]+$/i.test(String(id)) ? String(id).toLowerCase() : id};request-id:${requestId};ts:${ts};`).digest('hex')
  return realFetch(`${base}/api/payments/mp/webhook?data.id=${id}&type=${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-request-id': requestId, ...(signed ? { 'x-signature': `ts=${ts},v1=${badSignature ? 'f'.repeat(64) : v1}` } : {}) },
    body: JSON.stringify({ type, data: { id: String(id) } }),
  }).then(async (response) => ({ status: response.status, data: await response.json().catch(() => ({})) }))
}

try {
  const sub = await call('/api/access/register', { name: 'Assinante', email: 'sub@example.test', password: 'senha-de-teste-000', role: 'subscriber' })
  assert.equal(sub.status, 200)
  assert.equal((await call('/api/access/config')).data.subscriptionMode, 'recurring')
  assert.equal((await call('/api/payments/mp/subscribe', {})).status, 401)

  const started = await call('/api/payments/mp/subscribe', {}, sub.cookie)
  assert.equal(started.status, 200)
  assert.match(started.data.initPoint, /preapproval_id=PRE-1/)
  assert.equal(started.data.amount, 15)
  assert.equal((await call('/api/payments/mp/subscribe', {}, sub.cookie)).data.initPoint, started.data.initPoint, 'Reuses the open checkout link')
  assert.equal(mpState.calls.filter((c) => c === 'POST /preapproval').length, 1)

  let synced = await call('/api/payments/mp/sync', {}, sub.cookie)
  assert.equal(synced.data.status, 'pending'); assert.equal(synced.data.user.hasAccess, false)

  mpState.status = 'authorized'
  synced = await call('/api/payments/mp/sync', {}, sub.cookie)
  assert.equal(synced.data.status, 'authorized'); assert.equal(synced.data.user.hasAccess, false, 'Authorization without a charge grants nothing')
  assert.equal((await call('/api/payments/mp/subscribe', {}, sub.cookie)).status, 409)

  assert.equal((await webhook('subscription_authorized_payment', 'AP-1', { badSignature: true })).status, 401)
  assert.equal((await webhook('subscription_authorized_payment', 'AP-1', { signed: false })).status, 401)
  mpState.charged = 1
  assert.equal((await webhook('subscription_authorized_payment', 'AP-1')).status, 200)
  const first = nextMonth(clock)
  assert.equal((await call('/api/access/me', null, sub.cookie)).data.user.expiresAt, first)
  assert.equal((await call('/api/access/me', null, sub.cookie)).data.user.hasAccess, true)

  await Promise.all([webhook('subscription_authorized_payment', 'AP-1'), webhook('subscription_preapproval', 'PRE-1'), webhook('subscription_authorized_payment', 'AP-1')])
  assert.equal((await call('/api/access/me', null, sub.cookie)).data.user.expiresAt, first, 'Repeated or concurrent notifications never add months')

  clock = first + 60_000
  const relogin = await call('/api/access/login', { email: 'sub@example.test', password: 'senha-de-teste-000' })
  assert.equal(relogin.data.user.hasAccess, false, 'Without a new charge the access expires')
  mpState.charged = 2
  clock += 130_000
  const renewed = (await call('/api/access/me', null, relogin.cookie)).data.user
  assert.equal(renewed.hasAccess, true, 'The next monthly charge renews access even if the webhook never arrived')
  assert.equal(renewed.expiresAt, nextMonth(clock))

  const admin = await call('/api/access/register', { name: 'Admin', email: 'admin@example.test', password: 'senha-de-teste-000', role: 'admin', inviteCode: 'a' })
  const summary = await call('/api/admin/summary', null, admin.cookie)
  assert.equal(summary.data.approvedPayments, 2); assert.equal(summary.data.revenue, 30)

  sub.cookie = relogin.cookie
  const cancelled = await call('/api/payments/mp/cancel', {}, sub.cookie)
  assert.equal(cancelled.status, 200); assert.equal(mpState.status, 'cancelled')
  assert.equal((await call('/api/access/me', null, sub.cookie)).data.user.hasAccess, true, 'Cancelling keeps the already paid period')
  assert.equal((await call('/api/payments/mp/subscription', null, sub.cookie)).data.subscription, null)
  assert.equal((await call('/api/payments/mp/cancel', {}, sub.cookie)).status, 404)
  assert.equal((await call('/api/payments/mp/subscribe', {}, admin.cookie)).status, 400, 'Invited roles do not need to subscribe')
  console.log('PASS: recurring Mercado Pago subscription — checkout, signed webhook, idempotent monthly credit, lazy renewal, cancellation.')
} finally {
  globalThis.fetch = realFetch
  await new Promise((resolve) => app.server.close(resolve)); app.db.close()
}
