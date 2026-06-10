import { ArrowRight, ShoppingBag, Thermometer, MapPin, Truck } from 'lucide-react'

const pillars = [
  { icon: <ShoppingBag size={20} className="text-agro-green" />, label: 'Ecommerce', desc: 'Tienda online de productos saludables' },
  { icon: <Thermometer size={20} className="text-sky-400" />, label: 'Neveras Smart', desc: 'Puntos de distribución refrigerada' },
  { icon: <MapPin size={20} className="text-agro-purple-light" />, label: 'Puntos de Venta', desc: 'Red física en Colombia' },
  { icon: <Truck size={20} className="text-agro-gold" />, label: 'Logística', desc: 'Entrega a domicilio de productos frescos' },
]

export default function EcosystemBanner() {
  return (
    <section className="py-20 px-4 sm:px-6 border-t border-agro-dark-border">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-agro-green/10 to-agro-purple/10 border border-agro-green/20 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <span className="text-agro-green text-xs font-bold uppercase tracking-widest mb-3 block">Ecosistema Real</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                AGROVIDA ya existe <br />
                <span className="gradient-text">en el mundo físico</span>
              </h2>
              <p className="text-slate-400 max-w-lg mb-6">
                Detrás del token hay una empresa real: ecommerce activo, neveras inteligentes, puntos de venta físicos y una red de distribución de productos saludables en Colombia.
              </p>
              <a href="https://agrovidacol.com" target="_blank" rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2">
                Ver plataforma agrovidacol.com <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[320px]">
              {pillars.map((p) => (
                <div key={p.label} className="bg-agro-dark/60 border border-agro-dark-border rounded-2xl p-4">
                  <div className="mb-2">{p.icon}</div>
                  <p className="text-white font-bold text-sm">{p.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
