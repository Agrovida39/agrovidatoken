'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Marketplace', href: '#casos' },
  { label: 'NFT', href: '#nft' },
  { label: 'Tokenomics', href: '#tokenomics' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Comparativa', href: '#comparativa' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-agro-dark-border bg-agro-dark/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-agro-green to-agro-purple flex items-center justify-center text-white font-black text-sm">A</div>
          <span className="font-bold text-white text-base">AGRO<span className="text-agro-green">VIDA</span></span>
          <span className="text-xs bg-agro-purple/20 text-agro-purple-light border border-agro-purple/30 px-1.5 py-0.5 rounded-full font-medium hidden sm:inline">TOKEN</span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA desktop */}
        <div className="hidden lg:flex items-center">
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
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-slate-400 hover:text-white py-2.5 text-sm font-medium border-b border-agro-dark-border/50">
              {l.label}
            </a>
          ))}
          <div className="pt-3 space-y-2">
            <a href="#comprar" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm">
              Comprar AGROVIDA
            </a>
            <a href="#waitlist" onClick={() => setOpen(false)} className="block text-center text-sm py-2.5 text-slate-400 hover:text-white">
              Lista de Espera
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

