import { Navbar } from '@/components/portfolio/navbar'
import { Hero } from '@/components/portfolio/hero'
import { Services } from '@/components/portfolio/services'
import { Portfolio } from '@/components/portfolio/portfolio'
import { DemoSection } from '@/components/portfolio/demo'
import { Pricing } from '@/components/portfolio/pricing'
import { Testimonials } from '@/components/portfolio/testimonials'
import { Faq } from '@/components/portfolio/faq'
import { Contact } from '@/components/portfolio/contact'
import { Footer } from '@/components/portfolio/footer'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col text-zinc-100">
      {/* wallpaper latar belakang */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-[url('/images/bg-luxury-clean.png')] bg-cover bg-center bg-no-repeat"
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950/95"
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Portfolio />
        <DemoSection />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
