import { useEffect, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'

/* Blocos que entram em cena ao rolar a página. */
const REVEAL = '.prancha, .item-card, .record-card, .theme-card, .timeline-era, .counter-cell, .dossier-post, .recent-card, .signal-card, .about-steps li, .about-plans article, .fig-lost, .fig-community, .notes-item'

function useReveal(root) {
  useEffect(() => {
    const container = root.current
    if (!container || typeof IntersectionObserver === 'undefined') return undefined
    try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined } catch { /* sem matchMedia */ }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rv-in')
          observer.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 })

    const seen = new WeakSet()
    const register = () => {
      container.querySelectorAll(REVEAL).forEach((node) => {
        if (seen.has(node)) return
        seen.add(node)
        const siblings = node.parentElement ? [...node.parentElement.children].indexOf(node) : 0
        node.style.setProperty('--rv-delay', `${Math.min(siblings, 8) * 55}ms`)
        // O que já está visível na primeira pintura entra junto com a página.
        const rect = node.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) node.classList.add('rv', 'rv-in')
        else { node.classList.add('rv'); observer.observe(node) }
      })
    }
    register()
    // Filtros e buscas trocam os cartões: novos nós também precisam de revelação.
    const mutations = new MutationObserver(register)
    mutations.observe(container, { childList: true, subtree: true })
    return () => { observer.disconnect(); mutations.disconnect() }
  }, [root])
}

export default function Layout({ children, className = '' }) {
  const main = useRef(null)
  useReveal(main)

  return (
    <div className={`site-shell ${className}`}>
      <Header />
      <main ref={main}>{children}</main>
      <Footer />
    </div>
  )
}
