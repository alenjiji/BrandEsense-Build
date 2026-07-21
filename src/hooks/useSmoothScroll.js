import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Smooth scrolling + a velocity-driven skew, the two things that give the
// reference site its weight. The skew is applied to opted-in elements
// (`[data-skew]`) rather than whole sections — skewing a full-viewport section
// warps its edges against the neighbouring one.
export default function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      overscroll: false,
    })

    const targets = () => document.querySelectorAll('[data-skew]')
    let current = 0

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

    const onScroll = ({ velocity }) => {
      // mirrors the reference's velocity/-80, clamped so it never gets silly
      const skew = clamp(velocity / -95, -2.2, 2.2)
      if (Math.abs(skew - current) < 0.01) return
      current = skew
      targets().forEach((el) => {
        el.style.transform = `skewY(${skew}deg)`
      })
    }

    const reset = () => {
      current = 0
      targets().forEach((el) => {
        el.style.transform = 'skewY(0deg)'
      })
    }

    lenis.on('scroll', onScroll)

    let raf = 0
    const tick = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const idle = setInterval(() => {
      if (current !== 0 && Math.abs(lenis.velocity) < 0.05) reset()
    }, 120)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(idle)
      lenis.destroy()
      reset()
    }
  }, [])
}
