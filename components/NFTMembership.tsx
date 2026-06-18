'use client'

const tiers = [
  {
    emoji: '🌱',
    name: 'Semilla',
    slug: 'semilla',
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
    slug: 'cosecha',
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
    emoji: '🍄',
    name: 'Funghi',
    slug: 'funghi',
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
    emoji: '🫐',
    name: 'Arándanos',
    slug: 'arandanos',
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
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">
            Tu Membresía Es un NFT con Utilidad Real
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            No son JPEGs aleatorios. Cada NFT desbloquea descuentos permanentes, servicios de salud y acceso a productos exclusivos dentro del ecosistema AGROVIDA.
          </p>
        </div>

        {/* NFT Planta de Arándano — Activo Real */}
        <div className="mb-10 relative bg-gradient-to-br from-[#0d1f12] to-[#0a1628] border border-agro-green/30 rounded-3xl p-6 sm:p-8 overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-agro-green/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            {/* Izquierda: info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">🫐</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-agro-green/20 text-agro-green border border-agro-green/30">
                    NFT Activo Real · Edición Limitada
                  </span>
                  <h3 className="text-white font-black text-2xl sm:text-3xl mt-1">Planta de Arándano</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Adquiere plantas de arándano reales cultivadas en los invernaderos de Agrovida. Nosotros administramos todo el proceso de crecimiento y cosecha. <span className="text-white font-semibold">La fruta que produzcan es tuya.</span>
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-agro-dark/60 border border-agro-dark-border rounded-xl p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Precio por planta</p>
                  <p className="text-white font-black text-xl">$50 <span className="text-slate-400 text-sm font-normal">USD</span></p>
                </div>
                <div className="bg-agro-dark/60 border border-agro-dark-border rounded-xl p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Lote mínimo</p>
                  <p className="text-white font-black text-xl">50 <span className="text-slate-400 text-sm font-normal">plantas</span></p>
                </div>
                <div className="bg-agro-dark/60 border border-agro-dark-border rounded-xl p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Inversión mínima</p>
                  <p className="text-agro-green font-black text-xl">$2,500 <span className="text-slate-400 text-sm font-normal">USD</span></p>
                </div>
                <div className="bg-agro-dark/60 border border-agro-dark-border rounded-xl p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Descuento ecosistema</p>
                  <p className="text-agro-gold font-black text-xl">15% <span className="text-slate-400 text-sm font-normal">con AGRO</span></p>
                </div>
              </div>

              <a
                href="#waitlist?tier=planta-arandano"
                className="inline-block w-full text-center bg-agro-green text-black font-black py-3 rounded-2xl hover:bg-green-400 transition-all text-sm"
              >
                Reservar mis plantas 🫐 →
              </a>
            </div>

            {/* Derecha: beneficios */}
            <div className="space-y-3">
              <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">¿Cómo funciona?</h4>
              {[
                { icon: '🏡', title: 'Cultivo en invernadero', desc: 'Tus plantas crecen en los invernaderos certificados de Agrovida con control total de calidad.' },
                { icon: '⚙️', title: 'Agrovida administra todo', desc: 'Riego, nutrición, poda, control de plagas y cosecha. Tú no tienes que hacer nada.' },
                { icon: '🍇', title: 'La fruta es tuya', desc: 'Toda la producción de tus plantas te pertenece. Puedes recibirla, venderla o donarla.' },
                { icon: '💰', title: '% de administración', desc: 'Agrovida cobra un porcentaje justo por la gestión integral. El resto de la rentabilidad es tuya.' },
                { icon: '🔗', title: 'NFT en Polygon', desc: 'Cada lote de plantas es un NFT transferible. Puedes vender tu posición en el marketplace.' },
                { icon: '🪙', title: 'Descuento con AGRO', desc: '15% de descuento adicional en todo el ecosistema Agrovida usando tokens AGRO.' },
              ].map((b) => (
                <div key={b.title} className="flex gap-3 items-start bg-agro-dark/40 border border-agro-dark-border rounded-xl p-3">
                  <span className="text-xl flex-shrink-0">{b.icon}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{b.title}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membresías de descuento */}
        <h3 className="text-white font-bold text-lg mb-6 text-center">Membresías de Salud & Descuentos</h3>
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
                href={`#waitlist?tier=${t.slug}`}
                onClick={() => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('tier', t.slug)
                  window.history.replaceState(null, '', url)
                }}
                className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 ${
                  t.featured
                    ? 'bg-agro-gold text-black hover:bg-yellow-400'
                    : 'bg-agro-dark border border-agro-dark-border text-slate-300 hover:border-slate-500'
                }`}
              >
                Reservar {t.emoji} →
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
