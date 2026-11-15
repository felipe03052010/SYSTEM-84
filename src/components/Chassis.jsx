import { Link, useLocation } from 'react-router-dom'
import { records } from '../data/records'
import { playClick } from '../utils/audio'
import '../styles/dossie.css'
import { ICONS, glyphKey } from './glyphs'
import { Monogram } from './Logo'

/**
 * Chassi do dossiê visual.
 *
 * As treze pranchas do dossiê "SYSTEM 84 — Dossiê Visual Unificado" usam
 * sempre a mesma moldura: barra de abertura com o monograma [84], três
 * colunas de texto de arquivo à direita; um fio de 1px; o conteúdo; outro
 * fio; e um rodapé em três partes — "VOL. 084" | seções | número da página.
 *
 * Estes componentes desenham essa moldura e os elementos que aparecem em
 * todas as pranchas: marcador de seção, objeto óptico (globo de arame com
 * órbita laranja), painéis, selos de status e o repertório geométrico de
 * ícones das obras.
 */

const pad = (value) => String(value).padStart(3, '0')
const pad2 = (value) => String(value).padStart(2, '0')

const SECTIONS = [
  { label: 'IDENTIDADE', to: '/' },
  { label: 'CATÁLOGO', to: '/pesquisa' },
  { label: 'ACERVO', to: '/filmes' },
  { label: 'COMUNIDADE', to: '/comunidade' },
]

export function countOf(type) {
  return records.filter((record) => record.type === type).length
}

export function yearOf(record) {
  const source = `${record.year || ''} ${record.meta || ''} ${record.origin || ''}`
  const match = source.match(/\b(-?\d{3,4})\b/)
  return match ? match[1] : 'S/D'
}

export function typeLabel(record) {
  if (record.type === 'livro') return 'LIVRO'
  if (record.type === 'série') return 'SÉRIE'
  if (record.type === 'lost-media') return 'LOST MEDIA'
  return 'FILME'
}

export function collectionOf(record) {
  if (record.type === 'livro') return '/livros'
  if (record.type === 'série') return '/series'
  if (record.type === 'lost-media') return '/lost-media'
  return '/filmes'
}

/* ── Treliça de arame: o traço fino verde que preenche as figuras ───────── */

export function WireGlobe({ className = '' }) {
  return (
    <svg className={`wire-globe ${className}`} viewBox="0 0 400 400" role="img" aria-label="Esfera de arame com órbita laranja">
      <defs>
        <clipPath id="wg-clip">
          <circle cx="200" cy="200" r="150" />
        </clipPath>
      </defs>
      <g fill="none" stroke="var(--fig-acid)" strokeWidth="1.2">
        <circle cx="200" cy="200" r="150" />
        <ellipse cx="200" cy="200" rx="58" ry="150" />
        <ellipse cx="200" cy="200" rx="108" ry="150" />
        <g clipPath="url(#wg-clip)">
          <ellipse cx="200" cy="200" rx="150" ry="46" />
          <ellipse cx="200" cy="200" rx="150" ry="92" />
          <ellipse cx="200" cy="200" rx="150" ry="130" />
        </g>
      </g>
      <ellipse
        cx="200"
        cy="200"
        rx="192"
        ry="66"
        fill="none"
        stroke="var(--fig-ember)"
        strokeWidth="9"
        transform="rotate(-18 200 200)"
      />
    </svg>
  )
}

/* ── Marcadores de canto: [ e ] técnicos usados no herói do dossiê ──────── */

export function FrameMarks() {
  return (
    <span className="frame-marks" aria-hidden="true">
      <i className="fm-tl" />
      <i className="fm-tr" />
      <i className="fm-bl" />
      <i className="fm-br" />
    </span>
  )
}

/* ── Abertura: monograma, título e as três linhas de arquivo ────────────── */

const ARCHIVE_LINES = {
  '/': ['ARQUIVO CULTURAL / ACERVO + CATÁLOGO', 'IDENTIDADE + SISTEMA', 'REDESIGN UNIFICADO'],
  '/filmes': ['ARQUIVO CULTURAL / CINEMA', 'ACERVO + CATÁLOGO', 'REDESIGN UNIFICADO'],
  '/series': ['ARQUIVO CULTURAL / SÉRIES', 'ACERVO + CATÁLOGO', 'REDESIGN UNIFICADO'],
  '/livros': ['ARQUIVO CULTURAL / LITERATURA', 'ACERVO + CATÁLOGO', 'REDESIGN UNIFICADO'],
  '/lost-media': ['ARQUIVO CULTURAL / PRESERVAÇÃO', 'DOSSIÊS + RECUPERAÇÃO', 'REDESIGN UNIFICADO'],
  '/pesquisa': ['ARQUIVO CULTURAL / BUSCA', 'ACERVO + CATÁLOGO', 'REDESIGN UNIFICADO'],
  '/comunidade': ['ARQUIVO CULTURAL / COMUNIDADE', 'MURAL + ENVIOS', 'REDESIGN UNIFICADO'],
}

export function DossierMasthead() {
  const { pathname } = useLocation()
  const lines = ARCHIVE_LINES[pathname] || ['ARQUIVO CULTURAL / ACERVO', 'IDENTIDADE + SISTEMA', 'REDESIGN UNIFICADO']

  return (
    <div className="dossier-masthead">
      <Link to="/" className="brand-block" onClick={playClick} aria-label="SYSTEM 84 — página inicial">
        <Monogram className="brand-monogram" />
        <span className="brand-rule" aria-hidden="true" />
        <span className="brand-name">
          <strong>SYSTEM 84</strong>
          <em>DOSSIÊ VISUAL UNIFICADO</em>
        </span>
      </Link>

      <div className="archive-lines">
        <span className="archive-slashes" aria-hidden="true">///</span>
        <div>
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Rodapé: VOL. 084 | título | seções | número da página ──────────────── */

export function DossierFooter({ page, total, title = 'SYSTEM 84 — REDESIGN UNIFICADO' }) {
  return (
    <footer className="dossier-footer">
      <span className="df-vol">VOL. 084</span>
      <span className="df-rule" aria-hidden="true" />
      <span className="df-title">{title}</span>
      <nav className="df-sections" aria-label="Seções do arquivo">
        {SECTIONS.map((section, index) => (
          <span key={section.label}>
            {index > 0 && <i aria-hidden="true">/</i>}
            <Link to={section.to} onClick={playClick}>{section.label}</Link>
          </span>
        ))}
      </nav>
      <span className="df-rule" aria-hidden="true" />
      <span className="df-page">{total ? `${pad(page)}/${pad(total)}` : pad(page)}</span>
    </footer>
  )
}

/* ── Marcador: quadrado ácido + rótulo de seção ─────────────────────────── */

export function SectionMark({ children, tone = 'acid' }) {
  return (
    <p className={`dossier-mark tone-${tone}`}>
      <i aria-hidden="true" />
      {children}
    </p>
  )
}

/* ── Painel com título: 1px, cabeçalho colorido, corpo ──────────────────── */

export function Panel({ title, tone = 'ember', children, className = '', aside }) {
  return (
    <section className={`dossier-panel tone-${tone} ${className}`}>
      {title && (
        <header className="panel-head">
          <span>{title}</span>
          {aside}
        </header>
      )}
      <div className="panel-body">{children}</div>
    </section>
  )
}

/* ── Selo: verde recuperada, papel parcial, laranja desaparecida ────────── */

const STATUS_TONES = {
  recuperada: 'ok',
  recuperado: 'ok',
  disponível: 'ok',
  disponivel: 'ok',
  disponivel_presenca: 'ok',
  fragmentária: 'warn',
  fragmentaria: 'warn',
  parcial: 'warn',
  incompleto: 'warn',
  desaparecida: 'gone',
  desaparecido: 'gone',
  perdida: 'gone',
  perdido: 'gone',
}

export function StatusSeal({ status, children }) {
  const key = String(status || '').toLowerCase()
  const tone = Object.entries(STATUS_TONES).find(([needle]) => key.includes(needle))?.[1] || 'warn'
  return <span className={`status-seal seal-${tone}`}>{children || status}</span>
}

/* ── Rótulos de metadados: TIPO / ANO / ORIGEM / FORMATO ────────────────── */

export function MetaPills({ items }) {
  return (
    <div className="meta-pills">
      {items.filter(Boolean).map(([key, value]) => (
        <span key={key}>
          <i>{key}</i>
          {value}
        </span>
      ))}
    </div>
  )
}

/* ── Glifos dos itens: formas geométricas, marcas, pistas ──────────────── */

export function glyphFor(record) {
  return { id: glyphKey(record) }
}

/** Ícone geométrico da obra, no sistem tipo de 112×112 do dossiê. */
export function ItemGlyph({ record, size = 96, tone = 'acid' }) {
  const key = glyphKey(record)
  return (
    <svg
      className={`item-glyph ig tone-${tone}`}
      viewBox="0 0 112 112"
      width={size}
      height={size}
      fill="none"
      strokeWidth="2.6"
      strokeLinejoin="miter"
      strokeLinecap="square"
      aria-hidden="true"
      data-glyph={key}
      dangerouslySetInnerHTML={{ __html: ICONS[key] }}
    />
  )
}

/* ── Ícones de interface: mesma gramática de 1px, sem preenchimento ────── */

const UI = {
  home: <><path d="M10 34 32 14l22 20" /><path d="M16 30v26h32V30" /><path d="M27 56V42h10v14" /></>,
  archive: <><path d="M8 24h18l6 8h24v26H8Z" /><path d="M8 38h48" /></>,
  lost: <><path d="M12 20h30v34H12Z" /><path d="M26 30h2M26 38h2M26 44h2" /><circle cx="42" cy="18" r="9" /></>,
  people: <><circle cx="24" cy="24" r="9" /><path d="M8 52c0-10 7-16 16-16s16 6 16 16" /><circle cx="44" cy="28" r="6" /><path d="M46 52c0-7 4-11 10-11s8 4 8 11" /></>,
  upload: <><path d="M24 52V20" /><path d="M14 30 24 20l10 10" /><path d="M8 44v12h32V44" /></>,
  search: <><circle cx="24" cy="24" r="12" /><path d="m33 33 11 11" /></>,
  user: <><circle cx="24" cy="20" r="9" /><path d="M8 54c0-11 7-17 16-17s16 6 16 17" /></>,
  admin: <><path d="M24 12c8 0 12 4 12 4v12c0 10-5 16-12 20-7-4-12-10-12-20V16s4-4 12-4Z" /><path d="m18 30 4 4 8-9" /></>,
  book: <><path d="M24 16c-6-4-12-4-16-3v30c4-1 10-1 16 3 6-4 12-4 16-3V13c-4-1-10-1-16 3Z" /><path d="M24 16v30" /></>,
  film: <><rect x="8" y="14" width="32" height="32" /><path d="M8 24h32M8 36h32M18 14v32M30 14v32" /></>,
  list: <><path d="M8 18h32M8 30h32M8 42h32" /><circle cx="14" cy="18" r="1.5" /><circle cx="14" cy="30" r="1.5" /><circle cx="14" cy="42" r="1.5" /></>,
  eye: <><path d="M6 28c8-10 12-14 18-14s10 4 18 14c-8 10-12 14-18 14S14 38 6 28Z" /><circle cx="24" cy="28" r="7" /></>,
  star: <><path d="m24 10 5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8 12-2Z" /></>,
  loop: <><path d="M10 28a14 14 0 0 1 24-9" /><path d="M38 28a14 14 0 0 1-24 9" /><path d="M34 10v9h-9M14 46v-9h9" /></>,
  play: <><path d="M14 12v32l24-16Z" /></>,
  previous: <><path d="M14 12v32" /><path d="M36 12 18 28l18 16Z" /></>,
  next: <><path d="M34 12v32" /><path d="M12 12l18 16-18 16Z" /></>,
  lock: <><rect x="12" y="24" width="24" height="20" /><path d="M18 24v-6a6 6 0 0 1 12 0v6" /></>,
  globe: <><circle cx="24" cy="28" r="14" /><ellipse cx="24" cy="28" rx="6" ry="14" /><path d="M10 28h28" /></>,
}

export function UiIcon({ name, size = 22 }) {
  return (
    <svg className="ui-icon" viewBox="0 0 48 56" width={size} height={size * (56 / 48)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" strokeLinecap="square" aria-hidden="true">
      {UI[name] || UI.archive}
    </svg>
  )
}

/* ── Contadores: FILMES / SÉRIES / LIVROS / LOST MEDIA ─────────────────── */

const COUNTER_GLYPH = {
  film: <><circle cx="36" cy="36" r="26" /><circle cx="27" cy="27" r="5" /><circle cx="45" cy="27" r="5" /><circle cx="27" cy="45" r="5" /><circle cx="45" cy="45" r="5" /><circle cx="36" cy="36" r="5" /></>,
  serie: <><rect x="10" y="22" width="40" height="30" /><rect x="18" y="14" width="40" height="30" /><path d="M18 34h40" /></>,
  livro: <><path d="M36 22c-8-5-16-5-22-4v34c6-1 14-1 22 4 8-5 16-5 22-4V18c-6-1-14-1-22 4Z" /><path d="M36 22v34" /></>,
  lost: <><path d="M22 26h12M56 26h-6" /><rect x="28" y="18" width="18" height="26" /><path d="M34 30h6M34 38h6" /></>,
}

export function CounterGlyph({ kind }) {
  return (
    <svg className="counter-glyph" viewBox="0 0 72 72" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" strokeLinecap="square" aria-hidden="true">
      {COUNTER_GLYPH[kind] || COUNTER_GLYPH.livro}
    </svg>
  )
}

const COUNTERS = [
  { kind: 'film', label: 'FILMES', type: 'filme', to: '/filmes' },
  { kind: 'serie', label: 'SÉRIES', type: 'série', to: '/series' },
  { kind: 'livro', label: 'LIVROS', type: 'livro', to: '/livros' },
  { kind: 'lost', label: 'LOST MEDIA', type: 'lost-media', to: '/lost-media' },
]

export function DossierCounters() {
  return (
    <div className="dossier-counters">
      {COUNTERS.map((counter) => (
        <Link key={counter.type} to={counter.to} className="counter-cell" onClick={playClick}>
          <strong>{pad2(countOf(counter.type))}</strong>
          <span>{counter.label}</span>
          <CounterGlyph kind={counter.kind} />
        </Link>
      ))}
    </div>
  )
}

export { pad, pad2 }
