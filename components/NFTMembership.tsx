const tiers = [
  {
    emoji: '🌱',
    name: 'Semilla',
    supply: '10,000 NFTs',
    discount: '10%',
    color: 'border-amber-600',
    badge: 'bg-amber-900/30 text-amber-400 border-amber-600/30',
    perks: [
      '10% descuento en compras',
      'Acceso a Discord privado',
      '1 consulta nutricionista/año',
      'Early access nuevos productos',
    ],
  },
  {
    emoji: '🌾',
    name: 'Cosecha',
    supply: '1,000 NFTs',
    discount: '20%',
    color: 'border-slate-400',
    badge: 'bg-slate-700/40 text-slate-300 border-slate-500/30',
    perks: [
      '20% descuento en compras',
      'Meal plans personalizados',
      '4 consultas nutricionista/año',
      'Health dashboard avanzado',
      'Acceso a recetas premium',
    ],
  },
  {
    emoji: '☕',
    name: 'Café',
    supply: '100 NFTs',
    discount: '30%',
    color: 'border-agro-gold',
    badge: 'bg-yellow-900/30 text-agro-gold border-agro-gold/30',
    perks: [
      '30% descuento en compras',
      'Nutricionista VIP asignado',
      'Meal planning + coaching',
      'Kit de prueba genética (ADN)',
      'Integración Oura / Apple Health / Whoop',
      'NFT tradeable en marketplace',
    ],
    featured: true,
  },
  {
    emoji: '🍫',
    name: 'Cacao',
    supply: '10 NFTs',
    discount: '40%',
    color: 'border-sky-400',
    badge: 'bg-sky-900/30 text-sky-300 border-sky-500/30',
    perks: [
      '40% descuento en compras',
      'Nutricionista personal exclusivo',
      'Wellness retreat 1x/año (all-inclusive)',
      'Formulación de suplemento personalizado',
      'Acceso API salud (Oura, Whoop, Fitbit)',
      'Asiento en mesa consultiva DAO',
    ],
  },
]

export default function NFTMembership() {
  return (
    <section id="nft" className="py-24 px-4 sm:px-6 bg-agro-dark-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-agro-purple-light text-sm font-semibold uppercase tracking-widest">Membresías NFT</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">
            Tu Membresía Es un NFT con Utilidad Real
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            No son JPEGs aleatorios. Cada NFT desbloquea descuentos permanentes, servicios de salud y acceso a productos exclusivos dentro del ecosistema AGROVIDA.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative bg-agro-dark-card border-t-4 ${t.color} border-x border-b border-agro-dark-border rounded-2xl p-6 card-glow flex flex-col gap-4 ${t.featured ? 'ring-1 ring-agro-gold/30' : ''}`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-agro-gold text-black text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Más popular
                </div>
              )}

              <div>
                <div className="text-4xl mb-2">{t.emoji}</div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-black text-xl">{t.name}</h3>
                  <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${t.badge}`}>
                    {t.discount} OFF
                  </span>
                </div>
                <p className="text-slate-600 text-xs">{t.supply} · Edición limitada</p>
              </div>

              <ul className="space-y-2 flex-1">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="text-agro-green mt-0.5 flex-shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 ${
                  t.featured
                    ? 'bg-agro-gold text-black hover:bg-yellow-400'
                    : 'bg-agro-dark border border-agro-dark-border text-slate-300 hover:border-slate-500'
                }`}
              >
                Reservar →
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Los NFTs son transferibles y negociables en marketplaces secundarios. El precio varía según demanda. La utilidad está ligada al holder del NFT.
        </p>
      </div>
    </section>
  )
}
