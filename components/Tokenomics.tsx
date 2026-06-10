const distribution = [
  { label: 'Presale / ICO', pct: 25, tokens: '250M', color: '#7c3aed' },
  { label: 'Inversores Institucionales', pct: 20, tokens: '200M', color: '#a78bfa' },
  { label: 'Rewards & Comunidad', pct: 15, tokens: '150M', color: '#22c55e' },
  { label: 'Equipo Fundador (18m vesting)', pct: 15, tokens: '150M', color: '#f59e0b' },
  { label: 'Operaciones', pct: 15, tokens: '150M', color: '#0ea5e9' },
  { label: 'Tesorería', pct: 10, tokens: '100M', color: '#ec4899' },
]

const metrics = [
  { label: 'Supply Total', value: '1B AGROVIDA' },
  { label: 'Precio Presale', value: '$0.001' },
  { label: 'Objetivo Presale', value: '$50–75M' },
  { label: 'Market Cap Año 3', value: '$5–10B' },
  { label: 'Deflación anual', value: '5–10% burn' },
  { label: 'Blockchain', value: 'Ethereum / Polygon' },
]

const burns = [
  { source: 'Comisiones marketplace', pct: '3% de cada tx' },
  { source: 'Renovación membresías', pct: '2% de membresías' },
  { source: 'Venta de health data', pct: '20% del revenue' },
  { source: 'Propuestas DAO', pct: 'Pequeño burn/voto' },
]

const staking = [
  { pool: 'Arándanos (hot)', apy: '15%', color: 'text-agro-green' },
  { pool: 'Proteína Premium', apy: '15%', color: 'text-agro-green' },
  { pool: 'Suplementos', apy: '10%', color: 'text-agro-purple-light' },
  { pool: 'Pool General', apy: '8%', color: 'text-slate-400' },
]

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-agro-green text-sm font-semibold uppercase tracking-widest">Tokenomics</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">Economía del Token AGROVIDA</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Diseñado para deflación sostenida: múltiples mecanismos de burn + utilidad real en marketplace, membresías y governance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">
          {/* Bar chart */}
          <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold mb-4">Distribución</h3>
            {distribution.map((d) => (
              <div key={d.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium">{d.label}</span>
                  <span className="text-slate-400">{d.tokens} · {d.pct}%</span>
                </div>
                <div className="h-2.5 bg-agro-dark rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.pct * 4}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Metrics grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-5 card-glow"
                >
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">{m.label}</p>
                  <p className="text-white text-lg font-bold">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Burn + Staking */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6">
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
              🔥 Mecanismos de Burn (Deflación)
            </h3>
            <div className="space-y-3">
              {burns.map((b) => (
                <div key={b.source} className="flex justify-between text-sm">
                  <span className="text-slate-300">{b.source}</span>
                  <span className="text-red-400 font-medium">{b.pct}</span>
                </div>
              ))}
              <div className="border-t border-agro-dark-border pt-3 text-xs text-slate-500">
                Proyección: ~500M AGROVIDA activos después de 5 años (50% supply quemado)
              </div>
            </div>
          </div>

          <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6">
            <h3 className="text-agro-green font-bold mb-4">📈 Staking Pools</h3>
            <div className="space-y-3">
              {staking.map((s) => (
                <div key={s.pool} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{s.pool}</span>
                  <span className={`font-bold text-base ${s.color}`}>{s.apy}</span>
                </div>
              ))}
              <div className="border-t border-agro-dark-border pt-3 text-xs text-slate-500">
                Yield pagado por comisiones marketplace + pool de membresías + ads de terceros
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory note */}
        <div className="mt-8 bg-agro-gold/10 border border-agro-gold/30 rounded-xl p-4 text-agro-gold text-sm">
          <strong>Nota regulatoria:</strong> AGROVIDA es clasificado como token de utilidad (acceso a servicios del ecosistema AGROVIDA), no como instrumento de inversión. Requiere asesoría legal crypto y cumplimiento regulatorio antes de cualquier oferta pública en Colombia, México, USA y demás jurisdicciones.
        </div>
      </div>
    </section>
  )
}
