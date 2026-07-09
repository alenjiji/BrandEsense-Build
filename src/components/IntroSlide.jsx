import { motion } from 'framer-motion'
import Heading from './Heading.jsx'

// The opening landing slide. Auto-advances to the first brand slide after
// its (short) duration. Copy on the left, brand lockup on the right.
// No pointer parallax here — the intro stays still.
export default function IntroSlide({ slide, active }) {
  return (
    <div className="slide slide--intro">
      <div className="slide-copy slide-copy--left">
        <Heading lines={slide.heading} active={active} className="headline--intro" />
      </div>

      <div className="intro-lockup">
        <motion.img
          className="intro-logo"
          src="/logo/logo_2.svg"
          alt="Brand Esense"
          draggable="false"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, delay: active ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className="intro-quote"
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.8, delay: active ? 0.45 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {slide.quote[0]}
          <br />
          {slide.quote[1]}
        </motion.p>

        <motion.div
          className="intro-cta"
          initial={{ opacity: 0, y: 18 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.8, delay: active ? 0.6 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="intro-sub">
            {slide.sub[0]}
            <br />
            {slide.sub[1]}
          </p>
          <button className="pill-btn" type="button">
            <span>View Project</span>
            <img src="/assets/arrow-button.svg" alt="" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
