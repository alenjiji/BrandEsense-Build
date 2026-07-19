import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Heading from './Heading.jsx'

// Coverflow gallery with a client switcher. Picking a client swaps the whole
// creative set — the stage cross-fades out and the new posters stagger back in.
export default function CreativeShowcase({ heading, clients }) {
  const [clientIdx, setClientIdx] = useState(0)
  const client = clients[clientIdx]
  const creatives = client.creatives
  const n = creatives.length

  const [active, setActive] = useState(Math.floor(n / 2))
  const rootRef = useRef(null)
  const [seen, setSeen] = useState(false)

  const go = useCallback((dir) => setActive((a) => (a + dir + n) % n), [n])

  // shortest signed distance from the active poster (so the strip wraps)
  const offsetOf = (i) => {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  const pickClient = (i) => {
    if (i === clientIdx) return
    setClientIdx(i)
    setActive(Math.floor(clients[i].creatives.length / 2))
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="works" ref={rootRef}>
      <img className="works-arrow-top" src="/assets/arrow_3.svg" alt="" aria-hidden="true" />
      <img className="works-arrow-bottom" src="/assets/arrow_4.svg" alt="" aria-hidden="true" />

      <div className="works-head">
        <Heading lines={heading} active={seen} className="headline--brand" />
      </div>

      <button className="works-side works-side--left" onClick={() => go(-1)} aria-label="Previous creative">
        <SideArrow dir="left" />
      </button>
      <button className="works-side works-side--right" onClick={() => go(1)} aria-label="Next creative">
        <SideArrow dir="right" />
      </button>

      {/* coverflow — keyed on the client so switching cross-fades the set */}
      <AnimatePresence mode="wait">
        <motion.div
          className="cf-stage"
          data-skew
          key={client.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {creatives.map((src, i) => {
            const d = offsetOf(i)
            const abs = Math.abs(d)
            const visible = abs <= 3
            return (
              <motion.div
                key={src}
                className={`cf-item${d === 0 ? ' is-center' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? (abs === 3 ? 0.55 : 1) : 0 }}
                transition={{ duration: 0.5, delay: 0.06 * abs, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transform: `translate(-50%, -50%) translateX(${d * 19}vw) scale(${d === 0 ? 1 : 0.6})`,
                  zIndex: 20 - abs,
                  pointerEvents: visible && d !== 0 ? 'auto' : 'none',
                }}
                onClick={() => d !== 0 && setActive(i)}
                role={d !== 0 ? 'button' : undefined}
                aria-label={d !== 0 ? 'Focus this creative' : undefined}
                data-cursor={d !== 0 ? 'label' : undefined}
                data-cursor-label={d !== 0 ? 'View' : undefined}
              >
                <img src={src} alt={`${client.name} creative`} draggable="false" loading="lazy" />
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* right: active client copy */}
      <AnimatePresence mode="wait">
        <motion.div
          className="works-desc"
          key={client.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="works-client-name">{client.name}</h3>
          <p>{client.tagline}</p>
        </motion.div>
      </AnimatePresence>

      {/* creative navigation */}
      <div className="works-controls">
        <button className="cf-nav" onClick={() => go(-1)} aria-label="Previous">
          ‹
        </button>
        <div className="cf-dots">
          {creatives.map((src, i) => (
            <button
              key={src}
              className={`cf-dot${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Creative ${i + 1}`}
            />
          ))}
        </div>
        <button className="cf-nav" onClick={() => go(1)} aria-label="Next">
          ›
        </button>
      </div>

      {/* client switcher */}
      <div className="works-clients" role="tablist" aria-label="Clients">
        {clients.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={i === clientIdx}
            className={`works-client${i === clientIdx ? ' is-active' : ''}`}
            onClick={() => pickClient(i)}
            title={c.name}
          >
            {c.logo ? (
              <img src={c.logo} alt={c.name} loading="lazy" draggable="false" />
            ) : (
              <span className="works-client-wordmark">{c.name}</span>
            )}
          </button>
        ))}
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
