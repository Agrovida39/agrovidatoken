export const metadata = {
  title: 'Whitepaper — AGROVIDA Token (AGRO)',
  description: 'Documento técnico oficial del token AGROVIDA (AGRO) en Polygon Mainnet. Tokenomics, trazabilidad blockchain, roadmap y contrato inteligente verificado.',
}

export default function WhitepaperPage() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: '#fff', color: '#1a1a2e', lineHeight: 1.7, fontSize: 15 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        .page{max-width:860px;margin:0 auto;padding:60px 40px}
        .cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:linear-gradient(135deg,#0f0f1a 0%,#1a0a3e 50%,#0a1a2e 100%);color:#fff;padding:80px 40px}
        .cover h1{font-size:52px;font-weight:900;background:linear-gradient(135deg,#7c3aed,#3b82f6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px}
        .cover h2{font-size:22px;font-weight:300;color:#94a3b8;margin-bottom:40px;letter-spacing:2px;text-transform:uppercase}
        .cover-badge{display:inline-block;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#22c55e;padding:8px 24px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:1px;margin-bottom:40px}
        .cover-meta{display:flex;gap:48px;justify-content:center;flex-wrap:wrap;margin-top:40px}
        .cover-meta .val{font-size:26px;font-weight:700;color:#fff}
        .cover-meta .lbl{font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:4px}
        .section{padding:56px 0;border-bottom:1px solid #f1f5f9}
        .section:last-child{border-bottom:none}
        .section-num{font-size:12px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
        h2.st{font-size:32px;font-weight:800;color:#1a1a2e;margin-bottom:8px}
        .ssub{font-size:16px;color:#64748b;margin-bottom:32px}
        h3{font-size:18px;font-weight:700;color:#1e293b;margin:28px 0 12px}
        p{color:#374151;margin-bottom:16px}
        ul{padding-left:20px;margin-bottom:16px}
        li{color:#374151;margin-bottom:8px}
        .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:20px;margin:28px 0}
        .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center}
        .card .val{font-size:24px;font-weight:800;color:#7c3aed;margin-bottom:4px}
        .card .lbl{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px}
        table{width:100%;border-collapse:collapse;margin:20px 0;font-size:14px}
        th{background:#7c3aed;color:#fff;padding:12px 16px;text-align:left;font-weight:600}
        td{padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#374151}
        tr:nth-child(even) td{background:#f8fafc}
        .dist-row{margin:12px 0}
        .dist-label{display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px}
        .dist-label span:first-child{color:#1e293b;font-weight:500}
        .dist-label span:last-child{color:#64748b}
        .bar-bg{height:8px;background:#f1f5f9;border-radius:99px;overflow:hidden}
        .bar{height:100%;border-radius:99px}
        .roadmap{position:relative;padding-left:32px}
        .roadmap::before{content:'';position:absolute;left:8px;top:0;bottom:0;width:2px;background:linear-gradient(#7c3aed,#06b6d4)}
        .rm-item{position:relative;margin-bottom:32px}
        .rm-dot{position:absolute;left:-28px;top:4px;width:16px;height:16px;border-radius:50%;border:3px solid #7c3aed;background:#fff}
        .rm-dot.done{background:#22c55e;border-color:#22c55e}
        .rm-q{font-size:12px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
        .rm-title{font-size:16px;font-weight:700;color:#1e293b;margin-bottom:8px}
        .rm-items{list-style:none;padding:0}
        .rm-items li{font-size:14px;color:#64748b;padding:2px 0}
        .rm-items li::before{content:'→ ';color:#7c3aed}
        .addr{background:#0f172a;color:#22c55e;padding:16px 20px;border-radius:12px;font-family:monospace;font-size:13px;word-break:break-all;margin:16px 0}
        .disclaimer{background:#fef9c3;border:1px solid #fde047;border-radius:12px;padding:20px;font-size:13px;color:#713f12;margin-top:32px}
        .print-btn{position:fixed;bottom:32px;right:32px;background:#7c3aed;color:#fff;border:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 24px rgba(124,58,237,0.4);z-index:999}
        .print-btn:hover{background:#6d28d9}
        @media print{.print-btn{display:none}.cover{min-height:auto;padding:60px}}
      `}</style>

      <button className="print-btn" onClick={() => window.print()}>⬇ Descargar PDF</button>

      {/* PORTADA */}
      <div className="cover">
        <svg width="110" height="110" viewBox="0 0 512 512" style={{marginBottom:28}} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed"/>
              <stop offset="50%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient>
            <linearGradient id="lg" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4"/>
              <stop offset="100%" stopColor="#22c55e"/>
            </linearGradient>
          </defs>
          <path d="M218 148 C200 120 195 85 210 62 C220 47 238 50 244 70 C250 90 244 125 228 148 Z" fill="url(#lg)" transform="rotate(-15,228,105)"/>
          <path d="M294 148 C312 120 317 85 302 62 C292 47 274 50 268 70 C262 90 268 125 284 148 Z" fill="url(#lg)" transform="rotate(15,284,105)"/>
          <path d="M165 210 C165 170 135 148 105 165 C75 182 68 220 80 255 L100 310 C115 348 148 362 178 348 C200 338 210 318 205 298 L198 278 C194 264 180 260 170 270 C160 280 163 296 172 306 L178 316 C186 326 184 342 172 347 C160 352 145 342 136 326 L116 272 C105 248 108 216 128 202 C148 188 168 196 172 214 Z" fill="url(#cg)"/>
          <path d="M347 210 C347 170 377 148 407 165 C437 182 444 220 432 255 L412 310 C397 348 364 362 334 348 C312 338 302 318 307 298 L314 278 C318 264 332 260 342 270 C352 280 349 296 340 306 L334 316 C326 326 328 342 340 347 C352 352 367 342 376 326 L396 272 C407 248 404 216 384 202 C364 188 344 196 340 214 Z" fill="url(#cg)"/>
          <rect x="196" y="268" width="120" height="72" rx="36" fill="url(#cg)"/>
        </svg>
        <div className="cover-badge">🌿 Token de Utilidad · Red Polygon</div>
        <h1>AGROVIDA</h1>
        <h2>Whitepaper v1.0</h2>
        <p style={{color:'#94a3b8',maxWidth:520,margin:'0 auto 40px'}}>El token que conecta la economía agrícola con la tecnología blockchain — trazabilidad, marketplace y gobernanza descentralizada para el sector agro.</p>
        <div className="cover-meta">
          <div><div className="val">1B</div><div className="lbl">Supply Total</div></div>
          <div><div className="val">$0.001</div><div className="lbl">Precio Presale</div></div>
          <div><div className="val">2%</div><div className="lbl">Burn por Tx</div></div>
          <div><div className="val">10%</div><div className="lbl">APY Staking</div></div>
          <div><div className="val">Polygon</div><div className="lbl">Blockchain</div></div>
        </div>
        <div style={{marginTop:60,fontSize:12,color:'#475569'}}>Junio 2026 · Colombia · MIT License</div>
      </div>

      <div className="page">

        {/* 01 */}
        <div className="section">
          <div className="section-num">01</div>
          <h2 className="st">Resumen Ejecutivo</h2>
          <p>AGROVIDA (AGRO) es un token de utilidad ERC-20 desplegado en la red Polygon que impulsa el ecosistema digital de AGROVIDA — una plataforma colombiana que conecta productores agrícolas, consumidores y comerciantes mediante tecnología blockchain, inteligencia artificial y comercio electrónico.</p>
          <p>El token permite acceder a servicios premium del ecosistema: registrar eventos agrícolas en blockchain (trazabilidad), participar en el marketplace de productos frescos, obtener membresías NFT y gobernar el protocolo mediante propuestas DAO.</p>
          <p>AGROVIDA incorpora un mecanismo deflacionario automático del <strong>2% de burn por cada transferencia</strong>, proyectando ~500M AGRO activos a 5 años (50% del supply quemado).</p>
          <div className="cards">
            <div className="card"><div className="val">1B</div><div className="lbl">Supply Máximo</div></div>
            <div className="card"><div className="val">$0.001</div><div className="lbl">USD Presale</div></div>
            <div className="card"><div className="val">2%</div><div className="lbl">Burn Automático</div></div>
            <div className="card"><div className="val">Polygon</div><div className="lbl">Blockchain</div></div>
            <div className="card"><div className="val">MIT</div><div className="lbl">Licencia</div></div>
          </div>
        </div>

        {/* 02 */}
        <div className="section">
          <div className="section-num">02</div>
          <h2 className="st">Problema y Solución</h2>
          <h3>El problema del agro latinoamericano</h3>
          <ul>
            <li><strong>Falta de trazabilidad:</strong> el consumidor no sabe el origen real de los alimentos que compra.</li>
            <li><strong>Intermediarios excesivos:</strong> el productor recibe entre el 20-30% del precio final al consumidor.</li>
            <li><strong>Acceso limitado a financiamiento:</strong> los pequeños agricultores no tienen historial crediticio formal.</li>
            <li><strong>Desperdicio de alimentos:</strong> sin cadena de frío ni logística eficiente, se pierde hasta el 40% de la cosecha.</li>
            <li><strong>Informalidad total:</strong> la mayoría de transacciones entre fincas y tiendas son en efectivo sin registro.</li>
          </ul>
          <h3>La solución AGROVIDA</h3>
          <ul>
            <li>App de gestión operacional (inventario, domicilios, neveras, finanzas)</li>
            <li>Módulo Finca con registro blockchain de actividades agrícolas</li>
            <li>Marketplace de productos frescos con ecommerce integrado</li>
            <li>Sistema de puntos nevera para distribución en frío</li>
            <li>ChatBot WhatsApp para pedidos y atención al cliente</li>
            <li>Token AGRO como capa de incentivos y gobernanza</li>
          </ul>
        </div>

        {/* 03 */}
        <div className="section">
          <div className="section-num">03</div>
          <h2 className="st">El Ecosistema AGROVIDA</h2>
          <table>
            <thead><tr><th>Capa</th><th>Componente</th><th>Descripción</th></tr></thead>
            <tbody>
              <tr><td>App Operacional</td><td>agrovidacol.com</td><td>Panel admin: inventario, domicilios, neveras, finanzas</td></tr>
              <tr><td>App Operacional</td><td>Módulo Finca</td><td>Dashboard productor: producción, gastos, ventas, trazabilidad</td></tr>
              <tr><td>App Operacional</td><td>Ecommerce</td><td>Tienda online de productos frescos</td></tr>
              <tr><td>IA</td><td>LucidBot</td><td>ChatBot WhatsApp para pedidos y servicio al cliente</td></tr>
              <tr><td>IA</td><td>Gerente IA</td><td>Análisis inteligente del negocio</td></tr>
              <tr><td>Blockchain</td><td>AGRO Token</td><td>Token de utilidad ERC-20 en Polygon</td></tr>
              <tr><td>Blockchain</td><td>Trazabilidad</td><td>Registro on-chain de eventos agrícolas</td></tr>
              <tr><td>Blockchain</td><td>Staking</td><td>Pool al 10% APY para holders</td></tr>
            </tbody>
          </table>
        </div>

        {/* 04 */}
        <div className="section">
          <div className="section-num">04</div>
          <h2 className="st">Tokenomics</h2>
          <div className="ssub">Distribución del supply total de 1,000,000,000 AGROVIDA</div>
          <div className="dist-row"><div className="dist-label"><span>Presale / ICO</span><span>250M · 25%</span></div><div className="bar-bg"><div className="bar" style={{width:'100%',background:'#7c3aed'}}></div></div></div>
          <div className="dist-row"><div className="dist-label"><span>Inversores Institucionales</span><span>200M · 20%</span></div><div className="bar-bg"><div className="bar" style={{width:'80%',background:'#a78bfa'}}></div></div></div>
          <div className="dist-row"><div className="dist-label"><span>Rewards y Comunidad</span><span>150M · 15%</span></div><div className="bar-bg"><div className="bar" style={{width:'60%',background:'#22c55e'}}></div></div></div>
          <div className="dist-row"><div className="dist-label"><span>Equipo Fundador (vesting 18m)</span><span>150M · 15%</span></div><div className="bar-bg"><div className="bar" style={{width:'60%',background:'#f59e0b'}}></div></div></div>
          <div className="dist-row"><div className="dist-label"><span>Operaciones</span><span>150M · 15%</span></div><div className="bar-bg"><div className="bar" style={{width:'60%',background:'#0ea5e9'}}></div></div></div>
          <div className="dist-row"><div className="dist-label"><span>Tesorería</span><span>100M · 10%</span></div><div className="bar-bg"><div className="bar" style={{width:'40%',background:'#ec4899'}}></div></div></div>
          <h3>Tasas de cambio en Presale</h3>
          <table>
            <thead><tr><th>Moneda</th><th>Tasa</th><th>Precio por AGRO</th></tr></thead>
            <tbody>
              <tr><td>USDT (Polygon)</td><td>1 USDT = 1,000 AGRO</td><td>$0.001 USD</td></tr>
              <tr><td>POL (MATIC)</td><td>1 POL = 75 AGRO</td><td>Variable según precio POL</td></tr>
              <tr><td>Uniswap</td><td>Pool AGRO/WMATIC</td><td>Precio de mercado</td></tr>
            </tbody>
          </table>
        </div>

        {/* 05 */}
        <div className="section">
          <div className="section-num">05</div>
          <h2 className="st">Mecanismos de Deflación</h2>
          <table>
            <thead><tr><th>Mecanismo</th><th>Tasa</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>Burn automático por transferencia P2P</td><td>2% de cada tx</td><td>✅ Activo</td></tr>
              <tr><td>Trazabilidad Finca (por evento)</td><td>50 AGRO/evento</td><td>✅ Activo</td></tr>
              <tr><td>Comisiones marketplace</td><td>Por definir</td><td>🔜 Próximamente</td></tr>
              <tr><td>Propuestas DAO</td><td>Por definir</td><td>🔜 Próximamente</td></tr>
              <tr><td>Membresías NFT</td><td>Por definir</td><td>🔜 Próximamente</td></tr>
            </tbody>
          </table>
          <p><strong>Proyección:</strong> ~500M AGRO activos después de 5 años (50% del supply quemado).</p>
        </div>

        {/* 06 */}
        <div className="section">
          <div className="section-num">06</div>
          <h2 className="st">Casos de Uso del Token</h2>
          <h3>1. Trazabilidad Agrícola</h3>
          <p>Los productores registran eventos de su finca en la blockchain pagando <strong>50 AGRO por evento</strong>. Cada evento genera un hash SHA-256 almacenado on-chain con timestamp inmutable.</p>
          <h3>2. Marketplace</h3>
          <p>El token AGRO actúa como medio de pago preferencial en el marketplace de productos frescos, con descuentos exclusivos para holders.</p>
          <h3>3. Staking — 10% APY</h3>
          <p>Los holders hacen staking en el Pool General al <strong>10% APY</strong>. Próximamente: Pool Finca (12% APY) y Pool Marketplace (8% APY).</p>
          <h3>4. Membresías NFT</h3>
          <p>NFTs que otorgan acceso premium: análisis IA avanzados, prioridad en entregas, beneficios en marketplace y participación en governance.</p>
          <h3>5. Gobernanza DAO</h3>
          <p>Los holders votarán sobre tasas de burn, nuevos pools, integraciones y uso del fondo de tesorería.</p>
        </div>

        {/* 07 */}
        <div className="section">
          <div className="section-num">07</div>
          <h2 className="st">Trazabilidad Blockchain</h2>
          <table>
            <thead><tr><th>Evento</th><th>Costo</th><th>Descripción</th></tr></thead>
            <tbody>
              <tr><td>🌱 Siembra</td><td>50 AGRO</td><td>Inicio de cultivo con variedad y lote</td></tr>
              <tr><td>💧 Riego</td><td>50 AGRO</td><td>Frecuencia y volumen de riego</td></tr>
              <tr><td>🌿 Fertilización</td><td>50 AGRO</td><td>Tipo y cantidad de fertilizante</td></tr>
              <tr><td>🧪 Fumigación</td><td>50 AGRO</td><td>Registro de agroquímicos aplicados</td></tr>
              <tr><td>🌾 Cosecha</td><td>50 AGRO</td><td>Cantidad, calidad y fecha</td></tr>
              <tr><td>🚚 Entrega al acopio</td><td>50 AGRO</td><td>Trazabilidad de distribución</td></tr>
              <tr><td>✅ Control de calidad</td><td>50 AGRO</td><td>Certificación de estándares</td></tr>
              <tr><td>📝 Otro</td><td>50 AGRO</td><td>Evento personalizado</td></tr>
            </tbody>
          </table>
          <h3>Contrato de Trazabilidad</h3>
          <div className="addr">0x1A8ec9726d52857616a573F1185c6E73d3c60255 · Polygon Mainnet</div>
        </div>

        {/* 08 */}
        <div className="section">
          <div className="section-num">08</div>
          <h2 className="st">Contrato Inteligente</h2>
          <div className="addr">0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5</div>
          <table>
            <thead><tr><th>Parámetro</th><th>Valor</th></tr></thead>
            <tbody>
              <tr><td>Red</td><td>Polygon Mainnet (Chain ID: 137)</td></tr>
              <tr><td>Estándar</td><td>ERC-20</td></tr>
              <tr><td>Nombre / Símbolo</td><td>AGROVIDA / AGRO</td></tr>
              <tr><td>Decimales</td><td>18</td></tr>
              <tr><td>Supply máximo</td><td>1,000,000,000 AGRO</td></tr>
              <tr><td>Burn por transferencia</td><td>2% (200 BPS)</td></tr>
              <tr><td>Compilador</td><td>Solidity v0.8.24</td></tr>
              <tr><td>Licencia</td><td>MIT</td></tr>
              <tr><td>Verificado en Polygonscan</td><td>✅ Exact Match</td></tr>
              <tr><td>Pausable / Burnable</td><td>Sí / Sí</td></tr>
              <tr><td>ReentrancyGuard</td><td>Sí</td></tr>
            </tbody>
          </table>
          <p>Código fuente público en Polygonscan:</p>
          <div className="addr">https://polygonscan.com/token/0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5</div>
        </div>

        {/* 09 */}
        <div className="section">
          <div className="section-num">09</div>
          <h2 className="st">Roadmap</h2>
          <div className="roadmap">
            <div className="rm-item"><div className="rm-dot done"></div><div className="rm-q">Q1 2026 — Completado ✅</div><div className="rm-title">Fundamentos</div><ul className="rm-items"><li>Deploy contrato AGROVIDA ERC-20 en Polygon Mainnet</li><li>Verificación en Polygonscan</li><li>Pool de liquidez en Uniswap</li><li>Plataforma de presale activa</li></ul></div>
            <div className="rm-item"><div className="rm-dot done"></div><div className="rm-q">Q2 2026 — Completado ✅</div><div className="rm-title">Ecosistema Operacional</div><ul className="rm-items"><li>Módulo Finca v2 con trazabilidad blockchain</li><li>Staking Pool General 10% APY en vivo</li><li>Módulo neveras con remisiones PDF</li><li>Marketing IA y LucidBot WhatsApp</li></ul></div>
            <div className="rm-item"><div className="rm-dot"></div><div className="rm-q">Q3 2026</div><div className="rm-title">Expansión y Listados</div><ul className="rm-items"><li>Listado en CoinGecko y CoinMarketCap</li><li>Auditoría de seguridad del contrato</li><li>NFT Membresías en Polygon</li><li>Staking Pool Finca (12% APY)</li></ul></div>
            <div className="rm-item"><div className="rm-dot"></div><div className="rm-q">Q4 2026</div><div className="rm-title">Marketplace y DAO</div><ul className="rm-items"><li>Marketplace descentralizado productor-consumidor</li><li>Gobernanza DAO con propuestas on-chain</li><li>Integración con otras redes (Arbitrum, Base)</li></ul></div>
            <div className="rm-item"><div className="rm-dot"></div><div className="rm-q">2027</div><div className="rm-title">Expansión Regional</div><ul className="rm-items"><li>Expansión a México, Perú y Ecuador</li><li>Certificación de trazabilidad para exportaciones</li><li>Integración con entidades financieras</li></ul></div>
          </div>
        </div>

        {/* 10 */}
        <div className="section">
          <div className="section-num">10</div>
          <h2 className="st">Nota Regulatoria</h2>
          <div className="disclaimer">
            <strong>⚠️ Clasificación:</strong> AGROVIDA (AGRO) es un <strong>token de utilidad</strong> — otorga acceso a servicios del ecosistema AGROVIDA. No constituye un instrumento de inversión, valor mobiliario, ni participación en una empresa.<br/><br/>
            <strong>Este documento no es una oferta pública de valores.</strong> Requiere asesoría legal especializada antes de cualquier oferta pública en Colombia, México, Estados Unidos, la Unión Europea y demás jurisdicciones.<br/><br/>
            <strong>Riesgo:</strong> los criptoactivos son de alto riesgo. Solo participe con fondos que pueda permitirse perder.
          </div>
          <h3>Información del Proyecto</h3>
          <table>
            <thead><tr><th>Item</th><th>Detalle</th></tr></thead>
            <tbody>
              <tr><td>País</td><td>Colombia</td></tr>
              <tr><td>Website</td><td>agrovidacol.com · agrotoken.com</td></tr>
              <tr><td>Token</td><td>0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5</td></tr>
              <tr><td>Versión</td><td>Whitepaper v1.0 — Junio 2026</td></tr>
            </tbody>
          </table>
        </div>

        <div style={{textAlign:'center',padding:'40px 0',color:'#94a3b8',fontSize:13,borderTop:'1px solid #f1f5f9',marginTop:40}}>
          <strong style={{color:'#7c3aed'}}>AGROVIDA TOKEN (AGRO)</strong> · Whitepaper v1.0 · Junio 2026<br/>
          Polygon Mainnet · MIT License · agrotoken.com
        </div>

      </div>
    </main>
  )
}
