const SOCIALS = [
  { id: 'instagram', href: 'https://instagram.com', label: 'Instagram' },
  { id: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
  { id: 'twitter', href: 'https://twitter.com', label: 'X (Twitter)' },
  { id: 'linkedin', href: 'https://linkedin.com', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <img
        className="footer-emblem"
        src="/video_section/brand_Essense_bg.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <div className="footer-grid">
        {/* brand column */}
        <div className="footer-brand">
          <img
            className="footer-logo"
            src="/logo/logo_outline_2.svg"
            alt="Brand Esense"
            loading="lazy"
            draggable="false"
          />
          <p className="footer-blurb">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat.
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
        </div>

        {/* information column */}
        <div className="footer-col">
          <h3 className="footer-col-title">Information</h3>
          <p className="footer-col-body">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat.
          </p>
        </div>

        {/* contact column */}
        <div className="footer-col">
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
        </div>
      </div>
    </footer>
  )
}
