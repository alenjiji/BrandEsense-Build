const LINKS = ['Home', 'Works', 'Careers', 'Blog', 'Contact']

export default function Navbar() {
  return (
    <header className="navbar">
      <a className="nav-logo" href="/" aria-label="Brand Esense — home">
        <img src="/logo/logo_1.svg" alt="Brand Esense" draggable="false" />
      </a>
      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className={label === 'Home' ? 'nav-link is-active' : 'nav-link'}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}
