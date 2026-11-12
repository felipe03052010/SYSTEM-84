import { useEffect, useState } from 'react'
import { beep, playStartup, playSuccess } from '../utils/audio'
import '../styles/boot.css'

const bootMessages = [
  'SYSTEM 84 BIOS REVISION 1.0.84',
  'Copyright © 2026 SYSTEM 84',
  '',
  'Verificando memória................. 640K OK',
  'Inicializando interface CRT......... OK',
  'Carregando terminal de pesquisa..... OK',
  'Montando diretório /FILMES.......... OK',
  'Montando diretório /SERIES.......... OK',
  'Montando diretório /LIVROS.......... OK',
  'Conectando banco de memória......... OK',
  'Carregando módulo LOST_MEDIA........ OK',
  'Verificando registros históricos.... OK',
  '',
  '> TODOS OS SISTEMAS OPERACIONAIS',
  '> ACESSO CONCEDIDO',
]

export default function BootScreen({ onComplete }) {
  const [started, setStarted] = useState(false)
  const [lines, setLines] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Enter' && !started) {
        startBoot()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [started])

  async function startBoot() {
    if (started) return

    setStarted(true)
    playStartup()

    for (let index = 0; index < bootMessages.length; index += 1) {
      const message = bootMessages[index]

      await new Promise((resolve) =>
        setTimeout(resolve, 110 + Math.random() * 120),
      )

      setLines((current) => [...current, message])
      setPercentage(Math.round(((index + 1) / bootMessages.length) * 100))

      if (message) beep(620, 0.025, 0.008)
    }

    playSuccess()
    await new Promise((resolve) => setTimeout(resolve, 550))
    setClosing(true)
    await new Promise((resolve) => setTimeout(resolve, 650))
    onComplete()
  }

  return (
    <section className={`boot-screen ${closing ? 'closing' : ''}`}>
      <div className="boot-terminal">
        <div className="boot-header">
          <span>SYSTEM 84 BIOS</span>
          <span>REV 1.0.84</span>
        </div>

        {!started ? (
          <div className="boot-start">
            <span>ARQUIVO DE MEMÓRIA CULTURAL</span>

            <h1>
              SYSTEM <em>84</em>
            </h1>

            <p>TERMINAL DE PRESERVAÇÃO DIGITAL</p>

            <div className="boot-message">
              &gt; PRESSIONE ENTER PARA INICIALIZAR
              <span className="blink">█</span>
            </div>

            <button type="button" onClick={startBoot}>
              [ INICIALIZAR SISTEMA ]
            </button>
          </div>
        ) : (
          <div className="boot-process">
            <div className="boot-log">
              {lines.map((line, index) => (
                <p key={`${line}-${index}`}>{line || ' '}</p>
              ))}
            </div>

            <div>
              <div className="boot-progress-info">
                <span>CARREGANDO ARQUIVOS...</span>
                <span>{percentage}%</span>
              </div>

              <div className="boot-progress">
                <div style={{ width: `${percentage}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
