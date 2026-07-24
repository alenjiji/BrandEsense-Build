import { motion } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'
import useInView from '../hooks/useInView.js'
import { WordReveal, Reveal } from './reveal.jsx'

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
  const [ref, seen] = useInView({ amount: 0.2 })
  useTilt(ref, '.partner img', { max: 24 })

  return (
    <section className="partners" id="clientele" ref={ref}>
      <div className="partners-head">
        <WordReveal
          className="partners-title"
          active={seen}
          parts={[{ t: 'Partners', red: true }, { t: ' in progress' }]}
        />
        <Reveal as="p" className="partners-sub" active={seen} delay={0.35} y={18}>
          We are privileged to partner with such a distinguished clientele. They place their
          confidence in our strategy, knowing we earn trust by taking responsibility for their
          ultimate success.
        </Reveal>
      </div>

      <div className="partners-grid" data-skew>
        {ROWS.map((row, r) => (
          <div className="partners-row" key={r}>
            {row.map((name, i) => (
              <motion.div
                className="partner"
                key={name}
                initial={{ opacity: 0, y: 16 }}
                animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  duration: 0.7,
                  delay: seen ? 0.2 + (r * 0.11 + i * 0.04) : 0,
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
