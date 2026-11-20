let audioContext = null
let enabled = true
let output = null
try { enabled = localStorage.getItem('system84-sound') !== 'off' } catch { /* Optional preference. */ }
export const soundEnabled = () => enabled
export function setSoundEnabled(value) {
  enabled = value
  if (output) output.gain.value = enabled ? 0.5 : 0
  try { localStorage.setItem('system84-sound', value ? 'on' : 'off') } catch { /* Optional preference. */ }
}

export function getAudioContext() {
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

export function soundOutput(context) {
  if (!output) {
    output = context.createGain()
    output.gain.value = enabled ? 0.5 : 0
    output.connect(context.destination)
  }
  return output
}

// Call from a user gesture: browsers may deny sound before the first interaction.
export async function resumeAudio() {
  if (!enabled) return null
  try {
    const context = getAudioContext()
    if (!context) return null
    if (context.state === 'suspended') await context.resume()
    return context.state === 'running' ? context : null
  } catch { return null }
}
