import { useEffect } from 'react'

// Turns a doubled-content marquee track into a JS-driven strip that the visitor
// can also grab and slide through. It auto-scrolls (px/s), pauses on hover, and
// accepts mouse + touch drag. The track must render its set twice; we wrap the
// offset at half the scroll width for a seamless loop. Replaces the CSS
// keyframe animation (add the `is-drag` class so that animation is disabled).
export default function useDragMarquee(ref, { speed = 40, direction = 1, active = true } = {}) {
  useEffect(() => {
    const track = ref.current
    if (!track) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let half = track.scrollWidth / 2
    const measure = () => {
      half = track.scrollWidth / 2
    }

    let pos = 0
    let paused = false
    let dragging = false
    let axis = null // 'x' | 'y' | null (touch gesture lock)
    let startX = 0
    let startY = 0
    let startPos = 0
    let last = performance.now()

    const norm = () => {
      if (half > 0) pos = ((pos % half) + half) % half
    }
    const apply = () => {
      track.style.transform = `translate3d(${-pos}px, 0, 0)`
    }

    let raf
    const tick = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      if (active && !paused && !dragging && !reduced) {
        pos += direction * speed * dt
        norm()
        apply()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // desktop hover pause — lets a tile be inspected before grabbing
    const onEnter = () => {
      paused = true
    }
    const onLeave = () => {
      paused = false
    }
    track.addEventListener('mouseenter', onEnter)
    track.addEventListener('mouseleave', onLeave)

    // mouse drag-to-slide (mouse events, since Lenis cancels the pointer stream)
    const onDown = (e) => {
      dragging = true
      startX = e.clientX
      startPos = pos
      track.classList.add('is-grabbing')
      e.preventDefault()
    }
    const onMove = (e) => {
      if (!dragging) return
      pos = startPos - (e.clientX - startX)
      norm()
      apply()
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      track.classList.remove('is-grabbing')
    }
    track.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    // touch drag — axis-locked so a vertical swipe still scrolls the page
    // (the track's `touch-action: pan-y` hands horizontal gestures to us)
    const onTouchStart = (e) => {
      const tp = e.touches[0]
      startX = tp.clientX
      startY = tp.clientY
      startPos = pos
      axis = null
    }
    const onTouchMove = (e) => {
      const tp = e.touches[0]
      const dx = tp.clientX - startX
      const dy = tp.clientY - startY
      if (!axis) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      }
      if (axis === 'x') {
        dragging = true
        pos = startPos - dx
        norm()
        apply()
      }
    }
    const onTouchEnd = () => {
      dragging = false
      axis = null
    }
    track.addEventListener('touchstart', onTouchStart, { passive: true })
    track.addEventListener('touchmove', onTouchMove, { passive: true })
    track.addEventListener('touchend', onTouchEnd, { passive: true })
    track.addEventListener('touchcancel', onTouchEnd, { passive: true })

    // keep `half` correct as lazy images load / the viewport resizes
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener('resize', measure)
    const settle = setTimeout(measure, 400)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(settle)
      ro.disconnect()
      track.removeEventListener('mouseenter', onEnter)
      track.removeEventListener('mouseleave', onLeave)
      track.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      track.removeEventListener('touchstart', onTouchStart)
      track.removeEventListener('touchmove', onTouchMove)
      track.removeEventListener('touchend', onTouchEnd)
      track.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('resize', measure)
      track.style.transform = ''
    }
  }, [ref, speed, direction, active])
}
