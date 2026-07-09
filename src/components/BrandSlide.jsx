import { motion } from 'framer-motion'
import Layer from './Layer.jsx'
import EditableElement from './EditableElement.jsx'
import Heading from './Heading.jsx'

// A brand slide: a flat list of visual elements (portrait, supporting imagery,
// framing graphics) plus the display heading and credit block. In editor mode
// the elements become interactive; otherwise they animate with parallax.
export default function BrandSlide({
  slide,
  elements,
  active,
  mvx,
  mvy,
  editing = false,
  selectedId = null,
  onSelect,
  onChange,
}) {
  const { heading, desc } = slide

  return (
    <div className="slide slide--brand">
      <div className="stage">
        {elements.map((el, i) =>
          editing ? (
            <EditableElement
              key={el.id}
              el={el}
              selected={el.id === selectedId}
              onSelect={onSelect}
              onChange={onChange}
            />
          ) : (
            <Layer key={el.id} cfg={el} mvx={mvx} mvy={mvy} active={active} index={i} />
          )
        )}
      </div>

      {/* left: display heading */}
      <div className="slide-copy slide-copy--left">
        <Heading lines={heading} active={active} className="headline--brand" />
      </div>

      {/* right: credit block (lowered on slides flagged descLow, e.g. Prasad) */}
      <motion.div
        className={`slide-copy slide-copy--right${slide.descLow ? ' is-low' : ''}`}
        initial={{ opacity: 0, x: 30 }}
        animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
        transition={{ duration: 0.9, delay: active ? 0.5 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <h3 className="credit-name">{desc.name}</h3>
        {desc.roleRed ? (
          <p className="credit-text">
            <span className="is-red">{desc.role}</span> {desc.text}
          </p>
        ) : (
          <p className="credit-text">
            <span className="credit-role">{desc.role}</span>
            <br />
            {desc.text}
          </p>
        )}
      </motion.div>
    </div>
  )
}
