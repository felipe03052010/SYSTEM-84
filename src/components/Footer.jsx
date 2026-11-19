import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  ['IDENTIDADE', '/sobre'],
  ['CATÁLOGO', '/pesquisa'],
  ['ACERVO', '/filmes'],
  ['COMUNIDADE', '/comunidade'],
]

export default function Footer() {
  return (
    <footer className="main-footer dossier-site-footer" aria-label="Rodapé do SYSTEM 84">
      <span className="footer-vol">VOL. 084</span>
      <span className="footer-rule" aria-hidden="true" />
      <span className="footer-title">SYSTEM 84 — REDESIGN UNIFICADO</span>

      <nav className="footer-nav" aria-label="Atalhos do rodapé">
        {FOOTER_LINKS.map(([label, to], index) => (
          <span key={label}>
            {index > 0 && <i aria-hidden="true">/</i>}
            <Link to={to}>{label}</Link>
          </span>
        ))}
      </nav>

      <span className="footer-rule" aria-hidden="true" />
      <span className="footer-page">ONLINE</span>
    </footer>
  )
}
