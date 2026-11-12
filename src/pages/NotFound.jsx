import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout>
      <section className="not-found">
        <span>ERRO 404 // DIRECTORY_NOT_FOUND</span>
        <h1>ARQUIVO NÃO ENCONTRADO<span className="blink">_</span></h1>
        <Link to="/">RETORNAR AO SYSTEM 84 &gt;</Link>
      </section>
    </Layout>
  )
}
