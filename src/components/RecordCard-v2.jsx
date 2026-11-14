import { playClick } from '../utils/audio'
import { Link } from 'react-router-dom'

export default function RecordCard({ record }) {
  const actionLabel =
    record.type === 'arg'
      ? 'Investigar'
      : record.type === 'livro' || record.article
        ? 'Ler agora'
        : 'Assistir'

  return (
    <article className="record-card">
      <div className="record-cover">
        <span className="record-code">{record.code}</span>
        {record.type === 'lost-media' && (
          <span className="classified-stamp">Top secret</span>
        )}

        <div className="cover-placeholder">
          <span>Arquivo // dossiê</span>
          <strong>{record.title}</strong>
          <small>
            {record.type.toUpperCase()} &bull; {record.year}
          </small>
        </div>
      </div>

      <div className="record-content">
        <span className="record-meta">
          {record.type.toUpperCase()} // {record.year}
        </span>

        <h3>{record.title}</h3>
        <p>{record.description}</p>

        <div className="record-tags">
          {record.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <Link className="terminal-action" to={`/obra/${record.id}`} onClick={playClick}>
          {actionLabel} &gt;
        </Link>
      </div>
    </article>
  )
}
