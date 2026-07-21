import Navbar from './components/Navbar.jsx'
import Cursor from './components/Cursor.jsx'
import Hero from './components/Hero.jsx'
import Partners from './components/Partners.jsx'
import VideoSection from './components/VideoSection.jsx'
import Works from './components/Works.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Execution from './components/Execution.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import useSmoothScroll from './hooks/useSmoothScroll.js'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Cursor />
      <Navbar />
      <Hero />
      <Partners />
      <VideoSection />
      <Works />
      <About />
      <Services />
      <Execution />
      <Testimonials />
      <Footer />
    </>
  )
}
