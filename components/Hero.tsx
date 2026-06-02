import { ArrowRight, Leaf, TrendingUp, Users, ShoppingBag } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-glow pt-16">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-agro-purple/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-agro-green/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-agro-purple/10 border border-agro-purple/30 rounded-full px-4 py-1.5 text-sm text-agro-purple-light font-medium mb-8">
          <span className="w-2 h-2 bg-agro-green rounded-full animate-pulse2" />
          Presale Q1 2027 · Lista de espera abierta
        </div>

        {/* Eyebrow */}
        <p className="text-agro-green font-bold text-sm uppercase tracking-widest mb-4">
          El Amazon de Salud & Bienestar para Latinoamérica
        </p>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
          Más que un Token.{' '}
          <br />
          <span className="gradient-text">Un Super-Ecosistema</span>
          <br />
          de Salud & Bienestar
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
          <strong className="text-white">AGROVIDA</strong> conecta alimentos saludables,
          suplementos premium, membresías wellness y servicios de salud —
          todo pagado y recompensado en <strong className="text-agro-green">AGRO</strong>.{' '}
          Mercado objetivo: <strong className="text-white">$100B+</strong> en LatAm.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#waitlist" className="btn-primary flex items-center justify-center gap-2">
            Reservar lugar en Presale <ArrowRight size={18} />
          </a>
          <a href="#nft" className="btn-outline flex items-center justify-center gap-2">
            Ver Membresías NFT
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: <ShoppingBag size={18} className="text-agro-green" />, value: '$100B+', label: 'TAM LatAm' },
            { icon: <Leaf size={18} className="text-agro-purple-light" />, value: '1B AGRO', label: 'Supply Total' },
            { icon: <TrendingUp size={18} className="text-agro-gold" />, value: '15% APY', label: 'Staking Máx.' },
            { icon: <Users size={18} className="text-sky-400" />, value: '5M+', label: 'Usuarios Objetivo Y3' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-4 card-glow"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {s.icon}
                <span className="text-lg font-bold text-white">{s.value}</span>
              </div>
              <p className="text-slate-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
