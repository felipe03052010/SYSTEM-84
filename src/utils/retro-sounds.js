/**
 * Banco de sons de computador antigo.
 *
 * Tudo é sintetizado na hora com Web Audio (osciladores, ruído filtrado e
 * envelopes), sem nenhum arquivo de áudio: assim o site continua leve e
 * nenhuma amostra de terceiros entra no repositório.
 *
 * Cada função é segura: se o navegador bloquear o áudio ou o som estiver
 * desligado, ela simplesmente não faz nada.
 */
import { getAudioContext, soundEnabled, soundOutput } from './audioDevice.js'

let master = null
let noiseBuffer = null

function ensure() {
  if (!soundEnabled()) return null
  try {
    const context = getAudioContext()
    if (context) master = soundOutput(context)
    return context
  } catch { return null }
}

/** Ruído branco reaproveitado para chiados de fita, estática e motores. */
function noise(ctx) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1
  }
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true
  return source
}

function tone(ctx, { from, to = from, type = 'square', gain = 0.05, attack = 0.004, decay = 0.12, delay = 0 }) {
  const start = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(Math.max(20, from), start)
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + decay)
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + attack)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay)
  osc.connect(amp)
  amp.connect(master)
  osc.start(start)
  osc.stop(start + attack + decay + 0.02)
  osc.onended = () => {
    osc.disconnect()
    amp.disconnect()
  }
  return osc
}

function burst(ctx, { gain = 0.04, decay = 0.14, delay = 0, highpass = 800, lowpass = 6000 }) {
  const start = ctx.currentTime + delay
  const src = noise(ctx)
  const hp = ctx.createBiquadFilter()
  const lp = ctx.createBiquadFilter()
  const amp = ctx.createGain()
  hp.type = 'highpass'
  hp.frequency.value = highpass
  lp.type = 'lowpass'
  lp.frequency.value = lowpass
  amp.gain.setValueAtTime(gain, start)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + decay)
  src.connect(hp)
  hp.connect(lp)
  lp.connect(amp)
  amp.connect(master)
  src.start(start)
  src.stop(start + decay + 0.02)
  src.onended = () => {
    src.disconnect()
    hp.disconnect()
    lp.disconnect()
    amp.disconnect()
  }
}

/* ───────────────────────── teclado e mouse ───────────────────────── */

/** Tecla de teclado mecânico de 8 bits. */
export function keyClack() {
  const ctx = ensure()
  if (!ctx) return
  const pitch = 165 + Math.random() * 55
  burst(ctx, { gain: 0.024, decay: 0.022, highpass: 1300, lowpass: 4200 })
  tone(ctx, { from: pitch, to: 95, type: 'triangle', gain: 0.034, decay: 0.045 })
  burst(ctx, { gain: 0.009, delay: 0.032, decay: 0.025, highpass: 580, lowpass: 2200 })
}

/** Clique curto de menu de terminal. */
export function uiClick() {
  const ctx = ensure()
  if (!ctx) return
  burst(ctx, { gain: 0.025, decay: 0.018, highpass: 640, lowpass: 3200 })
  tone(ctx, { from: 515, to: 285, type: 'triangle', gain: 0.042, decay: 0.065 })
}

/** Confirmação: dois bipes ascendentes. */
export function uiConfirm() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 660, type: 'square', gain: 0.04, decay: 0.06 })
  tone(ctx, { from: 990, type: 'square', gain: 0.04, decay: 0.08, delay: 0.07 })
}

/** Erro: buzz descendente curto. */
export function uiError() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 220, to: 90, type: 'sawtooth', gain: 0.055, decay: 0.22 })
  burst(ctx, { gain: 0.02, decay: 0.1, highpass: 300, lowpass: 1400 })
}

/** Hover sobre item de diretório. */
export function uiHover() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 1320, type: 'triangle', gain: 0.012, decay: 0.03 })
}

/* ───────────────────────── navegação e carregamento ───────────────────────── */

/** Disquete lendo: cliques irregulares + chiado de cabeça de leitura. */
export function floppyRead() {
  const ctx = ensure()
  if (!ctx) return
  const steps = 6
  for (let i = 0; i < steps; i += 1) {
    burst(ctx, { gain: 0.035, decay: 0.04, delay: i * 0.085, highpass: 900, lowpass: 5200 })
    tone(ctx, { from: 140 + i * 12, to: 110, type: 'square', gain: 0.022, decay: 0.05, delay: i * 0.085 })
  }
  burst(ctx, { gain: 0.014, decay: 0.6, highpass: 2000, lowpass: 8000 })
}

/** Modem discando: tons DTMF e o chiado da portadora. */
export function modemHandshake() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 350, type: 'sine', gain: 0.04, decay: 0.18 })
  tone(ctx, { from: 440, type: 'sine', gain: 0.04, decay: 0.18, delay: 0.2 })
  tone(ctx, { from: 620, type: 'sine', gain: 0.035, decay: 0.12, delay: 0.42 })
  tone(ctx, { from: 480, type: 'sine', gain: 0.035, decay: 0.12, delay: 0.56 })
  burst(ctx, { gain: 0.03, decay: 0.5, delay: 0.7, highpass: 400, lowpass: 3200 })
  tone(ctx, { from: 1200, to: 2400, type: 'sine', gain: 0.03, decay: 0.45, delay: 0.8 })
}

/** Boot de placa-mãe: um bipe curto e firme. */
export function postBeep() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 1000, type: 'square', gain: 0.05, attack: 0.002, decay: 0.16 })
}

/** Varredura de fita VHS sendo rebobinada. */
export function tapeRewind() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 90, to: 520, type: 'sawtooth', gain: 0.03, decay: 0.5 })
  burst(ctx, { gain: 0.028, decay: 0.5, highpass: 600, lowpass: 5000 })
}

/** Estática curta, como trocar de canal. */
export function staticBurst() {
  const ctx = ensure()
  if (!ctx) return
  burst(ctx, { gain: 0.045, decay: 0.18, highpass: 1200, lowpass: 9000 })
}

/** Interruptor de energia: o "clac" do gabinete. */
export function powerSwitch() {
  const ctx = ensure()
  if (!ctx) return
  burst(ctx, { gain: 0.06, decay: 0.05, highpass: 200, lowpass: 3000 })
  tone(ctx, { from: 70, to: 40, type: 'sine', gain: 0.05, decay: 0.1 })
}

/** Sinal de erro de disco. */
export function diskError() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 400, to: 400, type: 'square', gain: 0.05, decay: 0.1 })
  tone(ctx, { from: 300, to: 300, type: 'square', gain: 0.05, decay: 0.14, delay: 0.14 })
}

/** Trilha de fundo do boot: sequência de bipes de POST. */
export function bootSequence() {
  const ctx = ensure()
  if (!ctx) return
  tone(ctx, { from: 1000, type: 'square', gain: 0.05, decay: 0.12 })
  tone(ctx, { from: 1000, type: 'square', gain: 0.05, decay: 0.12, delay: 0.24 })
  tone(ctx, { from: 1500, type: 'square', gain: 0.04, decay: 0.2, delay: 0.5 })
  burst(ctx, { gain: 0.02, decay: 0.5, delay: 0.7, highpass: 500, lowpass: 4000 })
}

/**
 * Catálogo dos sons por tipo de tela de carregamento. Cada tela tem o seu
 * próprio som e a sua própria animação, para que nenhuma seja igual.
 */
export const loadingSounds = {
  floppy: floppyRead,
  modem: modemHandshake,
  tape: tapeRewind,
  static: staticBurst,
  power: powerSwitch,
  disk: diskError,
}
