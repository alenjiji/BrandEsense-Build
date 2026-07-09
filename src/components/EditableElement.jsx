import { useRef } from 'react'

// An element rendered in editor mode: statically placed (no parallax) and
// interactive — drag the body to move, drag the corner handle to resize,
// click to select. All positions stay in viewport % / vw so they map 1:1
// back into slides.js.
export default function EditableElement({ el, selected, onSelect, onChange }) {
  const drag = useRef(null)

  const beginMove = (e) => {
    e.stopPropagation()
    onSelect(el.id)
    drag.current = { mode: 'move', x: e.clientX, y: e.clientY, left: el.left, top: el.top }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const beginResize = (e) => {
    e.stopPropagation()
    onSelect(el.id)
    drag.current = { mode: 'resize', x: e.clientX, w: el.w }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e) => {
    const s = drag.current
    if (!s) return
    if (s.mode === 'move') {
      const dl = ((e.clientX - s.x) / window.innerWidth) * 100
      const dt = ((e.clientY - s.y) / window.innerHeight) * 100
      onChange(el.id, { left: +(s.left + dl).toFixed(2), top: +(s.top + dt).toFixed(2) })
    } else {
      const dw = ((e.clientX - s.x) / window.innerWidth) * 100
      onChange(el.id, { w: Math.max(1.5, +(s.w + dw).toFixed(2)) })
    }
  }

  const endDrag = (e) => {
    drag.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* pointer already released */
    }
  }

  const media =
    el.kind === 'image' ? (
      <div className={el.glow ? 'layer-media has-glow' : 'layer-media'}>
        <img src={el.src} alt="" draggable="false" />
      </div>
    ) : (
      <img src={el.src} alt="" draggable="false" />
    )

  return (
    <div
      className={`edit-el${selected ? ' is-selected' : ''}`}
      style={{
        left: `${el.left}%`,
        top: `${el.top}%`,
        width: el.w ? `${el.w}vw` : undefined,
        zIndex: el.z,
        transform: el.center ? 'translate(-50%, -50%)' : undefined,
      }}
      onPointerDown={beginMove}
      onPointerMove={onMove}
      onPointerUp={endDrag}
    >
      {media}
      {selected && <span className="edit-tag">{el.id}</span>}
      <span
        className="edit-handle"
        onPointerDown={beginResize}
        onPointerMove={onMove}
        onPointerUp={endDrag}
      />
    </div>
  )
}
