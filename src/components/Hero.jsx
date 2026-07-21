import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { slides } from '../data/slides.js'
import IntroSlide from './IntroSlide.jsx'
import BrandSlide from './BrandSlide.jsx'
import EditorPanel from './EditorPanel.jsx'

const clone = (arr) => arr.map((e) => ({ ...e }))
const baseElements = (slideId) => slides.find((s) => s.id === slideId).elements

export default function Hero() {
  const [index, setIndex] = useState(0)
  const heroRef = useRef(null)

  // ---- layout editor state -------------------------------------------------
  const [editMode, setEditMode] = useState(
    () => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('edit'),
  )
  const [edited, setEdited] = useState({}) // { [slideId]: element[] }
  const [selectedId, setSelectedId] = useState(null)

  const elementsFor = (slide) => edited[slide.id] ?? slide.elements

  const patchEl = useCallback((slideId, elId, patch) => {
    setEdited((p) => {
      const base = p[slideId] ?? clone(baseElements(slideId))
      return { ...p, [slideId]: base.map((e) => (e.id === elId ? { ...e, ...patch } : e)) }
    })
  }, [])

  const addEl = useCallback((slideId, src) => {
    const kind = src.toLowerCase().endsWith('.svg') ? 'svg' : 'image'
    const id = `${kind}-${Date.now().toString(36)}`
    setEdited((p) => {
      const base = p[slideId] ?? clone(baseElements(slideId))
      const maxZ = base.reduce((m, e) => Math.max(m, e.z), 0)
      const el = {
        id,
        kind,
        src,
        left: 50,
        top: 50,
        w: kind === 'svg' ? 8 : 20,
        z: maxZ + 1,
        depth: 30,
        center: true,
        ...(kind === 'image' ? { glow: true } : {}),
      }
      return { ...p, [slideId]: [...base, el] }
    })
    setSelectedId(id)
  }, [])

  const removeEl = useCallback((slideId, elId) => {
    setEdited((p) => {
      const base = p[slideId] ?? clone(baseElements(slideId))
      return { ...p, [slideId]: base.filter((e) => e.id !== elId) }
    })
    setSelectedId(null)
  }, [])

  const duplicateEl = useCallback((slideId, elId) => {
    const id = `copy-${Date.now().toString(36)}`
    setEdited((p) => {
      const base = p[slideId] ?? clone(baseElements(slideId))
      const src = base.find((e) => e.id === elId)
      if (!src) return p
      const copy = { ...src, id, left: +(src.left + 3).toFixed(2), top: +(src.top + 3).toFixed(2), z: src.z + 1 }
      return { ...p, [slideId]: [...base, copy] }
    })
    setSelectedId(id)
  }, [])

  const reorderEl = useCallback((slideId, elId, dir) => {
    setEdited((p) => {
      const base = p[slideId] ?? clone(baseElements(slideId))
      const zs = base.map((e) => e.z)
      const maxZ = Math.max(...zs)
      const minZ = Math.min(...zs)
      const next = base.map((e) => {
        if (e.id !== elId) return e
        const z =
          dir === 'front' ? maxZ + 1 : dir === 'back' ? minZ - 1 : dir === 'fwd' ? e.z + 1 : e.z - 1
        return { ...e, z }
      })
      return { ...p, [slideId]: next }
    })
  }, [])

  const resetSlide = useCallback((slideId) => {
    setEdited((p) => {
      const n = { ...p }
      delete n[slideId]
      return n
    })
    setSelectedId(null)
  }, [])

  // ---- pointer parallax ----------------------------------------------------
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mvx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const mvy = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })

  // `prevIndex` keeps the outgoing slide's layers mounted through the dissolve
  const indexRef = useRef(0)
  const [prevIndex, setPrevIndex] = useState(null)
  const go = useCallback((next) => {
    const n = (next + slides.length) % slides.length
    if (n === indexRef.current) return
    setPrevIndex(indexRef.current)
    indexRef.current = n
    setIndex(n)
  }, [])

  // auto-advance (paused while editing). `?freeze` also holds a slide.
  const frozen =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('freeze')
  useEffect(() => {
    if (frozen || editMode) return undefined
    const t = setTimeout(() => go(index + 1), slides[index].duration)
    return () => clearTimeout(t)
  }, [index, frozen, editMode, go])

  useEffect(() => {
    const el = heroRef.current
    if (!el || editMode) return undefined

    // Touch gets a boosted swing so the parallax is actually noticeable on a
    // phone: a tap nudges the composition toward the point (then it recentres),
    // a drag makes the layers follow the finger. Passive listeners, so vertical
    // scroll between sections is never blocked.
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const boost = coarse ? 1.5 : 1

    const setFrom = (cx, cy) => {
      const r = el.getBoundingClientRect()
      rawX.set(((cx - r.left) / r.width - 0.5) * 2 * boost)
      rawY.set(((cy - r.top) / r.height - 0.5) * 2 * boost)
    }
    const recentre = () => {
      rawX.set(0)
      rawY.set(0)
    }

    const onMove = (e) => setFrom(e.clientX, e.clientY)
    const onTouch = (e) => {
      const t = e.touches[0]
      if (t) setFrom(t.clientX, t.clientY)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', recentre)
    if (coarse) {
      el.addEventListener('touchstart', onTouch, { passive: true })
      el.addEventListener('touchmove', onTouch, { passive: true })
      el.addEventListener('touchend', recentre, { passive: true })
      el.addEventListener('touchcancel', recentre, { passive: true })
    }
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', recentre)
      el.removeEventListener('touchstart', onTouch)
      el.removeEventListener('touchmove', onTouch)
      el.removeEventListener('touchend', recentre)
      el.removeEventListener('touchcancel', recentre)
    }
  }, [rawX, rawY, editMode])

  const currentSlide = slides[index]
  // Edit-layout UI hidden for now. Editing is still reachable via the `?edit`
  // URL flag; flip this to re-show the floating toggle button.
  const showEditToggle = false

  return (
    <section className={`hero${editMode ? ' is-editing' : ''}`} ref={heroRef}>
      <div className="hero-bg" />
      <div className="hero-bg-texture" />

      {/* Watercolour dissolve: the outgoing slide bleeds away (blur + soften +
          fade) into the paper, THEN the incoming reveals from a blur. The
          reveal is delayed past the dissolve so the two never overlap. */}
      <div className="hero-stack">
        {slides.map((slide, i) => {
          const isActive = i === index
          return (
            <motion.div
              className="hero-slide"
              key={slide.id}
              initial={false}
              animate={
                isActive
                  ? { opacity: 1, filter: 'blur(0px)', scale: 1 }
                  : { opacity: 0, filter: 'blur(7px)', scale: 1.018 }
              }
              transition={
                editMode
                  ? { duration: 0 }
                  : isActive
                    ? {
                        // reveal — bleeds back into focus like paint settling
                        opacity: { duration: 1.5, delay: 0.34, ease: [0.33, 0, 0.2, 1] },
                        filter: { duration: 1.8, delay: 0.34, ease: [0.25, 0, 0.15, 1] },
                        scale: { duration: 2.1, delay: 0.34, ease: [0.16, 1, 0.3, 1] },
                      }
                    : {
                        // dissolve out — washes away gently, leading the reveal
                        opacity: { duration: 0.95, ease: [0.4, 0, 0.7, 0.6] },
                        filter: { duration: 1.1, ease: [0.4, 0, 0.7, 0.6] },
                        scale: { duration: 1.3, ease: [0.4, 0, 0.7, 0.6] },
                      }
              }
              style={{
                zIndex: isActive ? 2 : 1,
                pointerEvents: isActive ? 'auto' : 'none',
                transformOrigin: '50% 52%',
                willChange: isActive ? 'opacity, filter, transform' : 'auto',
              }}
              data-active={isActive ? 'true' : 'false'}
            >
              {slide.type === 'intro' ? (
                <IntroSlide slide={slide} active={isActive} mvx={mvx} mvy={mvy} />
              ) : (
                <BrandSlide
                  slide={slide}
                  elements={elementsFor(slide)}
                  active={isActive}
                  mvx={mvx}
                  mvy={mvy}
                  editing={editMode && isActive}
                  mounted={isActive || i === prevIndex}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onChange={(id, patch) => patchEl(slide.id, id, patch)}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* deselect when clicking empty canvas in edit mode */}
      {editMode && (
        <div className="edit-catch" onPointerDown={() => setSelectedId(null)} />
      )}

      <div className="hero-dots" role="tablist" aria-label="Hero slides">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            className={i === index ? 'dot is-active' : 'dot'}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-line" />
      </div>

      {showEditToggle && (
        <button
          className={`edit-toggle${editMode ? ' is-on' : ''}`}
          onClick={() => {
            setEditMode((v) => !v)
            setSelectedId(null)
          }}
        >
          {editMode ? '✓ Done' : '✎ Edit layout'}
        </button>
      )}

      {editMode && (
        <EditorPanel
          slideId={currentSlide.id}
          editable={currentSlide.type === 'brand'}
          elements={elementsFor(currentSlide)}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onChange={(id, patch) => patchEl(currentSlide.id, id, patch)}
          onAdd={(src) => addEl(currentSlide.id, src)}
          onRemove={(id) => removeEl(currentSlide.id, id)}
          onDuplicate={(id) => duplicateEl(currentSlide.id, id)}
          onReorder={(id, dir) => reorderEl(currentSlide.id, id, dir)}
          onReset={() => resetSlide(currentSlide.id)}
          onClose={() => {
            setEditMode(false)
            setSelectedId(null)
          }}
        />
      )}
    </section>
  )
}
