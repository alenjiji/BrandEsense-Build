import { motion } from 'framer-motion'
import useInView from '../hooks/useInView.js'
import { WordReveal, Reveal } from './reveal.jsx'

const EASE = [0.22, 1, 0.36, 1]

const SERVICES = [
  {
    title: 'Brand Strategy',
    body: "We build the foundational blueprint for your brand's identity and market positioning. By diving deep into market research and consumer behavior, we uncover your unique voice. This ensures every move you make is purposeful, competitive, and primed for long-term growth.",
  },
  {
    title: 'Creative Campaigns',
    body: "Our team designs scroll-stopping, high-impact campaigns that capture attention and inspire action. We blend artistic brilliance with data-driven insights to tell your brand's story across multiple touchpoints. Every campaign is crafted to leave a memorable imprint on your target audience.",
  },
  {
    title: 'Marketing Integration',
    body: 'We synchronize your messaging across all digital and traditional channels for a unified brand presence. From print to social media, we ensure your voice remains consistent and powerful. This 360-degree approach maximizes your reach and drives measurable business results.',
  },
  {
    title: 'PR Management',
    body: "We protect, enhance, and amplify your brand's reputation in the public eye. By cultivating strong media relationships and managing strategic communications, we position you as an industry leader. Our proactive approach ensures your brand narrative is always in your control.",
  },
  {
    title: 'In-house Production',
    body: 'Equipped with state-of-the-art technology, our production team brings visions to life entirely under one roof. We handle everything from stunning still photography to cinematic video advertisements. This guarantees uncompromising quality and a seamless creative process from concept to final cut.',
  },
  {
    title: 'Celebrity Management',
    body: 'We connect your brand with the right influential voices to magnify your market presence. Our team handles the strategic alignment, negotiation, and integration of high-profile partnerships. We ensure these collaborations feel authentic, impactful, and perfectly aligned with your core values.',
  },
]

export default function Services() {
  const [ref, seen] = useInView({ amount: 0.18 })

  return (
    <section className="services" id="services" ref={ref}>
      <WordReveal
        className="services-title"
        active={seen}
        parts={[{ t: 'Our ' }, { t: 'Services', red: true }]}
      />

      <div className="services-grid" data-skew>
        {SERVICES.map((s, i) => {
          // Each card develops into focus (blur + rise + fade), unhurried and
          // clearly staggered so it reads as you scroll past. A hairline accent
          // wipes in beneath the title to give the reveal a deliberate beat.
          const delay = seen ? 0.3 + i * 0.14 : 0
          return (
            <article className="service" key={s.title}>
              <Reveal
                as="h3"
                className="service-title"
                active={seen}
                delay={delay}
                y={22}
                blur={8}
                duration={1}
              >
                {s.title}
              </Reveal>
              <motion.span
                className="service-rule"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={seen ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.9, delay: delay + 0.18, ease: EASE }}
              />
              <Reveal
                as="p"
                className="service-body"
                active={seen}
                delay={delay + 0.16}
                y={20}
                blur={7}
                duration={1.1}
              >
                {s.body}
              </Reveal>
            </article>
          )
        })}
      </div>
    </section>
  )
}
