import { useEffect, useRef, useState } from 'react'

// Shared scroll-trigger. Fires `inView` only once the element has genuinely
// been scrolled to — never early. The negative bottom `rootMargin` pulls the
// trigger line up from the foot of the viewport, so a section has to rise a
// fair way into view before its reveal plays (rather than firing the instant
// its top edge peeks in). Latches on first sight and disconnects.
export default function useInView({ amount = 0.18, margin = '-12%' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: amount, rootMargin: `0px 0px ${margin} 0px` },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount, margin])

  return [ref, inView]
}
