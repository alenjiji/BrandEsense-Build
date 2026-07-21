import { useEffect, useRef } from 'react'

// Custom cursor — fine pointer: lagging ring + near-instant dot with
// mix-blend-mode:difference. Coarse pointer: soft red ring for touch.
export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    const fine = window.matchMedia('(pointer: fine)').matches

    const ring = ringRef.current
    const dot = dotRef.current
    const label = labelRef.current

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 }
    const r = { x: mouse.x, y: mouse.y }
    const d = { x: mouse.x, y: mouse.y }
    let raf = 0
    let visible = false
    let onDark = false
    let darkTick = 0
    const DARK = '.video-sec, .about, .footer'

    const lerp = (a, b, n) => a + (b - a) * n

    const RING_DELAY = 110
    const trail = [{ t: performance.now(), x: mouse.x, y: mouse.y }]
    const ringTarget = () => {
      const now = performance.now()
      const cutoff = now - RING_DELAY
      while (trail.length > 2 && trail[1].t < cutoff - 250) trail.shift()
      // if the trail is stale (no move events for >200ms, e.g. during scroll)
      // fall back to mouse directly so the ring doesn't freeze
      if (now - trail[trail.length - 1].t > 200) return mouse
      let i = trail.length - 1
      while (i > 0 && trail[i].t > cutoff) i--
      return trail[i]
    }

    const show = () => {
      if (visible) return
      visible = true
      ring.style.opacity = fine ? '1' : '0.6'
      dot.style.opacity = fine ? '1' : '0'
    }
    const hide = () => {
      visible = false
      ring.style.opacity = '0'
      dot.style.opacity = '0'
    }

    const tick = () => {
      d.x = lerp(d.x, mouse.x, fine ? 0.38 : 0.5)
      d.y = lerp(d.y, mouse.y, fine ? 0.38 : 0.5)
      const rt = fine ? ringTarget() : mouse
      r.x = lerp(r.x, rt.x, fine ? 0.18 : 0.24)
      r.y = lerp(r.y, rt.y, fine ? 0.18 : 0.24)
      dot.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) translate(-50%, -50%)`

      // recolour the cursor for the section under it (replaces mix-blend). Only
      // every ~6th frame — elementFromPoint is cheap but not free, and section
      // changes are slow.
      if (fine && visible && (darkTick = (darkTick + 1) % 6) === 0) {
        const under = document.elementFromPoint(mouse.x, mouse.y)
        const dark = !!(under && under.closest && under.closest(DARK))
        if (dark !== onDark) {
          onDark = dark
          ring.classList.toggle('on-dark', dark)
          dot.classList.toggle('on-dark', dark)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    document.body.classList.add('has-custom-cursor')

    let cleanup

    if (fine) {
      // Desktop tracking uses MOUSE events, not pointer events. Lenis
      // preventDefaults pointerdown, which cancels the active pointer stream so
      // pointermove stops firing after the first click — the cursor freezes.
      // mouse* events are immune to that (and to implicit pointer capture).
      const onMove = (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
        trail.push({ t: performance.now(), x: e.clientX, y: e.clientY })
        show()
      }
      const onLeave = () => hide()

      const INTERACTIVE =
        'a, button, [data-cursor], input, textarea, select, .cf-item, .partner, .red-blob, .mq-item, .tcard'
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

      // Hand the native cursor back around tel:/mailto: clicks only — Windows'
      // "open with" dialog blurs our window and would otherwise leave no cursor
      // (JS cursor frozen behind the dialog, body still `cursor:none`). Gated on
      // telArmed so an ordinary alt-tab blur never disturbs the custom cursor.
      let telArmed = false
      const onArm = (e) => {
        telArmed = !!e.target.closest?.('a[href^="tel:"], a[href^="mailto:"]')
      }
      const releaseNative = () => {
        if (telArmed) document.body.classList.remove('has-custom-cursor')
      }
      const reclaimNative = () => {
        telArmed = false
        document.body.classList.add('has-custom-cursor')
      }

      document.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('mouseover', onOver, true)
      document.addEventListener('mouseout', onOut, true)
      document.addEventListener('mousedown', onDown, { passive: true })
      document.addEventListener('mouseup', onUp, { passive: true })
      document.addEventListener('mouseleave', onLeave)
      document.addEventListener('mousedown', onArm, true)
      window.addEventListener('blur', releaseNative)
      window.addEventListener('focus', reclaimNative)

      cleanup = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseover', onOver, true)
        document.removeEventListener('mouseout', onOut, true)
        document.removeEventListener('mousedown', onDown)
        document.removeEventListener('mouseup', onUp)
        document.removeEventListener('mouseleave', onLeave)
        document.removeEventListener('mousedown', onArm, true)
        window.removeEventListener('blur', releaseNative)
        window.removeEventListener('focus', reclaimNative)
      }
    } else {
      ring.classList.add('is-touch')
      let hideTimer
      let tapTimer

      const setFrom = (t) => {
        mouse.x = t.clientX
        mouse.y = t.clientY
      }
      const onStart = (e) => {
        const t = e.touches[0]
        if (!t) return
        clearTimeout(hideTimer)
        setFrom(t)
        r.x = d.x = mouse.x
        r.y = d.y = mouse.y
        show()
        ring.classList.add('is-tap')
        clearTimeout(tapTimer)
        tapTimer = setTimeout(() => ring.classList.remove('is-tap'), 420)
      }
      const onMove = (e) => {
        const t = e.touches[0]
        if (!t) return
        clearTimeout(hideTimer)
        setFrom(t)
        show()
      }
      const onEnd = () => {
        hideTimer = setTimeout(hide, 850)
      }

      window.addEventListener('touchstart', onStart, { passive: true })
      window.addEventListener('touchmove', onMove, { passive: true })
      window.addEventListener('touchend', onEnd, { passive: true })
      window.addEventListener('touchcancel', onEnd, { passive: true })

      cleanup = () => {
        clearTimeout(hideTimer)
        clearTimeout(tapTimer)
        window.removeEventListener('touchstart', onStart)
        window.removeEventListener('touchmove', onMove)
        window.removeEventListener('touchend', onEnd)
        window.removeEventListener('touchcancel', onEnd)
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-custom-cursor')
      cleanup?.()
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
