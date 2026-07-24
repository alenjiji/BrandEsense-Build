import useInView from '../hooks/useInView.js'
import { Reveal } from './reveal.jsx'

const SOCIALS = [
  { id: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
  { id: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
  { id: 'twitter', href: 'https://twitter.com', label: 'X (Twitter)' },
  { id: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
]

// Footer quick links. `target` is a section id; `null` marks a page that
// doesn't exist yet (Blogs) — the link renders but stays inert for now.
const QUICK_LINKS = [
  { label: 'Home', target: 'home' },
  { label: 'About Us', target: 'about' },
  { label: 'Portfolio', target: 'portfolio' },
  { label: 'Services', target: 'services' },
  { label: 'Blogs', target: null },
]

export default function Footer() {
  const [ref, seen] = useInView({ amount: 0.2 })

  const goTo = (e, target) => {
    e.preventDefault()
    if (!target) return // Blogs — page to be introduced later
    const el = document.getElementById(target)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer" id="contact" ref={ref}>
      <img
        className="footer-emblem"
        src="/video_section/brand_Essense_bg.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <div className="footer-grid">
        {/* brand column */}
        <Reveal className="footer-brand" active={seen} delay={0.05} y={24}>
          <img
            className="footer-logo"
            src="/logo/logo_outline_2.svg"
            alt="Brand Esense"
            loading="lazy"
            draggable="false"
          />
          <p className="footer-blurb">
            We sense the right strategy to harness your brand's full potential. 
            Let's author your brand's next great chapter, together. Give us a call today!
          </p>

          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a key={s.id} href={s.href} aria-label={s.label} target="_blank" rel="noreferrer" onClick={(e) => e.preventDefault()}>
                <img src={`/logo/socials/${s.id}.svg`} alt="" draggable="false" />
              </a>
            ))}
          </div>

          <p className="footer-copy">
            ©2026 | All rights reserved by
            <br />
            <strong>Brandesense</strong>
          </p>
        </Reveal>

        {/* information column */}
        <Reveal className="footer-col" active={seen} delay={0.18} y={24}>
          <h3 className="footer-col-title">Information</h3>
          <ul className="footer-links">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.target ? `#${l.target}` : '#'} onClick={(e) => goTo(e, l.target)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* contact column */}
        <Reveal className="footer-col" active={seen} delay={0.3} y={24}>
          <h3 className="footer-col-title">Contact Us</h3>
          <address className="footer-address">
            Brand Esense
            <br />
            Samthripthi Building
            <br />
            Near Anchumana Temple
            <br />
            Edappally, Kochi
            <br />
            Kerala
          </address>
          <a className="footer-phone" href="tel:+919895641221">
            +91 98956 41221
          </a>
          <a className="footer-email" href="mailto:info@brandesense.co.in">
            info@brandesense.co.in
          </a>
        </Reveal>
      </div>
    </footer>
  )
}
