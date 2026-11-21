import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { records, COLLECTIONS } from '../data/records'
import { playClick } from '../utils/audio'
import { DossierFooter, DossierMasthead, FrameMarks, Panel, SectionMark, UiIcon, WireGlobe, pad2 } from '../components/Chassis'
import '../styles/figma.css'
import '../styles/dossie.css'

const STEPS = [
  { icon: 'power', title: 'Ligue o terminal', text: 'A inicialização BIOS abre o arquivo. Você pode entrar com som ou em silêncio.' },
  { icon: 'search', title: 'Escolha uma coleção', text: 'Filmes, séries, livros, lost media, Analog Horror e episódios de ARG.' },
  { icon: 'eye', title: 'Abra a ficha', text: 'Cada obra tem código, ano, autoria, fonte, licença e histórico de preservação.' },
  { icon: 'play', title: 'Assista ou leia aqui', text: 'A ficha reúne o player ou o texto de leitura e as fontes da obra.' },
]

const PLANS = [
  {
    name: 'Visitante',
    price: 'R$ 0',
    note: 'para conhecer o arquivo',
    items: ['Prévia do acervo', 'Busca e linha do tempo', 'Dossiês de lost media', 'Episódios de ARG'],
  },
  {
    name: 'Assinante',
    price: 'R$ 15',
    note: 'por mês, renovação via Pix',
    items: ['Todo o acervo liberado', 'Player e leitor sem limites', 'Mural da comunidade', 'Apoia a curadoria e a hospedagem'],
    featured: true,
  },
  {
    name: 'Escolas e instituições',
    price: 'Sob consulta',
    note: 'licença por turma ou unidade',
    items: ['Contas para alunos e professores', 'Trilhas por disciplina (Literatura, História, Artes)', 'Relatório de uso', 'Sessões de cinema comentadas'],
  },
]

const FAQ = [
  ['Onde encontro os créditos e as condições de uso?', 'Abra a ficha e consulte a seção de procedência. Ela identifica a fonte da edição ou o canal que publicou o vídeo. As condições variam conforme a obra.'],
  ['Preciso baixar alguma coisa?', 'Não. Os livros abrem no leitor interno e os vídeos tocam no player do próprio site. O leitor lembra a página neste navegador.'],
  ['O que é lost media?', 'São obras perdidas ou incompletas: filmes destruídos em incêndios, episódios apagados para reaproveitar fita, curtas que nunca foram lançados. O SYSTEM 84 reúne as pistas e o estado atual de cada caso.'],
  ['Quem criou os vídeos de Analog Horror?', 'Os episódios são obras de ficção publicadas por seus respectivos criadores. Cada ficha identifica a autoria e inclui o vídeo para assistir aqui.'],
  ['Como funciona o pagamento?', 'A assinatura custa R$ 15 por mês via Pix. O administrador confere o crédito e libera um mês de acesso; o mesmo comprovante não pode ser usado duas vezes.'],
  ['Posso sugerir uma obra?', 'Pode. Use o canal ENVIOS da comunidade. Toda sugestão passa por moderação e só entra no acervo com fonte e licença verificadas.'],
]

export default function Sobre() {
  const counts = COLLECTIONS.map((item) => ({ ...item, total: records.filter((record) => record.type === item.type).length }))
  const sources = new Set(records.flatMap((record) => (record.sources || []).map((source) => new URL(source.url).hostname.replace('www.', '')))).size

  return (
    <Layout className="dossie-page about-page">
      <div className="dossier-frame">
        <DossierMasthead />

        <section className="prancha prancha-hero">
          <div className="hero-grid about-grid">
            <div className="hero-copy">
              <h1>O TEMPO<br />PASSA.<br />O SINAL<br />FICA.</h1>
              <p className="hero-lead">
                O SYSTEM 84 é um arquivo digital de memória cultural com cara de terminal dos anos 80.
                Reunimos filmes, séries, livros e dossiês de obras perdidas. Identificamos de onde
                cada registro veio e como consultar o material preservado.
              </p>
              <div className="hero-actions">
                <Link to="/filmes" className="fig-btn fig-btn-primary" onClick={playClick}>EXPLORAR O ACERVO ↗</Link>
                <Link to="/entrada" className="fig-btn fig-btn-secondary" onClick={playClick}>ASSINAR O ARQUIVO</Link>
              </div>
            </div>
            <figure className="hero-figure">
              <FrameMarks />
              <WireGlobe />
              <figcaption>FIG. 084 — MISSÃO DO ARQUIVO</figcaption>
            </figure>
          </div>
        </section>

        <section className="prancha">
          <SectionMark>O ACERVO EM NÚMEROS</SectionMark>
          <div className="about-numbers">
            <div><strong>{pad2(records.length)}</strong><span>REGISTROS</span></div>
            {counts.map((item) => (
              <Link key={item.type} to={item.path} onClick={playClick}><strong>{pad2(item.total)}</strong><span>{item.label.toUpperCase()}</span></Link>
            ))}
            <div><strong>{pad2(sources)}</strong><span>DOMÍNIOS DE ORIGEM</span></div>
          </div>
        </section>

        <section className="prancha">
          <SectionMark tone="ember">COMO FUNCIONA</SectionMark>
          <ol className="about-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <UiIcon name={step.icon} size={26} />
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="prancha">
          <SectionMark>PLANOS DE ACESSO</SectionMark>
          <div className="about-plans">
            {PLANS.map((plan) => (
              <article key={plan.name} className={plan.featured ? 'is-featured' : ''}>
                {plan.featured && <span className="plan-flag">MAIS ESCOLHIDO</span>}
                <h3>{plan.name}</h3>
                <p className="plan-price">{plan.price}</p>
                <p className="plan-note">{plan.note}</p>
                <ul>{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="prancha about-split">
          <Panel title="PRINCÍPIOS DO ARQUIVO" tone="acid">
            <ul className="system-list">
              <li><UiIcon name="lock" size={20} /><div><strong>Direitos por obra</strong><span>créditos e condições de uso na ficha</span></div></li>
              <li><UiIcon name="archive" size={20} /><div><strong>Procedência sempre visível</strong><span>fonte, licença e histórico em cada ficha</span></div></li>
              <li><UiIcon name="eye" size={20} /><div><strong>Sem rastreadores</strong><span>preferências ficam só no seu navegador</span></div></li>
              <li><UiIcon name="people" size={20} /><div><strong>Curadoria com moderação</strong><span>envios entram só com fonte verificada</span></div></li>
            </ul>
          </Panel>
          <Panel title="PERGUNTAS FREQUENTES" tone="ember">
            <div className="about-faq">
              {FAQ.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </Panel>
        </section>

        <DossierFooter page={13} total={13} />
      </div>
    </Layout>
  )
}
