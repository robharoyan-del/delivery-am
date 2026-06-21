import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CountriesStrip from '@/components/CountriesStrip'
import HowItWorks from '@/components/HowItWorks'
import Rates from '@/components/Rates'
import TrackingSection from '@/components/TrackingSection'
import ShopsSection from '@/components/ShopsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CountriesStrip />
        <HowItWorks />
        <Rates />
        <TrackingSection />
        <ShopsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
