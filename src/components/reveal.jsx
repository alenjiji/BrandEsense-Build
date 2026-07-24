import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Reveal system — concept: "develop into focus".
//
// Everything resolves from soft + offset into sharp + settled, echoing the
// hero's watercolour dissolve so the whole site shares one visual idea.
// Headings additionally *paint in* word-by-word via a left→right clip wipe
// (a nod to the brushed hero art). All driven by the section's own in-view
// `active` flag, so nothing fires until it's scrolled to.

const EASE = [0.22, 1, 0.36, 1]

// ---- WordReveal --------------------------------------------------------------
// Display heading whose words paint in one after another: each wipes open
// left→right (clip-path) while un-blurring and lifting a touch. `parts` is an
// array of { t, red } spans; the red accent word lands with the others.
export function WordReveal({ parts, active, className = '', as = 'h2', delay = 0, stagger = 0.11 }) {
  const Tag = motion[as] || motion.h2

  const tokens = []
  parts.forEach((p) => {
    p.t.split(/(\s+)/).forEach((chunk) => {
      if (chunk === '') return
      if (/^\s+$/.test(chunk)) tokens.push({ space: true })
      else tokens.push({ t: chunk, red: p.red })
    })
  })

  const label = parts.map((p) => p.t).join('')
  let wi = -1

  return (
    <Tag className={`wr ${className}`} aria-label={label}>
      {tokens.map((tk, i) => {
        if (tk.space) return ' '
        wi += 1
        return (
          <span className="wr-word" key={i}>
            <motion.span
              className={`wr-inner${tk.red ? ' is-red' : ''}`}
              initial={{
                clipPath: 'inset(0 100% -18% 0)',
                y: '0.32em',
                filter: 'blur(7px)',
                opacity: 0,
              }}
              animate={
                active
                  ? { clipPath: 'inset(0 0% -18% 0)', y: '0em', filter: 'blur(0px)', opacity: 1 }
                  : { clipPath: 'inset(0 100% -18% 0)', y: '0.32em', filter: 'blur(7px)', opacity: 0 }
              }
              transition={{
                duration: 0.95,
                delay: active ? delay + wi * stagger : 0,
                ease: EASE,
                opacity: { duration: 0.7, delay: active ? delay + wi * stagger : 0 },
              }}
            >
              {tk.t}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

// ---- Reveal ------------------------------------------------------------------
// Generic "develop": fade + rise + un-blur. Copy, media and cards all share it
// so the whole page resolves with the same texture.
export function Reveal({
  active,
  delay = 0,
  y = 26,
  blur = 6,
  duration = 1.1,
  className = '',
  as = 'div',
  children,
  ...rest
}) {
  const Comp = motion[as] || motion.div
  const hidden = { opacity: 0, y, filter: `blur(${blur}px)` }
  const shown = { opacity: 1, y: 0, filter: 'blur(0px)' }
  return (
    <Comp
      className={className}
      initial={hidden}
      animate={active ? shown : hidden}
      transition={{ duration, delay: active ? delay : 0, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

// ---- CountUp -----------------------------------------------------------------
// Eases a number from 0 → target once `active`, keeping any non-digit suffix.
// With `replay`, it re-runs the count at random intervals (each instance on its
// own timer) so the stats keep ticking over rather than settling for good.
export function CountUp({ value, active, duration = 1.7, replay = false }) {
  const target = parseInt(String(value).replace(/[^\d]/g, ''), 10) || 0
  const suffix = String(value).replace(/[\d]/g, '')
  const [n, setN] = useState(0)
  const [runId, setRunId] = useState(0)

  // the count animation itself — restarts whenever runId bumps
  useEffect(() => {
    if (!active) {
      setN(0)
      return undefined
    }
    let raf
    const start = performance.now()
    const step = (t) => {
      const p = Math.min(1, (t - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration, runId])

  // random re-trigger loop, each instance staggered independently
  useEffect(() => {
    if (!active || !replay) return undefined
    let timer
    const schedule = () => {
      const wait = 3500 + Math.random() * 5000 // 3.5–8.5s
      timer = setTimeout(() => {
        setRunId((r) => r + 1)
        schedule()
      }, wait)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [active, replay])

  return (
    <>
      {n}
      {suffix}
    </>
  )
}
