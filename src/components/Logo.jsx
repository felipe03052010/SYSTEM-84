import { Link } from 'react-router-dom'

/*
 * Monograma [84]: colchetes em verde-ácido e os dígitos em pixels de papel,
 * como no cabeçalho das pranchas. Cada pixel é um <rect> para poder piscar
 * e "reacender" quando o cursor passa pelo logo.
 */
const DIGITS = {
  8: ['.####.', '##..##', '##..##', '.####.', '##..##', '##..##', '##..##', '.####.'],
  4: ['...##.', '..###.', '.####.', '##.##.', '######', '...##.', '...##.', '...##.'],
}
const CELL = 3.4
const PIXELS = []
;[[8, 18.6], [4, 40.6]].forEach(([digit, x0]) => {
  DIGITS[digit].forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '#') PIXELS.push([x0 + x * CELL, 10.4 + y * CELL])
  }))
})

export function Monogram({ className = '' }) {
  return (
    <svg className={`s84-monogram ${className}`} viewBox="0 0 80 48" aria-hidden="true" focusable="false">
      <path className="mono-br mono-br-l" d="M14 3H4v42h10" />
      <path className="mono-br mono-br-r" d="M66 3h10v42H66" />
      <g className="mono-px">
        {PIXELS.map(([x, y], i) => (
          <rect key={i} x={x + 0.25} y={y + 0.25} width={CELL - 0.5} height={CELL - 0.5} style={{ '--i': (i * 7) % 23 }} />
        ))}
      </g>
      <rect className="mono-scan" x="16" y="8" width="48" height="2" />
    </svg>
  )
}

export default function Logo({ compact = false }) {
  return (
    <span className={`identity s84-logo ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      <Monogram />
      <span className="s84-logo-rule" />
      <span className="s84-logo-word">
        <strong>SYSTEM 84</strong>
        {!compact && <em>ARQUIVO CULTURAL</em>}
      </span>
    </span>
  )
}

export function LogoLink({ to = '/', compact = false, onClick }) {
  return <Link className="logo" to={to} onClick={onClick} aria-label="SYSTEM 84 — página inicial"><Logo compact={compact} /></Link>
}
