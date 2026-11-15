import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { DossierFooter, DossierMasthead, FrameMarks, ItemGlyph, SectionMark } from '../components/Chassis'
import '../styles/figma.css'
import '../styles/dossie.css'

const ghost = { title: 'Dossiê lost media', type: 'lost-media' }

export default function NotFound() {
  return (
    <Layout className="dossie-page">
      <div className="dossier-frame">
        <DossierMasthead />

        <section className="prancha prancha-hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>ARQUIVO<br />NÃO<br />ENCONTRADO.</h1>
              <p className="hero-lead">
                O endereço consultado não consta no índice deste arquivo. O registro
                pode ter mudado de coleção, de número ou nunca ter existido.
              </p>
              <SectionMark tone="ember">ERRO 404 / DIRECTORY_NOT_FOUND</SectionMark>
              <div className="hero-actions">
                <Link to="/" className="fig-btn fig-btn-primary">RETORNAR AO SYSTEM 84 ↗</Link>
                <Link to="/pesquisa" className="fig-btn fig-btn-secondary">PESQUISAR NO ACERVO</Link>
              </div>
            </div>

            <figure className="hero-figure">
              <FrameMarks />
              <ItemGlyph record={ghost} size={220} tone="ember" />
              <figcaption>FIG. 404 — SINAL NÃO IDENTIFICADO</figcaption>
            </figure>
          </div>
        </section>

        <DossierFooter page={13} total={13} />
      </div>
    </Layout>
  )
}
