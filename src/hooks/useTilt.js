import { useEffect } from 'react'

// 3D tilt-on-hover.
//
// Every part of the effect (rotation AND scale) is multiplied by an `enter`
// factor that eases 0→1 on hover and back on leave. That's what kills the
// "jump when the cursor enters from a corner": the tilt starts at zero and
// grows in, instead of snapping straight to the edge value. `scale` (>1) zooms
// the target slightly so a tilted image never reveals the frame edge behind it.
//
//   useTilt(ref, '.video-frame img', { max: 6, scale: 1.05 })
export default function useTilt(containerRef, selector, { max = 12, scale = 1.0 } = {}) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return undefined

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    const lerp = (a, b, n) => a + (b - a) * n
    const states = new Map()
    let raf = requestAnimationFrame(tick)

    function tick() {
      for (const [el, s] of states) {
        s.enter = lerp(s.enter, s.hovering ? 1 : 0, 0.09)
        s.cur.rx = lerp(s.cur.rx, s.target.rx, 0.11)
        s.cur.ry = lerp(s.cur.ry, s.target.ry, 0.11)
        const e = s.enter
        const sc = 1 + (scale - 1) * e
        el.style.transform =
          `perspective(1200px) rotateX(${(s.cur.rx * e).toFixed(2)}deg) ` +
          `rotateY(${(s.cur.ry * e).toFixed(2)}deg) scale(${sc.toFixed(3)})`
        if (!s.hovering && e < 0.002) {
          el.style.transform = ''
          el.style.willChange = ''
          states.delete(el)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    function getState(el) {
      if (!states.has(el)) {
        states.set(el, { target: { rx: 0, ry: 0 }, cur: { rx: 0, ry: 0 }, enter: 0, hovering: false })
      }
      return states.get(el)
    }

    function onEnter(e) {
      const s = getState(e.currentTarget)
      s.hovering = true
      e.currentTarget.style.willChange = 'transform'
    }

    function onMove(e) {
      const el = e.currentTarget
      const s = getState(el)
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5 // [-0.5, 0.5]
      const py = (e.clientY - r.top) / r.height - 0.5
      s.target.ry = px * max // edge tilt = max/2
      s.target.rx = -py * max
    }

    function onLeave(e) {
      const s = getState(e.currentTarget)
      s.hovering = false
      s.target.rx = 0
      s.target.ry = 0
    }

    const attached = new Set()
    function attach(el) {
      if (attached.has(el)) return
      attached.add(el)
      el.addEventListener('pointerenter', onEnter)
      el.addEventListener('pointermove', onMove, { passive: true })
      el.addEventListener('pointerleave', onLeave)
    }
    function detach(el) {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.style.transform = ''
      el.style.willChange = ''
      attached.delete(el)
      states.delete(el)
    }

    root.querySelectorAll(selector).forEach(attach)
    const mo = new MutationObserver(() => root.querySelectorAll(selector).forEach(attach))
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      attached.forEach(detach)
    }
  }, [containerRef, selector, max, scale])
}
