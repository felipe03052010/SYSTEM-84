/**
 * Efeitos sonoros globais do SYSTEM 84.
 *
 * Instalado uma única vez no Layout: dá som a cada clique, tecla digitada,
 * abertura de painel e troca de aba, como um computador antigo ligado.
 * Respeita o botão SOM: ON/OFF (mesma preferência de utils/audio.js).
 */
import { useEffect } from 'react'
import { keyClack, uiClick, uiHover } from '../utils/retro-sounds'

const INTERACTIVE = 'a, button, [role="button"], summary, select, input[type="checkbox"], input[type="radio"]'

export default function useRetroSoundscape() {
  useEffect(() => {
    let lastClick = 0
    let lastHover = 0
    let lastKey = 0

    function elementOf(target) {
      if (!target || typeof target.closest !== 'function') return null
      return target
    }

    function onClick(event) {
      const target = elementOf(event.target)
      if (!target) return
      if (target.closest('input[type="text"], input[type="search"], textarea')) return
      const now = performance.now()
      if (now - lastClick < 55) return
      lastClick = now
      if (target.closest(INTERACTIVE)) uiClick()
      else keyClack()
    }

    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const now = performance.now()
      if (now - lastKey < 45) return
      lastKey = now
      if (event.key === 'Enter') {
        uiClick()
        return
      }
      keyClack()
    }

    function onPointerOver(event) {
      const target = elementOf(event.target)
      if (!target) return
      if (!target.closest(INTERACTIVE)) return
      const now = performance.now()
      if (now - lastHover < 220) return
      lastHover = now
      uiHover()
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerover', onPointerOver, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerover', onPointerOver, true)
    }
  }, [])
}
