import { useState } from 'react'
import { PALETTE } from '../data/slides.js'

// Serialise a slide's element list back into the exact `img(...)` / object
// form used in slides.js, so tuned positions can be pasted straight in.
function formatElements(elements) {
  const num = (v) => (Number.isInteger(v) ? v : +(+v).toFixed(2))
  const line = (el) => {
    const parts = [`id: '${el.id}'`, `kind: '${el.kind}'`, `src: '${el.src}'`]
    parts.push(`left: ${num(el.left)}`, `top: ${num(el.top)}`, `w: ${num(el.w)}`)
    parts.push(`z: ${el.z}`, `depth: ${el.depth}`)
    if (el.center) parts.push('center: true')
    if (el.glow) parts.push('glow: true')
    if (el.spin) parts.push('spin: true')
    if (el.float) parts.push('float: true')
    return `  { ${parts.join(', ')} },`
  }
  return `elements: [\n${elements.map(line).join('\n')}\n],`
}

function Field({ label, value, step = 0.5, onChange }) {
  return (
    <label className="ep-field">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="ep-toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

export default function EditorPanel({
  slideId,
  editable,
  elements,
  selectedId,
  onSelect,
  onChange,
  onAdd,
  onRemove,
  onDuplicate,
  onReorder,
  onClose,
  onReset,
}) {
  const [copied, setCopied] = useState('')
  const sel = elements?.find((e) => e.id === selectedId)

  const copy = async (text, tag) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(tag)
      setTimeout(() => setCopied(''), 1500)
    } catch {
      setCopied('clipboard blocked — select the text box')
    }
  }

  return (
    <aside className="editor-panel" onPointerDown={(e) => e.stopPropagation()}>
      <div className="ep-head">
        <strong>Layout editor</strong>
        <button className="ep-x" onClick={onClose} title="Exit editor">
          ✕
        </button>
      </div>

      {!editable ? (
        <p className="ep-note">Switch to a brand slide (dots below) to edit its layers.</p>
      ) : (
        <>
          <p className="ep-note">
            Editing <b>{slideId}</b>. Drag to move, corner handle to resize.
          </p>

          {/* layer list */}
          <div className="ep-section">
            <div className="ep-label">Layers (top → bottom)</div>
            <div className="ep-layers">
              {[...elements]
                .sort((a, b) => b.z - a.z)
                .map((el) => (
                  <button
                    key={el.id}
                    className={`ep-layer${el.id === selectedId ? ' is-sel' : ''}`}
                    onClick={() => onSelect(el.id)}
                  >
                    <span className="ep-swatch">{el.kind === 'svg' ? '◆' : '▣'}</span>
                    <span className="ep-layer-id">{el.id}</span>
                    <span className="ep-z">z{el.z}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* selected controls */}
          {sel ? (
            <div className="ep-section">
              <div className="ep-label">
                Selected: <b>{sel.id}</b>
              </div>
              <div className="ep-grid">
                <Field label="left %" value={sel.left} onChange={(v) => onChange(sel.id, { left: v })} />
                <Field label="top %" value={sel.top} onChange={(v) => onChange(sel.id, { top: v })} />
                <Field label="width vw" value={sel.w} onChange={(v) => onChange(sel.id, { w: v })} />
                <Field label="z-index" value={sel.z} step={1} onChange={(v) => onChange(sel.id, { z: v })} />
                <Field label="depth" value={sel.depth} step={2} onChange={(v) => onChange(sel.id, { depth: v })} />
              </div>
              <div className="ep-toggles">
                <Toggle label="center" checked={sel.center} onChange={(v) => onChange(sel.id, { center: v })} />
                <Toggle label="glow" checked={sel.glow} onChange={(v) => onChange(sel.id, { glow: v })} />
                <Toggle label="spin" checked={sel.spin} onChange={(v) => onChange(sel.id, { spin: v })} />
                <Toggle label="float" checked={sel.float} onChange={(v) => onChange(sel.id, { float: v })} />
              </div>
              <div className="ep-btns">
                <button onClick={() => onReorder(sel.id, 'front')}>Front</button>
                <button onClick={() => onReorder(sel.id, 'fwd')}>▲</button>
                <button onClick={() => onReorder(sel.id, 'bwd')}>▼</button>
                <button onClick={() => onReorder(sel.id, 'back')}>Back</button>
                <button onClick={() => onDuplicate(sel.id)}>Duplicate</button>
                <button className="ep-danger" onClick={() => onRemove(sel.id)}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <p className="ep-note ep-dim">Select a layer to edit its properties.</p>
          )}

          {/* palette */}
          <div className="ep-section">
            <div className="ep-label">Add element</div>
            <div className="ep-palette">
              {PALETTE.map((p) => (
                <button key={p.src} className="ep-asset" onClick={() => onAdd(p.src)} title={p.label}>
                  <img src={p.src} alt="" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* export */}
          <div className="ep-section">
            <div className="ep-label">Export</div>
            <div className="ep-btns">
              <button onClick={() => copy(formatElements(elements), 'this slide')}>Copy this slide</button>
              <button onClick={onReset} className="ep-danger">
                Reset slide
              </button>
            </div>
            {copied && <div className="ep-copied">Copied {copied} ✓</div>}
            <textarea className="ep-out" readOnly value={formatElements(elements)} />
          </div>
        </>
      )}
    </aside>
  )
}
