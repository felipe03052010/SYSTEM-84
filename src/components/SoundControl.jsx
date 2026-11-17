import { useState } from 'react'
import { soundEnabled, setSoundEnabled } from '../utils/audio'
export default function SoundControl() {
  const [enabled, setEnabled] = useState(soundEnabled)
  return <button className="sound-control" aria-label="Sons retrô" aria-pressed={enabled} onClick={() => { setSoundEnabled(!enabled); setEnabled(!enabled) }}>SOM: {enabled ? 'ON' : 'OFF'}</button>
}
