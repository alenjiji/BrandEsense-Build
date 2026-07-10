import { motion, useTransform } from 'framer-motion'

// Renders one slide element (image or svg). The slide itself cross-fades
// (clean dissolve), so layers stay static here — they only carry the pointer
// parallax plus any continuous idle motion (spin / float). Centering lives on
// the plain outer wrapper so framer-motion's x/y (which compile to `transform`)
// can't clobber the translate(-50%,-50%).
export default function Layer({ cfg, mvx, mvy }) {
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
        <div className={float ? 'layer-float' : undefined}>
          <div className={glow ? 'layer-media has-glow' : 'layer-media'}>{media}</div>
        </div>
      </motion.div>
    </div>
  )
}
