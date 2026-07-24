import useInView from '../hooks/useInView.js'
import { Reveal, CountUp } from './reveal.jsx'

const STATS = [
  { num: '25+', label: 'Years Experience' },
  { num: '32+', label: 'Happy Clients' },
  { num: '100+', label: 'Projects' },
  { num: '20+', label: 'Hard Workers' },
]

// Brand story + headline numbers. The copy runs across two ruled columns,
// splitting mid-sentence exactly as the design does.
export default function About() {
  const [ref, seen] = useInView({ amount: 0.2 })

  return (
    <section className="about" id="about" ref={ref}>
      <img
        className="about-emblem"
        src="/video_section/brand_Essense_bg.svg"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <div className="about-top">
        <Reveal className="about-logo-wrap" active={seen} y={0} duration={1}>
          <img
            className="about-logo"
            src="/logo/logo_outline_2.svg"
            alt="Brand Esense"
            loading="lazy"
            draggable="false"
          />
        </Reveal>
        <div className="about-cols">
          <Reveal as="p" className="about-col" active={seen} delay={0.2} y={22}>
            Born from the creative passion and visionary leadership of Prasad Yogi, Brand Esense is
            a hub of relentless innovation. We specialize in bridging the gap between traditional
            advertising and cutting-edge digital marketing to give your brand a definitive edge.
          </Reveal>
          <Reveal as="p" className="about-col" active={seen} delay={0.34} y={22}>
            By combining deep strategic insights with bold
            creativity, our mission is to transform bold ideas into unforgettable visual stories
            that drive real-world results.
          </Reveal>
        </div>
      </div>

      <div className="about-stats">
        {STATS.map((s, i) => (
          <Reveal
            className="stat"
            key={s.label}
            active={seen}
            delay={0.35 + i * 0.12}
            y={20}
          >
            <span className="stat-num">
              <CountUp value={s.num} active={seen} replay />
            </span>
            <span className="stat-label">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
