const LINKS = ['About', 'Portfolio', 'Services', 'Testimonials', 'Blog', 'Contact']
const ACTIVE = 'About'

export default function Navbar() {
  return (
    <header className="navbar">
      <a className="nav-logo" href="/" aria-label="Brand Esense — home">
        <img src="/logo/logo_outline.svg" alt="Brand Esense" draggable="false" />
      </a>
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
    </header>
  )
}
