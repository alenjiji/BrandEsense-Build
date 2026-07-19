import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

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
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className="services" ref={ref}>
      <motion.h2
        className="services-title"
        initial={{ opacity: 0, y: 20 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Our <span className="is-red">Services</span>
      </motion.h2>

      <div className="services-grid" data-skew>
        {SERVICES.map((s, i) => (
          <motion.article
            className="service"
            key={s.title}
            initial={{ opacity: 0, y: 22 }}
            animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{
              duration: 0.7,
              delay: seen ? 0.12 + i * 0.08 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3 className="service-title">{s.title}</h3>
            <p className="service-body">{s.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
