'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Marketplace', href: '#casos' },
  { label: 'NFT', href: '#nft' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Staking 10%', href: '#staking', highlight: true },
  { label: 'Roadmap', href: '#roadmap' },
  { label: '📄 Whitepaper', href: '/whitepaper', wp: true },
  { label: '🌿 Ecosistema', href: 'https://agrovidacol.com', external: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-agro-dark-border bg-agro-dark/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo-.png" alt="AGROVIDA" className="w-9 h-9 rounded-full object-cover border border-agro-purple/40" />
          <span className="font-bold text-white text-base">AGRO<span className="text-agro-green">VIDA</span></span>
          <span className="text-xs bg-agro-purple/20 text-agro-purple-light border border-agro-purple/30 px-1.5 py-0.5 rounded-full font-medium hidden sm:inline">TOKEN</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5">
          {links.map((l) => (
            <a key={l.href} href={l.href} {...((l as any).external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`text-sm font-medium transition-colors ${
                (l as any).external ? 'text-agro-green hover:text-white' :
                (l as any).highlight ? 'text-amber-400 hover:text-white font-bold' :
                (l as any).wp ? 'text-agro-purple-light hover:text-white font-semibold' :
                'text-slate-400 hover:text-white'
              }`}>
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <a href="https://app.uniswap.org/explore/tokens/polygon/0xfb172a5f2dd76ea03d225e78cfcc2f21773aedf5" target="_blank" rel="noopener noreferrer"
            className="text-sm border border-agro-purple/40 text-agro-purple-light hover:bg-agro-purple/10 px-3 py-2 rounded-xl font-medium transition-colors">
            Uniswap ↗
          </a>
          <a href="#comprar" className="btn-primary text-sm !px-4 !py-2">
            Comprar AGROVIDA
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-agro-dark-border bg-agro-dark px-4 pb-4 pt-2 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              {...((l as any).external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`block py-2.5 text-sm font-medium border-b border-agro-dark-border/50 ${
                (l as any).wp ? 'text-agro-purple-light font-bold' :
                (l as any).highlight ? 'text-amber-400 font-bold' :
                (l as any).external ? 'text-agro-green' :
                'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3">
            <a href="#comprar" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm">
              Comprar AGROVIDA
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
