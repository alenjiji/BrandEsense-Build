import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Heading from './Heading.jsx'

// The brands Brand Esense has served, arranged as a constellation orbiting the
// signature rotating ring — echoing the ring-around-portrait motif from the
// hero. Logos sit upright in soft chips (grayscale → colour on hover).
const CLIENTS = [
  { name: 'Classy', src: '/logo/clients/classy.svg' },
  { name: 'Clinic7', src: '/logo/clients/clinic7.svg' },
  { name: 'Limitless', src: '/logo/clients/limitless.svg' },
  { name: 'Metro', src: '/logo/clients/metro.svg' },
  { name: 'Synthite', src: '/logo/clients/synthite.svg' },
  { name: 'V-Guard', src: '/logo/clients/v-gaurd.svg' },
]

const HEADING = [
  [{ t: 'Happy clients,', red: false }],
  [{ t: 'lasting ', red: false }, { t: 'impact.', red: true }],
]

export default function HappyClients() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.3,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const n = CLIENTS.length

  return (
    <section className="clients" ref={ref}>
      {/* framing graphics (reused brand assets) */}
      <img className="clients-arrow" src="/assets/arrow_3.svg" alt="" aria-hidden="true" />
      <img className="clients-circle" src="/assets/circle_1.svg" alt="" aria-hidden="true" />
      <img className="clients-cross clients-cross--1" src="/assets/arrow_Element_bg.svg" alt="" aria-hidden="true" />
      <img className="clients-cross clients-cross--2" src="/assets/arrow_Element_bg.svg" alt="" aria-hidden="true" />

      {/* left: heading + copy */}
      <div className="clients-copy">
        <Heading lines={HEADING} active={seen} className="headline--brand" />
        <motion.p
          className="clients-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          A few of the brands we've had the privilege to partner with — and grow alongside.
        </motion.p>
      </div>

      {/* orbit of client logos */}
      <div className="orbit">
        <img className="orbit-ring" src="/assets/ring_1_rotate.svg" alt="" aria-hidden="true" />
        <span className="orbit-core">Trusted by</span>
        {CLIENTS.map((c, i) => {
          const ang = (i / n) * Math.PI * 2 - Math.PI / 2 // start at the top
          const R = 46 // radius as % of the orbit box
          const x = 50 + R * Math.cos(ang)
          const y = 50 + R * Math.sin(ang)
          return (
            <motion.div
              key={c.name}
              className="orbit-chip"
              style={{ left: `${x}%`, top: `${y}%` }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={seen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={c.src} alt={c.name} draggable="false" />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
