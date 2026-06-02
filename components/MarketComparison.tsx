const rows = [
  { feature: 'Especialización en salud', agrovida: true, amazon: false, iherb: 'Parcial', super: false },
  { feature: 'Producción local LatAm', agrovida: true, amazon: false, iherb: false, super: 'Parcial' },
  { feature: 'Alimentos + Suplementos + Servicios', agrovida: true, amazon: 'Parcial', iherb: false, super: false },
  { feature: 'Pagos crypto / AGRO', agrovida: true, amazon: false, iherb: false, super: false },
  { feature: 'Membresías con descuento', agrovida: true, amazon: 'Prime', iherb: false, super: 'Loyalty' },
  { feature: 'DAO Governance', agrovida: true, amazon: false, iherb: false, super: false },
  { feature: 'Health dashboard + AI', agrovida: true, amazon: false, iherb: false, super: false },
  { feature: 'NFT membership', agrovida: true, amazon: false, iherb: false, super: false },
  { feature: 'Delivery local LatAm', agrovida: true, amazon: 'Parcial', iherb: false, super: true },
  { feature: 'Comisión marketplace', agrovida: '5%', amazon: '15-40%', iherb: 'N/A', super: '10-20%' },
]

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-agro-green font-bold">✓</span>
  if (value === false) return <span className="text-slate-600">✕</span>
  return <span className="text-agro-gold text-sm font-medium">{value}</span>
}

export default function MarketComparison() {
  return (
    <section id="comparativa" className="py-24 px-4 sm:px-6 bg-agro-dark-card/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-agro-gold text-sm font-semibold uppercase tracking-widest">Ventaja Competitiva</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-4">
            AGROVIDA vs Competencia
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Ningún competidor combina producción local + blockchain + health services + membresías NFT en LatAm.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-agro-dark-border">
                <th className="text-left py-3 px-4 text-slate-500 font-medium w-1/2">Característica</th>
                <th className="text-center py-3 px-4 text-agro-green font-bold">AGROVIDA</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Amazon</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">iHerb</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">Supermercados</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-agro-dark-border/50 ${i % 2 === 0 ? '' : 'bg-agro-dark-card/30'}`}
                >
                  <td className="py-3 px-4 text-slate-300">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    <Cell value={row.agrovida} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Cell value={row.amazon} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Cell value={row.iherb} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Cell value={row.super} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market size comparison */}
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Modelo Anterior</p>
            <h3 className="text-white font-black text-xl mb-1">Agro Token (22 productos)</h3>
            <div className="space-y-1 text-sm text-slate-400 mt-3">
              <div>TAM: <span className="text-white font-medium">$10B</span></div>
              <div>Market cap objetivo: <span className="text-white font-medium">$500M–$1B</span></div>
              <div>Usuarios Y3: <span className="text-white font-medium">100K–1M</span></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-agro-green/10 to-agro-purple/10 border border-agro-green/30 rounded-2xl p-6">
            <p className="text-agro-green text-xs uppercase tracking-wider mb-2 font-semibold">Nuevo Modelo ✓</p>
            <h3 className="text-white font-black text-xl mb-1">Super-Ecosistema Salud & Wellness</h3>
            <div className="space-y-1 text-sm text-slate-400 mt-3">
              <div>TAM: <span className="text-agro-green font-bold">$100B+</span></div>
              <div>Market cap objetivo: <span className="text-agro-green font-bold">$5–10B</span></div>
              <div>Usuarios Y3: <span className="text-agro-green font-bold">3–5M</span></div>
            </div>
            <div className="mt-3 text-agro-gold font-bold text-sm">→ 10–50x más grande</div>
          </div>
        </div>
      </div>
    </section>
  )
}
