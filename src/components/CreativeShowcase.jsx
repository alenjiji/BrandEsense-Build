import { useState, useCallback, useEffect, useRef } from 'react'
import Heading from './Heading.jsx'

// Reusable coverflow gallery of creative posters for a single client.
// Feed it { heading, description, creatives } and it renders the full-screen
// section: display heading (left), the coverflow carousel (centre), the credit
// copy (right), framing arrows (reused brand graphics) and the controls.
export default function CreativeShowcase({ heading, description, creatives }) {
  const n = creatives.length
  const [active, setActive] = useState(Math.floor(n / 2))
  const rootRef = useRef(null)
  const [seen, setSeen] = useState(false)

  const go = useCallback((dir) => setActive((a) => (a + dir + n) % n), [n])
  const jump = useCallback((i) => setActive(i), [])

  // shortest signed distance from the active poster (so the strip wraps)
  const offsetOf = (i) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  // reveal the heading once the section scrolls into view
  useEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="works" ref={rootRef}>
      {/* framing graphics (reused brand assets) */}
      <img className="works-arrow-top" src="/assets/arrow_3.svg" alt="" aria-hidden="true" />
      <img className="works-arrow-bottom" src="/assets/arrow_4.svg" alt="" aria-hidden="true" />

      {/* left: display heading */}
      <div className="works-head">
        <Heading lines={heading} active={seen} className="headline--brand" />
      </div>

      {/* directional cues on either side of the strip */}
      <button className="works-side works-side--left" onClick={() => go(-1)} aria-label="Previous creative">
        <SideArrow dir="left" />
      </button>
      <button className="works-side works-side--right" onClick={() => go(1)} aria-label="Next creative">
        <SideArrow dir="right" />
      </button>

      {/* coverflow */}
      <div className="cf-stage">
        {creatives.map((c, i) => {
          const d = offsetOf(i)
          const abs = Math.abs(d)
          const visible = abs <= 3
          return (
            <div
              key={c.src}
              className={`cf-item${d === 0 ? ' is-center' : ''}`}
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 19}vw) scale(${d === 0 ? 1 : 0.6})`,
                zIndex: 20 - abs,
                opacity: visible ? (abs === 3 ? 0.55 : 1) : 0,
                pointerEvents: visible && d !== 0 ? 'auto' : d === 0 ? 'none' : 'none',
              }}
              onClick={() => d !== 0 && setActive(i)}
              role={d !== 0 ? 'button' : undefined}
              aria-label={d !== 0 ? 'Focus this creative' : undefined}
            >
              <img src={c.src} alt={c.alt || ''} draggable="false" loading="lazy" />
            </div>
          )
        })}
      </div>

      {/* right: credit copy */}
      <div className="works-desc">
        <p>{description}</p>
      </div>

      {/* controls */}
      <div className="works-controls">
        <button className="cf-nav" onClick={() => go(-1)} aria-label="Previous">
          ‹
        </button>
        <div className="cf-dots">
          {creatives.map((c, i) => (
            <button
              key={c.src}
              className={`cf-dot${i === active ? ' is-active' : ''}`}
              onClick={() => jump(i)}
              aria-label={`Creative ${i + 1}`}
            />
          ))}
        </div>
        <button className="cf-nav" onClick={() => go(1)} aria-label="Next">
          ›
        </button>
      </div>
    </section>
  )
}

function SideArrow({ dir }) {
  const flip = dir === 'left' ? 'scaleX(-1)' : 'none'
  return (
    <svg width="70" height="12" viewBox="0 0 70 12" fill="none" style={{ transform: flip }}>
      <line x1="0" y1="6" x2="64" y2="6" stroke="#ed3d24" strokeWidth="1.4" />
      <path d="M58 1 L68 6 L58 11" stroke="#ed3d24" strokeWidth="1.4" fill="none" />
    </svg>
  )
}
