import { Link } from 'react-router-dom'
import { ItemGlyph, typeLabel, yearOf } from './Chassis'

export function Cover({record}) {
  return <Link className="s84-card" to={'/obra/'+record.id}>
    <div className="s84-poster"><small>CAPA / SYSTEM 84</small><ItemGlyph record={record} size={200}/><strong>{record.title}</strong></div>
    <small>{typeLabel(record)} / {record.type === 'livro' ? record.author : yearOf(record)}</small><span>{record.title}</span>
  </Link>
}

export function Orbit() {
  const radius = 151
  return <svg viewBox="0 0 400 400" aria-hidden="true">
    <path d="M18 48V19h29m306 362h29v-29" fill="none" stroke="#a8ff60" strokeWidth="2"/>
    <g transform="rotate(-27 200 200)" fill="none" stroke="#88bc42" strokeWidth=".85">
      <circle cx="200" cy="200" r={radius}/>
      {[22,54,84,110,132,146].map(rx=><ellipse key={rx} cx="200" cy="200" rx={rx} ry={radius}/>)}
      {[-125,-98,-69,-35,0,35,69,98,125].map(dy=><ellipse key={dy} cx="200" cy={200+dy} rx={Math.sqrt(radius**2-dy**2)*.98} ry={Math.sqrt(radius**2-dy**2)*.15}/>)}
      <ellipse cx="200" cy="200" rx="187" ry="48" stroke="#ff6332" strokeWidth="7"/>
    </g>
  </svg>
}
