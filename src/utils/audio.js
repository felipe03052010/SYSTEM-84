let audioContext = null
let enabled = true
let lastClick = 0
let lastTyping = 0
try { enabled = localStorage.getItem('system84-sound') !== 'off' } catch { /* Optional preference. */ }
export const soundEnabled = () => enabled
export function setSoundEnabled(value) {
  enabled = value
  try { localStorage.setItem('system84-sound', value ? 'on' : 'off') } catch { /* Optional preference. */ }
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    audioContext = new AudioContext()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }

  return audioContext
}

export function beep(
  frequency = 520,
  duration = 0.04,
  volume = 0.012,
  type = 'square',
) {
  if (!enabled) return
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
  gain.connect(context.destination)

  oscillator.start()
  oscillator.stop(context.currentTime + duration)
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect() }
}

export function playClick() {
  const now = performance.now()
  if (now - lastClick < 60) return
  lastClick = now
  beep(600, 0.035, 0.012)
}

export function playTyping() {
  const now = performance.now()
  if (now - lastTyping < 30) return
  lastTyping = now
  beep(420 + Math.random() * 120, 0.02, 0.006)
}

export function playStartup() {
  beep(110, 0.12, 0.03)

  setTimeout(() => beep(220, 0.1, 0.028), 130)
  setTimeout(() => beep(440, 0.1, 0.025), 260)
  setTimeout(() => beep(880, 0.18, 0.02), 400)
}

export function playSuccess() {
  beep(520, 0.07, 0.02)
  setTimeout(() => beep(720, 0.07, 0.02), 90)
  setTimeout(() => beep(960, 0.13, 0.02), 180)
}
