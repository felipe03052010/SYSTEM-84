import { getAudioContext, soundEnabled, soundOutput } from './audioDevice.js'
import { keyClack, uiClick, uiConfirm } from './retro-sounds.js'
export { resumeAudio, setSoundEnabled, soundEnabled } from './audioDevice.js'

let lastClick = -Infinity
let lastTyping = -Infinity

export function beep(
  frequency = 520,
  duration = 0.04,
  volume = 0.012,
  type = 'square',
) {
  if (!soundEnabled()) return
  let context
  try { context = getAudioContext() } catch { return }
  if (!context) return

  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, context.currentTime)

  gain.gain.setValueAtTime(volume, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    context.currentTime + duration,
  )

  oscillator.connect(gain)
  gain.connect(soundOutput(context))

  oscillator.start()
  oscillator.stop(context.currentTime + duration)
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
}

export function playClick() {
  const now = performance.now()
  if (now - lastClick < 60) return
  lastClick = now
  uiClick()
}

export function playTyping() {
  const now = performance.now()
  if (now - lastTyping < 30) return
  lastTyping = now
  keyClack()
}

export function playStartup() {
  beep(110, 0.12, 0.03)

  setTimeout(() => beep(220, 0.1, 0.028), 130)
  setTimeout(() => beep(440, 0.1, 0.025), 260)
  setTimeout(() => beep(880, 0.18, 0.02), 400)
}

export const playSuccess = uiConfirm
