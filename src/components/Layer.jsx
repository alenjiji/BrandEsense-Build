import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'

// The solid red accent circles get a "liquid" black fill that grows from the
// exact point the cursor enters, and retracts toward the point it leaves.
// They're perfect circles, so a div reproduces them exactly and lets us mask
// an ink-blot fill inside.
function RedBlob() {
  const ref = useRef(null)
  const fillRef = useRef(null)

  const pointAt = (e, s) => {
    const r = ref.current.getBoundingClientRect()
    const f = fillRef.current
    f.style.left = `${((e.clientX - r.left) / r.width) * 100}%`
    f.style.top = `${((e.clientY - r.top) / r.height) * 100}%`
    f.style.transform = `translate(-50%, -50%) scale(${s})`
  }

  return (
    <div
      className="red-blob"
      ref={ref}
      data-cursor="hover"
      onPointerEnter={(e) => pointAt(e, 1)}
      onPointerLeave={(e) => pointAt(e, 0)}
    >
      <span className="red-blob-fill" ref={fillRef} aria-hidden="true" />
    </div>
  )
}

// Renders one slide element (image, svg, or interactive blob). Parallax tracks
// continuously; the ring spins via CSS (see .layer-spin).
export default function Layer({ cfg, mvx, mvy }) {
  const { left, top, w, center, z, depth = 24, glow, spin, float } = cfg
  const isBlob = typeof cfg.src === 'string' && /\/circle_[12]\.svg$/.test(cfg.src)

  const x = useTransform(mvx, (v) => v * depth)
  const y = useTransform(mvy, (v) => v * depth * 0.62)

  let media
  if (isBlob) {
    media = <RedBlob />
  } else if (spin) {
    media = <img src={cfg.src} alt="" draggable="false" decoding="async" className="layer-spin" />
  } else {
    media = <img src={cfg.src} alt="" draggable="false" decoding="async" />
  }

  return (
    <div
      className="layer"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: w ? `${w}%` : undefined,
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
