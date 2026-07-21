import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = ['About', 'Portfolio', 'Services', 'Testimonials', 'Blog', 'Contact']
const ACTIVE = 'About'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // lock page scroll while the drawer is open
  useEffect(() => {
    document.documentElement.classList.toggle('nav-drawer-open', open)
    return () => document.documentElement.classList.remove('nav-drawer-open')
  }, [open])

  return (
    <header className="navbar">
      <a className="nav-logo" href="/" aria-label="Brand Esense — home">
        <img src="/logo/logo_outline.svg" alt="Brand Esense" draggable="false" />
      </a>

      {/* desktop links */}
      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className={label === ACTIVE ? 'nav-link is-active' : 'nav-link'}
          >
            {label}
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
            {LINKS.map((label, i) => (
              <motion.a
                key={label}
                href={`#${label.toLowerCase()}`}
                className={label === ACTIVE ? 'nav-drawer-link is-active' : 'nav-drawer-link'}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                {label}
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
