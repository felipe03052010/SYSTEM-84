import Header from './Header-v2'
import Footer from './Footer-v2'

export default function Layout({ children, className = '' }) {
  return (
    <div className={`site-shell ${className}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
