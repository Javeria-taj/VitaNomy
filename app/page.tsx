import { Navbar } from '@/components/Landing/Navbar'
import { Hero } from '@/components/Landing/Hero'
import { Marquee } from '@/components/Landing/Marquee'
import { Features } from '@/components/Landing/Features'
import { HowItWorks } from '@/components/Landing/HowItWorks'
import { Footer } from '@/components/Landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cr text-tx font-sans flex flex-col">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
