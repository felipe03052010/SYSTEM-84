import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, className = '' }) {
  return (
    <div className={`site-shell ${className}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
