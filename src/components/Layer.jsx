import { motion, useTransform } from 'framer-motion'

// Renders one slide element (image or svg).
//
// Parallax tracks continuously and is never gated on/off — switching it off
// snapped every layer back to its untranslated position the instant a slide
// deactivated, which was the visible "reset". The perf saving instead comes
// from Hero only mounting layers for the two slides on screen (see `mounted`).
//
// The ring spins via CSS, not framer: an `animate: {rotate}` target has to
// unwind to 0 when the slide deactivates, which read as the ring snapping
// backwards. A paused CSS animation just holds its current angle.
export default function Layer({ cfg, mvx, mvy, index = 0, active = true }) {
  const { left, top, w, center, z, depth = 24, glow, spin, float } = cfg

  const x = useTransform(mvx, (v) => v * depth)
  const y = useTransform(mvy, (v) => v * depth * 0.62)

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
          className="layer-bloom"
          initial={false}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.025 }}
          transition={
            active
              ? { duration: 1.0, delay: 0.42 + index * 0.042, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.55, ease: [0.4, 0, 0.7, 0.6] }
          }
        >
          <div className={float ? 'layer-float' : undefined}>
            <div className={glow ? 'layer-media has-glow' : 'layer-media'}>
              <img
                src={cfg.src}
                alt=""
                draggable="false"
                decoding="async"
                className={spin ? 'layer-spin' : undefined}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
