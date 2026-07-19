import { useEffect, useRef } from 'react'

// Custom dual cursor: a lagging ring + a near-instant dot, both blended with
// `difference` so they invert whatever is behind them (stays legible across the
// light sections and the dark About/Video ones without any per-section logic).
//
// Driven by a single rAF loop with per-element lerp — the ring eases slower
// than the dot, which is what produces the trailing "weight". Nothing is
// written to the DOM unless something actually moved.
//
// Opt-in states from any element:
//   data-cursor="hover"  → ring swells, dot hides
//   data-cursor="label" data-cursor-label="View"  → ring swells + shows a label
export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    // Skip entirely for touch / no fine pointer / reduced motion
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    document.body.classList.add('has-custom-cursor')

    const ring = ringRef.current
    const dot = dotRef.current
    const label = labelRef.current

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 }
    const r = { x: mouse.x, y: mouse.y }
    const d = { x: mouse.x, y: mouse.y }
    let raf = 0
    let visible = false

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      if (!visible) {
        visible = true
        ring.style.opacity = '1'
        dot.style.opacity = '1'
      }
    }

    const onLeave = () => {
      visible = false
      ring.style.opacity = '0'
      dot.style.opacity = '0'
    }

    // hover state via delegation so it covers dynamically rendered content
    const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, .cf-item, .partner'
    const onOver = (e) => {
      const hit = e.target.closest?.(INTERACTIVE)
      if (!hit) return
      const mode = hit.dataset?.cursor
      ring.classList.add('is-hover')
      dot.classList.add('is-hover')
      if (mode === 'label' && hit.dataset.cursorLabel) {
        label.textContent = hit.dataset.cursorLabel
        ring.classList.add('is-label')
      }
    }
    const onOut = (e) => {
      const hit = e.target.closest?.(INTERACTIVE)
      if (!hit) return
      if (hit.contains(e.relatedTarget)) return
      ring.classList.remove('is-hover', 'is-label')
      dot.classList.remove('is-hover')
      label.textContent = ''
    }

    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    const lerp = (a, b, n) => a + (b - a) * n

    const tick = () => {
      // dot tracks tightly, ring trails — the lag is the effect
      d.x = lerp(d.x, mouse.x, 0.38)
      d.y = lerp(d.y, mouse.y, 0.38)
      r.x = lerp(r.x, mouse.x, 0.15)
      r.y = lerp(r.y, mouse.y, 0.15)

      dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, true)
    document.addEventListener('pointerout', onOut, true)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver, true)
      document.removeEventListener('pointerout', onOut, true)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span className="cursor-label" ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
