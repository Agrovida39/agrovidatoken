const phases = [
  {
    id: 'Q1',
    name: 'MVP & Presale',
    period: 'Meses 1–3',
    status: 'active',
    items: [
      'Smart contracts ERC-20 + Staking',
      'Auditoría de seguridad',
      'DAO Governance',
      'Presale + ICO ($50–75M objetivo)',
      'Marketplace MVP (50 productos)',
      'App móvil beta',
      'Membresías NFT — lanzamiento',
    ],
  },
  {
    id: 'Q2',
    name: 'Full Launch',
    period: 'Meses 4–6',
    status: 'upcoming',
    items: [
      '200+ productos (Agrovida + terceros)',
      'Health dashboard con IA',
      'Integración Oura / Apple Health / Whoop',
      'Entrada a México',
      '100K+ usuarios activos',
      '$50M GMV objetivo',
    ],
  },
  {
    id: 'Q3',
    name: 'Expansión LatAm',
    period: 'Meses 7–9',
    status: 'upcoming',
    items: [
      '500+ productos',
      '4 países: CO · MX · AR · PE',
      'Equipo de nutricionistas (10)',
      'Health coaching premium',
      'Prueba piloto de testing genético',
    ],
  },
  {
    id: 'Q4',
    name: 'Infraestructura',
    period: 'Meses 10–12',
    status: 'upcoming',
    items: [
      'DAO Governance V1 activo',
      'Programa de monetización de health data',
      'Ventas B2B empresas (wellness programs)',
      '500K+ usuarios',
      '$200M GMV',
    ],
  },
  {
    id: 'Y2 H1',
    name: 'Expansión Global',
    period: 'Meses 13–18',
    status: 'upcoming',
    items: [
      'Entrada a USA (mercado hispano)',
      'Brasil (mayor mercado LatAm)',
      'Exploración Europa (ES / PT)',
      '1M+ usuarios',
      '$500M+ GMV',
    ],
  },
  {
    id: 'Y2 H2',
    name: 'Consolidación',
    period: 'Meses 19–24',
    status: 'upcoming',
    items: [
      'Rentabilidad objetivo',
      'Seguros de salud descentralizados',
      'Integración con prescripciones médicas',
      '3–5M usuarios',
      '$1.5B GMV · Market cap $5–10B',
    ],
  },
]

const statusStyles: Record<string, string> = {
  active: 'border-agro-green bg-agro-green/5',
  upcoming: 'border-agro-dark-border bg-agro-dark-card',
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 bg-agro-dark-card/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-agro-gold text-sm font-semibold uppercase tracking-widest">Roadmap</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">Plan 24 Meses</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            De presale a 5M usuarios y $1.5B GMV. Hitos claros, medibles y verificables en blockchain.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {phases.map((p) => (
            <div
              key={p.id}
              className={`border rounded-2xl p-6 card-glow ${statusStyles[p.status]}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-agro-purple-light font-black text-lg">{p.id}</span>
                {p.status === 'active' && (
                  <span className="text-[10px] bg-agro-green/20 text-agro-green border border-agro-green/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    En progreso
                  </span>
                )}
              </div>
              <h3 className="text-white font-black text-xl mb-1">{p.name}</h3>
              <p className="text-slate-500 text-xs mb-4">{p.period}</p>
              <ul className="space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className={`flex-shrink-0 mt-0.5 ${p.status === 'active' ? 'text-agro-green' : 'text-slate-600'}`}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Financial projections */}
        <div className="mt-10 bg-agro-dark-card border border-agro-dark-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-agro-dark-border">
            <h3 className="text-white font-bold">Proyecciones Financieras</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-agro-dark-border">
                  <th className="text-left py-3 px-6 text-slate-500 font-medium">Métrica</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Año 1</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Año 2</th>
                  <th className="text-center py-3 px-4 text-agro-green font-bold">Año 3</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Precio AGRO', y1: '$0.75', y2: '$2.50', y3: '$5–10' },
                  { label: 'Market Cap', y1: '$750M', y2: '$2.5B', y3: '$5–10B' },
                  { label: 'Usuarios Activos', y1: '200K', y2: '1M', y3: '3–5M' },
                  { label: 'GMV', y1: '$100M', y2: '$500M', y3: '$1.5B' },
                  { label: 'Revenue Total', y1: '$3.8M', y2: '$24.5M', y3: '$85M' },
                ].map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? '' : 'bg-agro-dark/30'}>
                    <td className="py-3 px-6 text-slate-300 font-medium">{row.label}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.y1}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{row.y2}</td>
                    <td className="py-3 px-4 text-center text-agro-green font-bold">{row.y3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
