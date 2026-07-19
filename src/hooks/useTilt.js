import { useEffect } from 'react'

// 3D tilt-on-hover for depth (the vanilla-tilt effect on the reference site).
// Delegated from a container so it covers any number of children matching
// `selector`, including ones added later.
//
//   useTilt(ref, '.cf-item', { max: 12 })
export default function useTilt(containerRef, selector, { max = 12, scale = 1.0 } = {}) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    let active = null
    let raf = 0
    const target = { rx: 0, ry: 0 }
    const cur = { rx: 0, ry: 0 }

    const lerp = (a, b, n) => a + (b - a) * n

    const tick = () => {
      cur.rx = lerp(cur.rx, target.rx, 0.12)
      cur.ry = lerp(cur.ry, target.ry, 0.12)
      if (active) {
        active.style.transform =
          `perspective(1100px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)` +
          (scale !== 1 ? ` scale(${scale})` : '')
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      const el = e.target.closest?.(selector)
      if (!el) return
      if (active !== el) {
        if (active) active.style.transform = ''
        active = el
        el.style.willChange = 'transform'
      }
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      target.ry = px * max * 2
      target.rx = -py * max * 2
    }

    const onLeave = (e) => {
      const el = e.target.closest?.(selector)
      if (!el || el.contains(e.relatedTarget)) return
      target.rx = 0
      target.ry = 0
      // let it ease back, then drop the inline transform
      setTimeout(() => {
        if (active === el) {
          el.style.transform = ''
          el.style.willChange = ''
          active = null
          cur.rx = 0
          cur.ry = 0
        }
      }, 420)
    }

    root.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerout', onLeave, true)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerout', onLeave, true)
      if (active) active.style.transform = ''
    }
  }, [containerRef, selector, max, scale])
}
