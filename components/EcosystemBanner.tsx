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
              <div className="flex flex-wrap gap-3">
                <a href="https://agrovidacol.com" target="_blank" rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2">
                  Ver plataforma agrovidacol.com <ArrowRight size={16} />
                </a>
                <a href="https://t.me/Agro_vida" target="_blank" rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/></svg>
                  Únete al Telegram
                </a>
              </div>
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
