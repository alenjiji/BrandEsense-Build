import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'

// "Partners in progress" — the full client roster.
// Explicit rows so the grouping and order match the design exactly (8/9/6/8);
// each row spreads edge-to-edge, letting every mark keep its natural width.
const ROWS = [
  ['metro', 'v-gaurd', 'synthite', 'clinic7', 'limitless', 'classy', 'gokulam', 'hair_and_Craft'],
  [
    'Pavizham',
    'royal arabian',
    'ac_Milan_Academy',
    'tgi',
    'ileaf',
    'vmc',
    'fragrant_nature',
    'spice_Country',
    'De_pedia',
  ],
  ['windy_Woods', 'novocotto', 'seeds and hands', 'bella', 'vuespace', 'p_And_Ceramics'],
  [
    'robinfood',
    'vinayaka',
    'lakshadweep_tourism',
    'olio',
    'minar',
    'asset_homes',
    'home_Fresh',
    'blossom',
  ],
]

const label = (name) =>
  name.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export default function Partners() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useTilt(ref, '.partner img', { max: 14 })

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="partners" ref={ref}>
      <motion.div
        className="partners-head"
        initial={{ opacity: 0, y: 22 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="partners-title">
          <span className="is-red">Partners</span> in progress
        </h2>
        <p className="partners-sub">
          We are privileged to partner with such a distinguished clientele. They place their
          confidence in our strategy, knowing we earn trust by taking responsibility for their
          ultimate success
        </p>
      </motion.div>

      <div className="partners-grid" data-skew>
        {ROWS.map((row, r) => (
          <div className="partners-row" key={r}>
            {row.map((name, i) => (
              <motion.div
                className="partner"
                key={name}
                initial={{ opacity: 0, y: 14 }}
                animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{
                  duration: 0.55,
                  delay: seen ? 0.15 + (r * 0.09 + i * 0.03) : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <img
                  src={`/logo/clients/${encodeURIComponent(name)}.svg`}
                  alt={label(name)}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
