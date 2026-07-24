import { useRef } from 'react'
import useInView from '../hooks/useInView.js'
import useDragMarquee from '../hooks/useDragMarquee.js'
import { WordReveal, Reveal } from './reveal.jsx'

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

// Split by even/odd index rather than first-half/second-half. Any two
// consecutive shots (e.g. the near-identical "NxYug8" / "NxYug8 (2)") land in
// DIFFERENT rows, so a duplicate can never sit side by side — and each row's
// own neighbours are non-consecutive originals too.
const ROW_TOP = SHOTS.filter((_, i) => i % 2 === 0)
const ROW_BOTTOM = SHOTS.filter((_, i) => i % 2 === 1)

function Marquee({ items, direction, speed, active }) {
  // rendered twice — the strip travels one full copy then loops seamlessly.
  // JS-driven so it can be grabbed and slid through (see useDragMarquee).
  const trackRef = useRef(null)
  useDragMarquee(trackRef, { speed, direction, active })
  const loop = [...items, ...items]
  return (
    <div className="mq">
      <div className="mq-track is-drag" ref={trackRef}>
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
  const [ref, seen] = useInView({ amount: 0.15 })

  return (
    <section className={`execution${seen ? ' is-live' : ''}`} id="execution" ref={ref}>
      <div className="execution-rails">
        <Marquee items={ROW_TOP} direction={1} speed={46} active={seen} />
        <Marquee items={ROW_BOTTOM} direction={-1} speed={40} active={seen} />
      </div>

      <div className="execution-copy">
        <WordReveal
          className="execution-title"
          active={seen}
          parts={[{ t: 'Execution', red: true }, { t: ' in Focus' }]}
        />
        <Reveal as="p" className="execution-sub" active={seen} delay={0.35} y={18}>
          Step into our world of complete in-house production. From towering outdoor hoardings to
          stunning still photography and cinematic video advertisements, explore how we deliver
          uncompromising quality.
        </Reveal>
      </div>
    </section>
  )
}
