import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Nav links → section targets. "Portfolio" covers three consecutive sections
// (showreel, works, hoardings), so it stays lit across all of them but scrolls
// to the first when clicked.
const LINKS = [
  { key: 'home', label: 'Home', target: 'home' },
  { key: 'clientele', label: 'Clientele', target: 'clientele' },
  { key: 'portfolio', label: 'Portfolio', target: 'portfolio' },
  { key: 'about', label: 'About Us', target: 'about' },
  { key: 'services', label: 'Services', target: 'services' },
  { key: 'testimonials', label: 'Testimonials', target: 'testimonials' },
  { key: 'contact', label: 'Contact Us', target: 'contact' },
]

// Every section in DOM order paired with the nav key it lights up. The footer
// keeps the last link lit rather than dropping the highlight entirely.
const SPY = [
  { id: 'home', nav: 'home' },
  { id: 'clientele', nav: 'clientele' },
  { id: 'portfolio', nav: 'portfolio' },
  { id: 'works', nav: 'portfolio' },
  { id: 'execution', nav: 'portfolio' },
  { id: 'about', nav: 'about' },
  { id: 'services', nav: 'services' },
  { id: 'testimonials', nav: 'testimonials' },
  { id: 'contact', nav: 'contact' },
]

// Sections with a dark background — the navbar flips to its light treatment
// while one of these sits under it.
const DARK = new Set(['portfolio', 'about', 'contact'])

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [dark, setDark] = useState(false)

  // lock page scroll while the drawer is open
  useEffect(() => {
    document.documentElement.classList.toggle('nav-drawer-open', open)
    return () => document.documentElement.classList.remove('nav-drawer-open')
  }, [open])

  // scroll-spy: which link is active, and whether we're over a dark section.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const spyLine = window.innerHeight * 0.35 // "you've arrived" line
      const topLine = 8 // just under the navbar, for the colour theme

      let nav = 'home'
      let overDark = false
      for (const s of SPY) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= spyLine) nav = s.nav // last section past the line wins
        if (r.top <= topLine && r.bottom > topLine) overDark = DARK.has(s.id)
      }
      setActive(nav)
      setDark(overDark)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const goTo = (e, target) => {
    e.preventDefault()
    setOpen(false)
    const el = document.getElementById(target)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar${dark ? ' nav-dark' : ''}`}>
      <a className="nav-logo" href="#home" aria-label="Brand Esense — home" onClick={(e) => goTo(e, 'home')}>
        <img src="/logo/logo_outline.svg" alt="Brand Esense" draggable="false" />
      </a>

      {/* desktop links */}
      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((l) => (
          <a
            key={l.key}
            href={`#${l.target}`}
            className={l.key === active ? 'nav-link is-active' : 'nav-link'}
            aria-current={l.key === active ? 'true' : undefined}
            onClick={(e) => goTo(e, l.target)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      {/* mobile burger */}
      <button
        className={`nav-burger${open ? ' is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav-drawer"
            aria-label="Primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.key}
                href={`#${l.target}`}
                className={l.key === active ? 'nav-drawer-link is-active' : 'nav-drawer-link'}
                onClick={(e) => goTo(e, l.target)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.p
              className="nav-drawer-tag"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Sense the Strategy, Drive the Results.
            </motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
