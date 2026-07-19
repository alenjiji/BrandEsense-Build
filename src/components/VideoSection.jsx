import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'

// "Impact in Motion" — dark showreel section. The thumbnail is heavy (1.4MB),
// so it only loads when the section nears the viewport.
export default function VideoSection() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useTilt(ref, '.video-frame img', { max: 4 })

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
    <section className="video-sec" ref={ref}>
      {/* subtle brand emblem watermark */}
      <img
        className="video-emblem"
        src="/video_section/brand_Essense_bg.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <motion.div
        className="video-frame"
        initial={{ opacity: 0, y: 26 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/opt/video_section/video_thumbnail.webp"
          alt="Brand Esense showreel"
          width="1660"
          height="935"
          loading="lazy"
          decoding="async"
          draggable="false"
        />
        <button className="video-play" type="button" aria-label="Play showreel">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        </button>
      </motion.div>

      <motion.div
        className="video-foot"
        initial={{ opacity: 0, y: 18 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="video-title">
          <span className="is-red">Impact</span>
          <br />
          in Motion
        </h2>
        <p className="video-desc">
          A curated look at our in-house production and creative campaigns. Watch how we transform
          bold ideas into unforgettable visual stories.
        </p>
        <button className="video-cta" type="button" aria-label="View all work">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M11 29 L29 11 M15 11 h14 v14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </motion.div>
    </section>
  )
}
