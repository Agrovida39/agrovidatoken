import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import MarketComparison from '@/components/MarketComparison'
import Tokenomics from '@/components/Tokenomics'
import NFTMembership from '@/components/NFTMembership'
import UseCases from '@/components/UseCases'
import ValueLoops from '@/components/ValueLoops'
import Roadmap from '@/components/Roadmap'
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
      <Waitlist />
      <Footer />
    </main>
  )
}
