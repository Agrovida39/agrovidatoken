const categories = [
  {
    title: 'Alimentos Agrovida',
    icon: '🌱',
    color: 'border-agro-green',
    items: ['Arándanos, moras, frambuesas', 'Setas (oyster, shiitake, king trumpet)', 'Frutas tropicales premium', 'Verduras orgánicas', 'Granos ancestrales'],
  },
  {
    title: 'Procesados Premium',
    icon: '🥛',
    color: 'border-agro-purple',
    items: ['Proteína vegetal en polvo', 'Barras de proteína', 'Snacks healthy / chips de frutas', 'Néctares cold-press', 'Chocolates 70%+ cacao'],
  },
  {
    title: 'Suplementos',
    icon: '💊',
    color: 'border-sky-400',
    items: ['Vitaminas (D3, B12, etc.)', 'Omega 3 · Probióticos · Colágeno', 'Curcumina · Ashwagandha', 'Adaptógenos (rhodiola, ginseng)', 'Nootrópicos naturales'],
  },
  {
    title: 'Wellness & Servicios',
    icon: '🧬',
    color: 'border-agro-gold',
    items: ['Membresías NFT (Semilla → Arándanos)', 'Consultas con nutricionistas', 'Planes de nutrición con IA', 'Kit de prueba genética (Funghi+)', 'Integración Oura / Apple Health'],
  },
]

const actors = [
  {
    icon: '🛒',
    role: 'Cliente Final',
    flow: 'Compra alimentos → recibe 10% en AGROVIDA → hace staking → vota en DAO',
    color: 'text-agro-green',
  },
  {
    icon: '🌾',
    role: 'Productor Agrícola',
    flow: 'Vende cosecha → pago instantáneo en AGROVIDA → accede a crédito DeFi',
    color: 'text-agro-purple-light',
  },
  {
    icon: '🚴',
    role: 'Delivery Partner',
    flow: 'Entrega pedidos → gana AGROVIDA → descuento en comisiones → seguros DeFi',
    color: 'text-agro-gold',
  },
  {
    icon: '🏪',
    role: 'Restaurante / B2B',
    flow: 'Compra en volumen → 10% descuento en AGROVIDA → vota en decisiones de producto',
    color: 'text-sky-400',
  },
  {
    icon: '🏥',
    role: 'Médico / Nutricionista',
    flow: 'Prescribe productos Agrovida → gana comisión en AGROVIDA → crea contenido de salud',
    color: 'text-pink-400',
  },
  {
    icon: '🏢',
    role: 'Empresa (B2B2C)',
    flow: 'Compra membresías para empleados → tracking de salud → ROI en productividad',
    color: 'text-emerald-400',
  },
]

export default function UseCases() {
  return (
    <section id="casos" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-agro-purple-light text-sm font-semibold uppercase tracking-widest">Ecosistema</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">
            Un Marketplace para Todo el Ecosistema
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            200+ productos en 4 categorías. 6 tipos de actores que generan demanda de Token AGROVIDA en cada transacción.
          </p>
        </div>

        {/* Product categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className={`bg-agro-dark-card border-t-4 ${cat.color} border-x border-b border-agro-dark-border rounded-2xl p-5 card-glow`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="text-white font-bold mb-3 text-base">{cat.title}</h3>
              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-slate-400 text-xs flex items-start gap-1.5">
                    <span className="text-agro-green mt-0.5 flex-shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Actors */}
        <div className="mb-4">
          <h3 className="text-white font-bold text-xl mb-6 text-center">¿Quién usa el Token AGROVIDA?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actors.map((a) => (
              <div
                key={a.role}
                className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-5 card-glow flex gap-4 items-start"
              >
                <span className="text-3xl flex-shrink-0">{a.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${a.color} mb-1`}>{a.role}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{a.flow}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
