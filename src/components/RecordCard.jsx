import { playClick } from '../utils/audio'
import { ItemGlyph, MetaPills, StatusSeal, typeLabel, yearOf } from './Chassis'
import { Link } from 'react-router-dom'
import '../styles/dossie.css'

export default function RecordCard({ record }) {
  const actionLabel =
    record.type === 'arg'
      ? 'Investigar'
      : record.type === 'lost-media'
        ? 'Abrir dossiê'
        : record.type === 'analog-horror'
          ? (record.media?.[0]?.kind === 'youtube' ? 'Assistir' : 'Ler a fita')
          : record.type === 'livro' || record.article
            ? 'Ler agora'
            : 'Assistir'

  return (
    <article className="record-card">
      <span className="rc-top">
        <span className="rc-code">{typeLabel(record)} / {yearOf(record)}</span>
        {record.isNew ? <span className="rc-new">NOVO</span> : <span className="rc-dot" aria-hidden="true" />}
      </span>

      <span className="rc-art">
        <ItemGlyph record={record} size={78} />
      </span>

      <strong className="rc-title">{record.title}</strong>
      {record.author && <span className="rc-author">{record.author}</span>}
      <span className="rc-description">{record.description}</span>

      <span className="rc-foot">
        <MetaPills items={[['TIPO', typeLabel(record)], ['ANO', yearOf(record)]]} />
        <StatusSeal status={record.recoveryStatus ? record.recoveryStatus.split('—')[0].trim() : 'disponível'} />
      </span>

      <Link className="terminal-action" to={`/obra/${record.id}`} onClick={playClick}>
        {actionLabel} ↗
      </Link>
    </article>
  )
}
