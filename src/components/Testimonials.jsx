import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// "Words of Trust" — a single slow marquee of testimonial cards. It renders
// the set twice and travels exactly -50% for a seamless loop, and pauses on
// hover so a card can actually be read. No avatar assets were supplied, so
// initials stand in for the photos (swap for images when available).
const TESTIMONIALS = [
  { name: 'Rahul Easwar', role: 'Lorem ipsum dolor' },
  { name: 'Clara James', role: 'Lorem ipsum dolor' },
  { name: 'Supriya Zak', role: 'Lorem ipsum dolor' },
  { name: 'Jacob Steer', role: 'Lorem ipsum dolor' },
  { name: 'Meera Nair', role: 'Lorem ipsum dolor' },
  { name: 'David Chen', role: 'Lorem ipsum dolor' },
]

const QUOTE =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo'

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function Card({ t }) {
  return (
    <figure className="tcard" data-cursor>
      <span className="tcard-avatar" aria-hidden="true">
        {initials(t.name)}
      </span>
      <blockquote className="tcard-quote">{QUOTE}</blockquote>
      <figcaption>
        <span className="tcard-sign">{t.name}</span>
        <span className="tcard-role">{t.role}</span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const loop = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className={`testimonials${seen ? ' is-live' : ''}`} ref={ref}>
      <motion.div
        className="testimonials-head"
        initial={{ opacity: 0, y: 22 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="testimonials-title">
          Words of <span className="is-red">Trust</span>
        </h2>
        <p className="testimonials-sub">
          We believe the best measure of our success is the success of our clients. Here is what
          industry leaders have to say about their journey with Brand Esense.
        </p>
      </motion.div>

      <div className="tmarquee">
        <div className="tmarquee-track">
          {loop.map((t, i) => (
            <Card t={t} key={`${t.name}-${i}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
