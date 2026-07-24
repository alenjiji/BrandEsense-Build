import { useRef } from 'react'
import useInView from '../hooks/useInView.js'
import useDragMarquee from '../hooks/useDragMarquee.js'
import { WordReveal, Reveal } from './reveal.jsx'

// "Words of Trust" — a single slow marquee of testimonial cards. It renders
// the set twice and travels exactly -50% for a seamless loop, and pauses on
// hover so a card can actually be read.
const TESTIMONIALS = [
  {
    name: 'Mousam Abdhulrahiman',
    role: 'Clinic7',
    quote:
      'Brand Esense completely transformed our digital presence. They truly earn trust by taking responsibility for their ultimate success. Their creative campaigns and social media management have been an absolute game-changer for Clinic7.',
  },
  {
    name: 'Jobi Varghese',
    role: 'i-Leaf Steel Doors',
    quote:
      'From dynamic videography to precise social media marketing, the team at Brand Esense delivered on every single front. We place our full confidence in their strategy, knowing they earn trust by taking responsibility for their ultimate success.',
  },
  {
    name: 'Amjeth',
    role: 'Minar Enterprises',
    quote:
      'We needed a team that could handle both creative strategy and flawless execution. Brand Esense delivered on all fronts, proving that their commitment to relentless innovation ensures their boldest visions become reality.',
  },
  {
    name: 'Sankar',
    role: 'HomeFresh Swamys',
    quote:
      'Brand Esense elevated our social media management and marketing effortlessly. The creative posts and videos they produce perfectly capture our brand identity, allowing our team to focus entirely on growing our brand.',
  },
  {
    name: 'Bensy Sebastian',
    role: 'Hair O Craft',
    quote:
      'Partnering with Brand Esense gave us access to comprehensive, 360-degree integrated marketing services. Their cinematic video advertisements and strategic execution perfectly captured the essence of Hair O Craft and elevated our market position.',
  },
]

function Card({ t }) {
  return (
    <figure className="tcard" data-cursor>
      <span className="tcard-mark" aria-hidden="true">
        &ldquo;
      </span>
      <blockquote className="tcard-quote">{t.quote}</blockquote>
      <figcaption className="tcard-by">
        <span className="tcard-name">{t.name}</span>
        <span className="tcard-role">{t.role}</span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const [ref, seen] = useInView({ amount: 0.15 })
  const trackRef = useRef(null)
  useDragMarquee(trackRef, { speed: 30, direction: 1, active: seen })

  const loop = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className={`testimonials${seen ? ' is-live' : ''}`} id="testimonials" ref={ref}>
      <div className="testimonials-head">
        <WordReveal
          className="testimonials-title"
          active={seen}
          parts={[{ t: 'Words of ' }, { t: 'Trust', red: true }]}
        />
        <Reveal as="p" className="testimonials-sub" active={seen} delay={0.35} y={18}>
          We believe the best measure of our success is the success of our clients. Here is what
          industry leaders have to say about their journey with Brand Esense.
        </Reveal>
      </div>

      <div className="tmarquee">
        <div className="tmarquee-track is-drag" ref={trackRef}>
          {loop.map((t, i) => (
            <Card t={t} key={`${t.name}-${i}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
