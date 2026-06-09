'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Marketplace', href: '#casos' },
  { label: 'NFT Membership', href: '#nft' },
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-agro-green to-agro-purple flex items-center justify-center text-white font-black text-sm">
            A
          </div>
          <span className="font-bold text-white text-lg">
            AGRO<span className="text-agro-green">VIDA</span>
          </span>
          <span className="ml-1 text-xs bg-agro-purple/20 text-agro-purple-light border border-agro-purple/30 px-2 py-0.5 rounded-full font-medium">
            TOKEN
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#comprar" className="btn-primary text-sm !px-5 !py-2">
            Comprar AGROVIDATOKEN
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-agro-dark-border bg-agro-dark px-4 pb-4 pt-2 space-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-slate-400 hover:text-white py-2 text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#comprar"
            className="btn-primary block text-center text-sm mt-3"
            onClick={() => setOpen(false)}
          >
            Comprar AGROVIDATOKEN
          </a>
          <a
            href="#waitlist"
            className="block text-center text-sm py-2 text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            Lista de Espera
          </a>
        </div>
      )}
    </nav>
  )
}
