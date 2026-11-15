import Header from './Header-v2'
import Footer from './Footer-v2'
import useRetroSoundscape from '../utils/useRetroSoundscape'

export default function Layout({ children, className = '' }) {
  useRetroSoundscape()

  return (
    <div className={`site-shell ${className}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
