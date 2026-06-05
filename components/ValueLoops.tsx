const loops = [
  {
    num: '01',
    title: 'Loop de Compras',
    color: 'text-agro-green',
    border: 'border-agro-green',
    steps: [
      'Usuario compra alimento saludable',
      'Paga en AGROVIDA → 20% descuento',
      'Demanda de AGROVIDA sube',
      'Precio del token sube',
    ],
  },
  {
    num: '02',
    title: 'Loop de Membresías',
    color: 'text-agro-purple-light',
    border: 'border-agro-purple',
    steps: [
      '1M usuarios pagan $100/año en AGROVIDA',
      '100M AGROVIDA anuales de demanda',
      'AGROVIDA necesario para renovar año 2',
      'Escasez ↑ → Precio ↑',
    ],
  },
  {
    num: '03',
    title: 'Loop de Health Data',
    color: 'text-sky-400',
    border: 'border-sky-500',
    steps: [
      '5M usuarios → datos de salud anónimos',
      'Venta de insights a pharma / research',
      'Ganancias → recompra AGROVIDA en mercado',
      'AGROVIDA comprado → quemado → deflación',
    ],
  },
  {
    num: '04',
    title: 'Loop de Marketplace',
    color: 'text-agro-gold',
    border: 'border-agro-gold',
    steps: [
      '10K terceros venden en Agrovida',
      'Pagan comisiones en AGROVIDA',
      'Demanda constante de terceros',
      'Token utility ↑ → precio floor ↑',
    ],
  },
  {
    num: '05',
    title: 'Loop de Governance',
    color: 'text-pink-400',
    border: 'border-pink-500',
    steps: [
      'DAO propone nuevos productos',
      'Holders votan (min. 1,000 AGROVIDA)',
      'Producto ganador se integra',
      'Holders se benefician → acumulan más AGROVIDA',
    ],
  },
]

export default function ValueLoops() {
  return (
    <section id="loops" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-agro-green text-sm font-semibold uppercase tracking-widest">Tokenomics en Acción</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">5 Loops de Valor del Ecosistema</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Cada actividad en el ecosistema genera demanda del Token AGROVIDA. Los loops se refuerzan entre sí creando un volante económico sostenible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loops.map((loop) => (
            <div
              key={loop.num}
              className={`bg-agro-dark-card border border-agro-dark-border border-l-4 ${loop.border} rounded-2xl p-6 card-glow`}
            >
              <div className={`text-4xl font-black mb-2 ${loop.color} opacity-40`}>{loop.num}</div>
              <h3 className={`font-bold text-lg mb-4 ${loop.color}`}>{loop.title}</h3>
              <ol className="space-y-2">
                {loop.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className={`font-bold flex-shrink-0 ${loop.color}`}>{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}

          {/* Summary card */}
          <div className="bg-gradient-to-br from-agro-purple/20 to-agro-green/10 border border-agro-purple/30 rounded-2xl p-6 flex flex-col justify-center">
            <p className="text-white font-black text-2xl mb-3">
              Resultado
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              5 fuentes independientes de demanda de Token AGROVIDA + deflación continua = presión alcista estructural sobre el precio.
            </p>
            <div className="space-y-2 text-sm">
              {[
                'Deflación 5–10% anual',
                'Utility real, no especulativo',
                'Múltiples revenue streams',
                'DAO governance activo',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-400">
                  <span className="text-agro-green">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
