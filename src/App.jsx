import Hero from './components/Hero.jsx'

export default function App() {
  return (
    <>
      <Hero />
      {/* Next sections are built later. This spacer keeps the page vertically
          scrollable so the hero's scroll-down affordance leads somewhere. */}
      <section className="after-hero" aria-hidden="true" />
    </>
  )
}
