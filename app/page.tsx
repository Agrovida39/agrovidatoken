import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MarketComparison from '@/components/MarketComparison'
import UseCases from '@/components/UseCases'
import NFTMembership from '@/components/NFTMembership'
import Tokenomics from '@/components/Tokenomics'
import ValueLoops from '@/components/ValueLoops'
import Roadmap from '@/components/Roadmap'
import BuySection from '@/components/BuySection'
import Waitlist from '@/components/Waitlist'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <MarketComparison />
      <UseCases />
      <NFTMembership />
      <Tokenomics />
      <ValueLoops />
      <Roadmap />
      <BuySection />
      <Waitlist />
      <Footer />
    </main>
  )
}
