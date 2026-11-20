import { useEffect } from 'react'
import { playClick, playTyping } from './audio'
import { uiHover } from './retro-sounds'

const controls = 'a[href], button:enabled, summary, select:enabled, input[type="checkbox"], input[type="radio"], [role="button"]'

export default function useRetroSoundscape() {
  useEffect(() => {
    let lastHover = -Infinity
    let interacted = false
    function click(event) {
      interacted = true
      const control = event.target.closest?.(controls)
      if (control && !control.matches('.sound-control[aria-pressed="false"]')) playClick()
    }
    function input(event) {
      interacted = true
      if (event.inputType && event.target.matches?.('textarea, input:not([type="range"]), [contenteditable="true"]')) playTyping()
    }
    function hover(event) {
      if (!interacted || event.pointerType !== 'mouse') return
      const control = event.target.closest?.(controls)
      if (!control || (event.relatedTarget instanceof Node && control.contains(event.relatedTarget))) return
      const now = performance.now()
      if (now - lastHover < 280) return
      lastHover = now
      uiHover()
    }
    document.addEventListener('click', click)
    document.addEventListener('input', input)
    document.addEventListener('pointerover', hover)
    return () => {
      document.removeEventListener('click', click)
      document.removeEventListener('input', input)
      document.removeEventListener('pointerover', hover)
    }
  }, [])
}
