import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slides } from '../data/slides.js'

// Every image the hero carousel will ever show. We load AND decode all of them
// up front so no slide ever paints its pictures in one-by-one as the carousel
// advances — the whole hero is ready before the curtain lifts.
const HERO_IMAGES = slides
  .filter((s) => s.type === 'brand')
  .flatMap((s) => s.elements.filter((e) => e.kind === 'image').map((e) => e.src))

const EASE = [0.22, 1, 0.36, 1]

// Signal the rest of the app (the Hero) that hero imagery is decoded and it's
// safe to run the carousel.
function announceReady() {
  if (typeof window === 'undefined') return
  window.__assetsReady = true
  window.dispatchEvent(new Event('assets-ready'))
}

// Minimal editorial preloader: brand mark, a hairline progress rule that tracks
// real image-load progress, and a quiet percentage. Lifts away once ready.
export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const srcs = HERO_IMAGES
    const total = srcs.length
    let loaded = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      setProgress(1)
      announceReady()
      // brief hold so the filled bar reads before the curtain lifts
      setTimeout(() => setDone(true), 420)
    }

    if (total === 0) {
      finish()
      return undefined
    }

    // load + decode each image, advancing the bar for real as they complete
    const bump = () => {
      loaded += 1
      setProgress(loaded / total)
      if (loaded >= total) finish()
    }
    srcs.forEach((src) => {
      const img = new Image()
      const onSettled = () => bump()
      img.onload = () => {
        // decode() guarantees the bitmap is paint-ready, not just fetched, so
        // the first frame of each slide never flickers in.
        if (img.decode) img.decode().then(onSettled, onSettled)
        else onSettled()
      }
      img.onerror = onSettled
      img.src = src
    })

    // never trap the visitor behind a slow/broken asset
    const cap = setTimeout(finish, 9000)
    return () => clearTimeout(cap)
  }, [])

  // hold page scroll pinned to the top while the curtain is up
  useEffect(() => {
    document.documentElement.classList.toggle('is-preloading', !done)
    return () => document.documentElement.classList.remove('is-preloading')
  }, [done])

  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          // the panel recedes into the page (a gentle scale-through) as it fades,
          // so it hands off to the hero rather than snapping away
          exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.85, ease: [0.6, 0, 0.24, 1] } }}
        >
          <motion.div
            className="preloader-inner"
            // content leaves first, lifting up, so the panel clears empty
            exit={{ opacity: 0, y: -16, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
          >
            <motion.img
              className="preloader-logo"
              src="/logo/logo_outline.svg"
              alt="Brand Esense"
              draggable="false"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
            />

            <motion.div
              className="preloader-meter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            >
              <div className="preloader-bar">
                <motion.span
                  className="preloader-fill"
                  animate={{ scaleX: progress }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <span className="preloader-pct">{String(pct).padStart(2, '0')}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
