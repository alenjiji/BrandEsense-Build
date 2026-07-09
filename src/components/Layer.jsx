import { motion, useTransform } from 'framer-motion'

// Renders one slide element (image or svg) with parallax + entrance + idle
// motion. Centering lives on the plain outer wrapper so framer-motion's x/y
// (which compile to `transform`) can't clobber the translate(-50%,-50%).
export default function Layer({ cfg, mvx, mvy, active, index = 0 }) {
  const { left, top, w, center, z, depth = 24, glow, spin, float } = cfg

  const x = useTransform(mvx, (v) => v * depth)
  const y = useTransform(mvy, (v) => v * depth * 0.62)

  const media = spin ? (
    <motion.img
      src={cfg.src}
      alt=""
      draggable="false"
      animate={{ rotate: 360 }}
      transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
    />
  ) : (
    <img src={cfg.src} alt="" draggable="false" />
  )

  return (
    <div
      className="layer"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: w ? `${w}vw` : undefined,
        zIndex: z,
        transform: center ? 'translate(-50%, -50%)' : undefined,
      }}
    >
      <motion.div className="layer-px" style={{ x, y }}>
        <motion.div
          className="layer-enter"
          initial={{ opacity: 0, scale: 0.94, y: 26 }}
          animate={active ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 26 }}
          transition={{
            duration: 1.1,
            delay: active ? 0.12 + index * 0.06 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className={float ? 'layer-float' : undefined}>
            <div className={glow ? 'layer-media has-glow' : 'layer-media'}>{media}</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
