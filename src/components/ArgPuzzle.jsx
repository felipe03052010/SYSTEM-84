import { useState } from 'react'
import { playTyping, playSuccess } from '../utils/audio'
import { uiError } from '../utils/retro-sounds'

const normalize = (value) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '')

export default function ArgPuzzle({ record }) {
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [wrong, setWrong] = useState(0)
  const [solved, setSolved] = useState(() => { try { return localStorage.getItem(`sys84-arg:${record.id}`) === 'solved' } catch { return false } })

  function submit(event) {
    event.preventDefault()
    if (normalize(answer) === normalize(record.puzzle.answer)) {
      setSolved(true)
      setMessage('')
      playSuccess()
      try { localStorage.setItem(`sys84-arg:${record.id}`, 'solved') } catch { /* progresso opcional */ }
    } else {
      setWrong((count) => count + 1)
      uiError()
      setMessage('SINAL NÃO RECONHECIDO. Confira a pista e tente novamente.')
    }
  }

  function reset() {
    setSolved(false)
    setAnswer('')
    setMessage('')
    try { localStorage.removeItem(`sys84-arg:${record.id}`) } catch { /* progresso opcional */ }
  }

  if (solved) {
    return (
      <section className="arg-console" role="status">
        <h2>ARQUIVO DESBLOQUEADO</h2>
        <p>{record.puzzle.ending}</p>
        <button type="button" onClick={reset}>REINICIAR ENIGMA</button>
      </section>
    )
  }

  return (
    <form onSubmit={submit} key={wrong} className={`arg-console ${wrong ? 'is-wrong' : ''}`}>
      <label htmlFor="arg-answer">{record.puzzle.question}</label>
      <input id="arg-answer" value={answer} autoComplete="off" autoFocus={wrong > 0} onChange={(event) => { setAnswer(event.target.value); playTyping() }} required />
      <button type="submit">DECODIFICAR</button>
      <p role="status">{message}</p>
      <details><summary>Solicitar uma pista</summary><p>{record.puzzle.hint}</p></details>
    </form>
  )
}
