import { useState } from 'react'
import { playTyping, playSuccess } from '../utils/audio'
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '')
export default function ArgPuzzle({ record }) {
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [solved, setSolved] = useState(() => { try { return localStorage.getItem(`sys84-arg:${record.id}`) === 'solved' } catch { return false } })
  function submit(e) {
    e.preventDefault()
    if (normalize(answer) === normalize(record.puzzle.answer)) {
      setSolved(true); playSuccess()
      try { localStorage.setItem(`sys84-arg:${record.id}`, 'solved') } catch { /* Optional progress. */ }
    } else setMessage('SINAL NÃO RECONHECIDO. Confira a pista e tente novamente.')
  }
  return <section className="arg-console">
    {solved ? <div role="status"><h2>ARQUIVO DESBLOQUEADO</h2><p>{record.puzzle.ending}</p><button onClick={() => { setSolved(false); setAnswer(''); setMessage(''); try { localStorage.removeItem(`sys84-arg:${record.id}`) } catch { /* Optional progress. */ } }}>REINICIAR ENIGMA</button></div> : <form onSubmit={submit} className="arg-console"><label htmlFor="arg-answer">{record.puzzle.question}</label><input id="arg-answer" value={answer} autoComplete="off" onChange={e => { setAnswer(e.target.value); playTyping() }} required /><button>DECODIFICAR</button><p role="status">{message}</p><details><summary>Solicitar uma pista</summary><p>{record.puzzle.hint}</p></details></form>}
  </section>
}
