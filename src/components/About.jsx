import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { num: '25+', label: 'Years Experience' },
  { num: '32+', label: 'Happy Clients' },
  { num: '100+', label: 'Projects' },
  { num: '20+', label: 'Hard Workers' },
]

// Brand story + headline numbers. The copy runs across two ruled columns,
// splitting mid-sentence exactly as the design does.
export default function About() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.2,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="about" ref={ref}>
      <img
        className="about-emblem"
        src="/video_section/brand_Essense_bg.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <motion.div
        className="about-top"
        initial={{ opacity: 0, y: 22 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          className="about-logo"
          src="/logo/logo_outline_2.svg"
          alt="Brand Esense"
          loading="lazy"
          draggable="false"
        />
        <div className="about-cols">
          <p className="about-col">
            Born from the creative passion and visionary leadership of Prasad Yogi, Brand Esense is
            a hub of relentless innovation. We specialize in bridging the gap between traditional
            advertising and cutting-edge digital marketing to
          </p>
          <p className="about-col">
            give your brand a definitive edge. By combining deep strategic insights with bold
            creativity, our mission is to transform bold ideas into unforgettable visual stories
            that drive real-world results
          </p>
        </div>
      </motion.div>

      <div className="about-stats">
        {STATS.map((s, i) => (
          <motion.div
            className="stat"
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.7, delay: seen ? 0.2 + i * 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
