import Hero from './Hero'
import Skills from './Skills'
import Projects from './Projects'
import About from './About'
import Testimonials from './Testimonials'
import Contact from './Contact'
import Footer from './Footer'

/** Passed through the client shell as a server-rendered slot. */
export default function HomeContent() {
  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
