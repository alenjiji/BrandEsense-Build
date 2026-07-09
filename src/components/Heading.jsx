import { motion } from 'framer-motion'

// Renders a multi-line display heading where each line is an array of
// {t, red} spans. Lines rise + fade in with a stagger when the slide is active.
export default function Heading({ lines, active, className = '' }) {
  return (
    <h1 className={`headline ${className}`} aria-label={lines.map((l) => l.map((s) => s.t).join('')).join(' ')}>
      {lines.map((line, i) => (
        <span className="headline-line" key={i}>
          <motion.span
            className="headline-inner"
            initial={{ y: '110%', opacity: 0 }}
            animate={active ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.9,
              delay: active ? 0.2 + i * 0.08 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line.map((span, j) => (
              <span key={j} className={span.red ? 'is-red' : 'is-grey'}>
                {span.t}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}
