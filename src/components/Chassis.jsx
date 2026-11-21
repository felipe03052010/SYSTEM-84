import { Link, useLocation } from 'react-router-dom'
import { records } from '../data/records'
import { playClick } from '../utils/audio'
import { TAPE_GLYPHS, TAPE_GLYPH_BY_ID } from './tapeGlyphs.jsx'
import { ANALOG_YOUTUBE_GLYPHS } from './analogYoutubeGlyphs.jsx'
import '../styles/dossie.css'

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
  { label: 'INÍCIO', to: '/' },
  { label: 'CATÁLOGO', to: '/pesquisa' },
  { label: 'LINHA DO TEMPO', to: '/linha-do-tempo' },
  { label: 'COMUNIDADE', to: '/comunidade' },
  { label: 'SOBRE', to: '/sobre' },
]

export function countOf(type) {
  return records.filter((record) => record.type === type).length
}

export function yearOf(record) {
  if (Number.isFinite(record?.year)) return record.year < 0 ? `${Math.abs(record.year)} a.C.` : String(record.year)
  const source = `${record.year || ''} ${record.meta || ''} ${record.origin || ''}`
  const match = source.match(/\b(-?\d{3,4})\b/)
  return match ? match[1] : 'S/D'
}

const TYPE_LABELS = {
  livro: 'LIVRO',
  'série': 'SÉRIE',
  'lost-media': 'LOST MEDIA',
  'analog-horror': 'ANALOG HORROR',
  arg: 'ARG',
  filme: 'FILME',
}

const TYPE_PATHS = {
  livro: '/livros',
  'série': '/series',
  'lost-media': '/lost-media',
  'analog-horror': '/analog-horror',
  arg: '/arg',
  filme: '/filmes',
}

export function typeLabel(record) {
  return TYPE_LABELS[record.type] || 'FILME'
}

export function collectionOf(record) {
  return TYPE_PATHS[record.type] || '/filmes'
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
  '/': ['ARQUIVO CULTURAL / ACERVO + CATÁLOGO', 'CINEMA + LITERATURA + TV', 'SINAL ONLINE'],
  '/filmes': ['ARQUIVO CULTURAL / CINEMA', 'DO MUDO AO DIGITAL', 'PLAYER INTERNO'],
  '/series': ['ARQUIVO CULTURAL / SÉRIES', 'SERIADOS E CAPÍTULOS', 'PLAYER INTERNO'],
  '/livros': ['ARQUIVO CULTURAL / LITERATURA', 'TEXTO INTEGRAL', 'LEITOR INTERNO'],
  '/lost-media': ['ARQUIVO CULTURAL / PRESERVAÇÃO', 'DOSSIÊS + RECUPERAÇÃO', 'INVESTIGAÇÃO ABERTA'],
  '/analog-horror': ['ARQUIVO CULTURAL / FITAS', 'EPISÓDIOS DOS CRIADORES', 'NÃO OLHE PELA JANELA'],
  '/arg': ['ARQUIVO CULTURAL / ENIGMAS', 'JOGO DE REALIDADE ALTERNATIVA', 'EPISÓDIOS PUBLICADOS'],
  '/linha-do-tempo': ['ARQUIVO CULTURAL / CRONOLOGIA', 'DA ANTIGUIDADE A HOJE', 'ACERVO ORDENADO'],
  '/sobre': ['ARQUIVO CULTURAL / O PROJETO', 'MISSÃO + PLANOS', 'TRANSPARÊNCIA'],
  '/pesquisa': ['ARQUIVO CULTURAL / BUSCA', 'ACERVO + CATÁLOGO', 'CONSULTA EM TEMPO REAL'],
  '/comunidade': ['ARQUIVO CULTURAL / COMUNIDADE', 'MURAL + ENVIOS', 'BBS 84.7'],
  '/enviar': ['ARQUIVO CULTURAL / CONTRIBUIÇÃO', 'ENVIO + MODERAÇÃO', 'NOVO REGISTRO'],
}

export function DossierMasthead() {
  const { pathname } = useLocation()
  const lines = ARCHIVE_LINES[pathname] || ['ARQUIVO CULTURAL / REGISTRO', 'FICHA + FONTE + LICENÇA', 'SINAL ONLINE']

  return (
    <div className="dossier-masthead">
      <Link to="/" className="brand-block" onClick={playClick} aria-label="SYSTEM 84 — página inicial">
        <span className="brand-bracket" aria-hidden="true">
          <span className="brand-grid" />
          <span className="brand-digits">84</span>
        </span>
        <span className="brand-rule" aria-hidden="true" />
        <span className="brand-name">
          <strong>SYSTEM 84</strong>
          <em>ARQUIVO DE MEMÓRIA CULTURAL</em>
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

export function DossierFooter({ page, total, title = 'SYSTEM 84 — ARQUIVO DE MEMÓRIA CULTURAL' }) {
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

const EYE = (
  <>
    <path d="M56 9 96 32v48L56 103 16 80V32Z" />
    <ellipse cx="56" cy="54" rx="22" ry="11" />
    <circle cx="56" cy="54" r="6" />
    <path d="M56 70v16M50 86l6 6 6-6" />
  </>
)

const BOLT = (
  <>
    <path d="M44 14h30v70H44Z" />
    <path d="M44 50h30M56 14v70" />
    <path d="M14 84h90M14 96h90" />
    <path d="m64 20-12 34h12l-8 32 24-44H68Z" fill="var(--fig-paper)" stroke="none" />
  </>
)

const FACE = (
  <>
    <path d="M36 22h44v62H36Z" />
    <path d="M28 40h-8v22h8M88 40h8v22h-8" />
    <path d="M30 40h-14M96 40H82M30 62h-14M96 62H82" />
    <path d="M48 38h7M61 38h7" />
    <path d="M56 74h10" />
  </>
)

const HOOD = (
  <>
    <circle cx="56" cy="56" r="34" />
    <path d="M56 6v14M56 92v14M6 56h14M92 56h14" />
    <path d="M56 30c14 0 22 11 22 24v30H34V54c0-13 8-24 22-24Z" />
    <path d="M44 56h7M61 56h7" />
  </>
)

const BAT = (
  <>
    <path d="M56 20c-14 0-22 8-22 16 0 8 6 12 12 12 4 0 7-3 10-8 3 5 6 8 10 8 6 0 12-4 12-12 0-8-8-16-22-16Z" />
    <path d="M24 18 40 34M88 18 72 34" />
    <path d="M20 26c-8 6-10 20-6 34l14-8M92 26c8 6 10 20 6 34l-14-8" />
    <circle cx="56" cy="24" r="4" fill="var(--fig-paper)" stroke="none" />
  </>
)

const KEYHOLE = (
  <>
    <path d="M32 30v52h48V30Z" />
    <path d="M32 82c0 16 10 24 24 24s24-8 24-24" />
    <circle cx="56" cy="50" r="12" />
    <path d="M56 62v14" />
    <path d="M24 30h-8M96 30h-8" />
  </>
)

const ROCKET = (
  <>
    <path d="M56 10c16 14 24 34 24 54v26H32V64c0-20 8-40 24-54Z" />
    <circle cx="56" cy="52" r="10" />
    <path d="M32 72 18 90l14-4M80 72l14 18-14-4" />
    <path d="M48 94l8 12 8-12" />
    <path d="M40 24c-8-6-14-10-20-10M72 24c8-6 14-10 20-10" />
  </>
)

const DOSSIER = (
  <>
    <path d="M18 32h28l8 12h44v60H18Z" />
    <path d="M12 46h28l8 12h44v60H12Z" />
    <path d="M30 76h8M82 76h-8" />
    <rect x="46" y="66" width="20" height="24" />
    <path d="M52 76h8" />
  </>
)

const EYE84 = (
  <>
    <path d="M14 56c14-18 28-26 42-26s28 8 42 26c-14 18-28 26-42 26S28 74 14 56Z" />
    <circle cx="56" cy="56" r="14" />
    <circle cx="56" cy="56" r="5" fill="var(--fig-ember)" stroke="none" />
  </>
)

const LOCK = (
  <>
    <rect x="34" y="50" width="44" height="36" />
    <path d="M42 50V38c0-16 28-16 28 0v12" />
    <circle cx="56" cy="66" r="4" />
    <path d="M56 70v8" />
  </>
)

const WHALE = (
  <>
    <path d="M20 64c14-14 30-18 46-12l30-8-12 20 12 20-30-8c-16 6-32 2-46-12Z" />
    <path d="M20 64h-8l6-6-6-6h8" />
    <circle cx="40" cy="58" r="2.5" fill="var(--fig-paper)" stroke="none" />
  </>
)

const PIPE = (
  <>
    <path d="M56 18c14 0 24 10 24 24 0 12-6 18-6 30v10H38V72c0-12-6-18-6-30 0-14 10-24 24-24Z" />
    <path d="M38 82h36" />
    <path d="M34 40h-8M78 40h8" />
    <circle cx="48" cy="46" r="2.5" fill="var(--fig-paper)" stroke="none" />
    <circle cx="64" cy="46" r="2.5" fill="var(--fig-paper)" stroke="none" />
  </>
)

const MIRROR = (
  <>
    <rect x="28" y="14" width="56" height="72" />
    <rect x="38" y="24" width="36" height="52" />
    <path d="M38 76h36" />
    <path d="M22 92h68M30 98h52" />
  </>
)

const CLOCK = (
  <>
    <circle cx="56" cy="56" r="30" />
    <path d="M56 34v22l16 10" />
    <path d="M12 56h-6M106 56h-6" />
    <ellipse cx="56" cy="56" rx="46" ry="12" />
  </>
)

const CROWN = (
  <>
    <path d="M30 78h52" />
    <path d="M34 78V44M78 78V44" />
    <path d="M30 44h52" />
    <path d="M22 36c8-6 14-6 22 0M68 36c8-6 14-6 22 0" />
    <path d="M56 30v-8" />
  </>
)

const PIG = (
  <>
    <path d="M28 42h56v34H28Z" />
    <path d="M34 42V26l14 12M78 42V26L64 38" />
    <circle cx="44" cy="58" r="3" fill="var(--fig-paper)" stroke="none" />
    <circle cx="68" cy="58" r="3" fill="var(--fig-paper)" stroke="none" />
    <path d="M50 68h12" />
  </>
)

const SKULL = (
  <>
    <path d="M26 52c0-20 14-32 30-32s30 12 30 32v18l-10 6v14H36V76l-10-6Z" />
    <circle cx="44" cy="54" r="5" />
    <circle cx="68" cy="54" r="5" />
    <path d="M50 74h12M48 82h16" />
  </>
)

const TOOLBOX = (
  <>
    <rect x="22" y="42" width="68" height="34" />
    <path d="M22 54h68" />
    <rect x="46" y="18" width="20" height="14" />
    <path d="M34 42V30h44v12" />
    <circle cx="36" cy="76" r="4" />
    <circle cx="76" cy="76" r="4" />
  </>
)

const TELESCOPE = (
  <>
    <path d="M26 66 74 22l16 14-44 44Z" />
    <path d="M42 78 34 96M64 56l14 18M46 44l10 10" />
    <path d="M78 18l10 10" />
  </>
)

const SPIRAL = (
  <>
    <path d="M56 26c16 0 30 13 30 30S72 86 56 86 26 73 26 56s13-30 30-30" />
    <path d="M56 40c9 0 16 7 16 16s-7 16-16 16-16-7-16-16" />
    <circle cx="56" cy="56" r="4" fill="var(--fig-paper)" stroke="none" />
    <path d="M56 14v8M56 90v8M14 56h8M90 56h8" />
  </>
)

const TV = (
  <>
    <rect x="18" y="30" width="76" height="56" />
    <rect x="26" y="38" width="48" height="40" />
    <path d="M40 30 56 14l16 16" />
    <path d="M82 44v4M82 56v4M82 68v4" />
    <path d="M30 52h12M50 62h18M34 70h8" />
    <path d="M28 86v8M84 86v8" />
  </>
)

const CIPHER = (
  <>
    <circle cx="56" cy="56" r="38" />
    <circle cx="56" cy="56" r="24" />
    <path d="M56 18v10M56 84v10M18 56h10M84 56h10M29 29l7 7M76 76l7 7M83 29l-7 7M29 83l7-7" />
    <rect x="48" y="46" width="16" height="20" />
    <path d="M52 46v-6a4 4 0 0 1 8 0v6" />
  </>
)

const BOOK_OPEN = (
  <>
    <path d="M56 30c-12-8-26-8-38-5v58c12-3 26-3 38 5 12-8 26-8 38-5V25c-12-3-26-3-38 5Z" />
    <path d="M56 30v58" />
    <path d="M28 42h18M28 52h18M28 62h14M66 42h18M66 52h18M66 62h12" />
  </>
)

/* Selo único por obra: emblema de arquivo gerado deterministicamente a
   partir de tipo+id+título. Cada item do catálogo recebe uma marca própria
   na mesma gramática de arame 1px do dossiê, sem SVG arbitrário do cliente. */
function sigilFor(record) {
  const seed = `${record?.type || ''}:${record?.id ?? ''}:${record?.title || ''}`
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  const pick = (n) => {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0
    return h % n
  }

  const frames = [
    <circle key="f" cx="56" cy="56" r="36" />,
    <rect key="f" x="20" y="20" width="72" height="72" />,
    <path key="f" d="M56 16l40 40-40 40-40-40Z" />,
    <path key="f" d="M56 14l34 20v44l-34 20-34-20V34Z" />,
    <g key="f"><circle cx="56" cy="56" r="36" /><circle cx="56" cy="56" r="27" /></g>,
  ]
  const marks = [
    <circle key="m" cx="56" cy="56" r="7" />,
    <rect key="m" x="47" y="47" width="18" height="18" />,
    <path key="m" d="M56 45l11 11-11 11-11-11Z" />,
    <path key="m" d="M44 56h24M56 44v24" />,
    <path key="m" d="M46 60v-8M56 60V48M66 60v-8" />,
    <path key="m" d="M46 52l20 8M66 52l-20 8" />,
    <g key="m"><circle cx="50" cy="50" r="2.4" /><circle cx="62" cy="50" r="2.4" /><circle cx="50" cy="62" r="2.4" /><circle cx="62" cy="62" r="2.4" /></g>,
    <path key="m" d="M48 56c0-9 16-9 16 0s-16 9-16 0Z" />,
  ]
  const tickSets = [
    <path key="t" d="M56 12v10M56 90v10M12 56h10M90 56h10" />,
    <path key="t" d="M56 14v8M56 90v8" />,
    <path key="t" d="M14 56h8M90 56h8" />,
    <path key="t" d="M30 20l6 6M82 86l6 6M82 20l-6 6M30 86l6-6" />,
  ]
  const accents = [
    <circle key="a" cx="86" cy="26" r="4" fill="var(--fig-ember)" stroke="none" />,
    <path key="a" d="M82 22h8M82 30h8" stroke="var(--fig-ember)" strokeWidth="3" />,
    <rect key="a" x="80" y="20" width="9" height="9" fill="var(--fig-ember)" stroke="none" />,
    <path key="a" d="M78 28l10-10" stroke="var(--fig-ember)" strokeWidth="3" />,
  ]

  const rot = pick(8) * 45
  const pos = pick(9)
  const fi = pick(frames.length)
  const mi = pick(marks.length)
  const ti = pick(tickSets.length)
  const ai = pick(accents.length)
  const dx = (pos % 3 - 1) * 9
  const dy = (Math.floor(pos / 3) - 1) * 9
  const id = `sigil-${h.toString(36)}`
  /* Código serial: 8 entalhes (curto/longo) derivados do hash do registro.
     Com ele, dois itens do catálogo nunca compartilham a mesma marca. */
  const serial = pick(256)
  const serialMark = (
    <path
      key="s"
      d={Array.from({ length: 8 }, (_, i) => `M${30 + i * 7} 101v${(serial >> i) & 1 ? -7 : -3}`).join('')}
      strokeWidth="1.6"
      opacity="0.75"
    />
  )
  const svg = (
    <>
      {frames[fi]}
      <g transform={`translate(${dx} ${dy}) rotate(${rot} 56 56)`}>{marks[mi]}</g>
      {tickSets[ti]}
      {accents[ai]}
      {serialMark}
    </>
  )
  return { id, svg }
}

const paper = '#ebeddf'
const orange = '#ff6332'
const dossierArt = [
  [/nosferatu/i, <><path d="M56 5 94 27v58l-38 22-38-22V27Z" stroke={orange}/><path d="m56 16 29 17v46L56 96 27 79V33Z"/><path d="M32 49q24-24 48 0-24 23-48 0Z" fill={paper} stroke="none"/><circle cx="56" cy="49" r="9" fill="#090d0b" stroke="none"/><path d="M56 60v24m-10-12 10-11 10 11"/></>],
  [/metr[oó]polis/i, <><path d="M4 99h104M10 98V57h17v41m1 0V37h17v61m4 0V12h19v86m5 0V30h14v68m4 0V49h12v49" stroke={orange}/><circle cx="56" cy="57" r="37" strokeWidth="0.8"/><path d="M51 17h18L59 44h23L42 97l11-38H32Z" fill={paper} stroke="none"/></>],
  [/frankenstein/i, <><rect x="12" y="12" width="88" height="88" strokeWidth="1"/><path d="M29 86V41q0-23 27-23t27 23v45M29 49h54m-45-7h7m22 0h7M52 57l-5 13h17m-21 10h28" stroke={paper}/><path d="M56 5v18m0 65v19M6 56h28m44 0h28" stroke={orange}/></>],
  [/phantom creeps/i, <>{[25,36,46].map(r=><circle key={r} cx="56" cy="56" r={r} strokeWidth="0.8"/>)}<path d="M2 56h108M56 2v108" strokeWidth="0.8"/><path d="m35 44 21-17 21 17v40L56 73 35 84Z" fill={orange} stroke="none"/><path d="M42 52h8m12 0h8" stroke="#090d0b" strokeWidth="4"/></>],
  [/dr[aá]cula/i, <><path d="M5 51Q27 24 54 30q33-7 53 21-32-3-51 50Q35 59 5 51Z" stroke={orange}/><path d="M42 28q9-20 26-11v37l-8 12H48l-3-13-6-5 5-3Z" fill={paper}/></>],
  [/alice.*maravilhas/i, <><path d="M29 99V60a27 27 0 0154 0v39M56 6v14M21 20l9 12M5 50l15 4m72 0 15-4M82 32l9-12"/><circle cx="56" cy="54" r="10" fill={paper} stroke="none"/><path d="m52 61-7 27h22l-7-27Z" fill={paper} stroke="none"/></>],
  [/flash gordon/i, <><ellipse cx="55" cy="61" rx="50" ry="16" transform="rotate(-24 55 61)"/><path d="M40 73q8-41 39-66 8 39-14 74l-10-10Z" fill={orange} stroke="none"/><circle cx="70" cy="29" r="4" fill="#090d0b" stroke="none"/><path d="m45 78-9 24m16-22-7 20" stroke={orange}/></>],
]

export function glyphFor(record) {
  const artwork = dossierArt.find(([title]) => title.test(record?.title || ''))
  if (artwork) return { id: 'dossier-' + record.id, svg: artwork[1] }
  if (record?.glyph && ANALOG_YOUTUBE_GLYPHS[record.glyph]) return { id: record.glyph, svg: ANALOG_YOUTUBE_GLYPHS[record.glyph] }
  if (record?.glyph && TAPE_GLYPHS[record.glyph]) return { id: record.glyph, svg: TAPE_GLYPHS[record.glyph] }
  if (record?.type === 'analog-horror') {
    const byId = TAPE_GLYPH_BY_ID[record.id]
    if (byId && TAPE_GLYPHS[byId]) return { id: byId, svg: TAPE_GLYPHS[byId] }
  }
  return sigilFor(record)
}

/** Ícone geométrico da obra, no sistem tipo de 112×112 do dossiê. */
export function ItemGlyph({ record, size = 96, tone = 'acid' }) {
  const glyph = glyphFor(record)
  return (
    <svg
      className={`item-glyph tone-${tone}`}
      viewBox="0 0 112 112"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="miter"
      strokeLinecap="square"
      aria-hidden="true"
      data-glyph={glyph.id}
    >
      {glyph.svg}
      {Number.isSafeInteger(record?.id) && (
        <path stroke="#a8ff60" strokeWidth="2" opacity=".85"
          d={record.id.toString(2).split('').map((bit, i) =>
            `M${9 + i * 4} 110v${bit === '1' ? -5 : -2}`
          ).join(' ')}
        />
      )}
    </svg>
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
  power: <><path d="M24 10v18" /><path d="M14 18a15 15 0 1 0 20 0" /></>,
  tape: <><rect x="6" y="16" width="36" height="26" /><circle cx="16" cy="29" r="5" /><circle cx="32" cy="29" r="5" /><path d="M16 34h16" /></>,
  clock: <><circle cx="24" cy="28" r="16" /><path d="M24 18v10l7 5" /></>,
  key: <><circle cx="16" cy="28" r="8" /><path d="M24 28h20M38 28v8M44 28v6" /></>,
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
  tape: <><rect x="10" y="20" width="52" height="34" /><circle cx="24" cy="37" r="7" /><circle cx="48" cy="37" r="7" /><path d="M24 44h24" /></>,
  arg: <><circle cx="36" cy="36" r="22" /><rect x="29" y="32" width="14" height="14" /><path d="M32 32v-5a4 4 0 0 1 8 0v5" /></>,
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
  { kind: 'tape', label: 'ANALOG HORROR', type: 'analog-horror', to: '/analog-horror' },
  { kind: 'arg', label: 'ARQUIVOS ARG', type: 'arg', to: '/arg' },
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
