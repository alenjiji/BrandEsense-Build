import Navbar from './components/Navbar.jsx'
import Cursor from './components/Cursor.jsx'
import Preloader from './components/Preloader.jsx'
import Hero from './components/Hero.jsx'
import Partners from './components/Partners.jsx'
import VideoSection from './components/VideoSection.jsx'
import Works from './components/Works.jsx'
import Execution from './components/Execution.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import useSmoothScroll from './hooks/useSmoothScroll.js'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar />
      <Hero />
      <Partners />
      <VideoSection />
      <Works />
      <Execution />
      <About />
      <Services />
      <Testimonials />
      <Footer />
    </>
  )
}
