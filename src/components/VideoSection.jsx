import { motion } from 'framer-motion'
import useTilt from '../hooks/useTilt.js'
import useInView from '../hooks/useInView.js'
import { WordReveal, Reveal } from './reveal.jsx'

// "Impact in Motion" — dark showreel section. The thumbnail is heavy (1.4MB),
// so it only loads when the section nears the viewport.
export default function VideoSection() {
  const [ref, seen] = useInView({ amount: 0.2 })
  useTilt(ref, '.video-frame img', { max: 4.5, scale: 1.045 })

  return (
    <section className="video-sec" id="portfolio" ref={ref}>
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

      <div className="video-foot">
        <h2 className="video-title">
          <WordReveal as="span" className="vt-line" active={seen} parts={[{ t: 'Impact', red: true }]} delay={0.15} />
          <WordReveal as="span" className="vt-line" active={seen} parts={[{ t: 'in Motion' }]} delay={0.26} />
        </h2>
        <Reveal as="p" className="video-desc" active={seen} delay={0.42} y={16}>
          A curated look at our in-house production and creative campaigns. Watch how we transform
          bold ideas into unforgettable visual stories.
        </Reveal>
        <Reveal as="button" className="video-cta" active={seen} delay={0.52} y={12} type="button" aria-label="View all work">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M11 29 L29 11 M15 11 h14 v14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="square"
            />
          </svg>
        </Reveal>
      </div>
    </section>
  )
}
