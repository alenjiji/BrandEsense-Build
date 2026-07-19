import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// "Execution in Focus" — two opposing marquees (top drifts left, bottom drifts
// right) like a streaming-service shelf. Each track renders its set twice and
// travels exactly -50%, so the loop is seamless with no visible seam or reset.
const SHOTS = [
  'Asset 1-8',
  'Asset 2-8',
  'Asset 3-8',
  'Asset 4-8',
  'Asset 5-8',
  'Asset 6-8',
  'Asset 7-8',
  'Asset 8-8',
  'Asset 9-8',
  'Asset 10-8',
  'Asset 11-8',
  'Asset 12-8',
  'Asset 13-8',
  'Asset 14-8',
  'Asset 15-8',
  'Asset 16-8',
  'Asset 17-8',
  'Asset 18-8',
  'NxYug8-8',
  'NxYug8 (2)-8',
  'vpuIom-8',
]

const src = (name) => `/hoardings/${encodeURIComponent(name)}.webp`

const half = Math.ceil(SHOTS.length / 2)
const ROW_TOP = SHOTS.slice(0, half)
const ROW_BOTTOM = SHOTS.slice(half)

function Marquee({ items, dir, speed }) {
  // rendered twice — the animation travels one full copy then loops
  const loop = [...items, ...items]
  return (
    <div className="mq">
      <div
        className={`mq-track mq-track--${dir}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((name, i) => (
          <figure className="mq-item" key={`${name}-${i}`} data-cursor>
            <img
              src={src(name)}
              alt=""
              loading="lazy"
              decoding="async"
              draggable="false"
              aria-hidden={i >= items.length}
            />
          </figure>
        ))}
      </div>
    </div>
  )
}

export default function Execution() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={`execution${seen ? ' is-live' : ''}`} ref={ref}>
      <div className="execution-rails">
        <Marquee items={ROW_TOP} dir="left" speed={64} />
        <Marquee items={ROW_BOTTOM} dir="right" speed={72} />
      </div>

      <motion.div
        className="execution-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="execution-title">
          <span className="is-red">Execution</span> in Focus
        </h2>
        <p className="execution-sub">
          Step into our world of complete in-house production. From towering outdoor hoardings to
          stunning still photography and cinematic video advertisements, explore how we deliver
          uncompromising quality.
        </p>
      </motion.div>
    </section>
  )
}
