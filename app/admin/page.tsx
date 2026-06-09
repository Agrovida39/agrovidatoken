'use client'

import { useState, useEffect, useCallback } from 'react'

const ADMIN_EMAIL        = 'sumaproyect19@gmail.com'
const ADMIN_PASSWORD_KEY = 'agrovida_admin_pw'
const DEFAULT_PASSWORD   = '123456789'

const PRESALE_ADDRESS  = '0xF516f7078d13984651fBE3Fb75A9A0ff0bfd6679'
const AGROVIDA_ADDRESS = '0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5'
const USDT_ADDRESS     = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
const OWNER_ADDRESS    = '0xBDfB4c5724097c8CD9e7A31900d8dF546fb28f98'
const POLYGON_RPC      = 'https://polygon-rpc.com'

const SIG = {
  totalSold:       '0xe4849b32',
  presaleOpen:     '0x5d86dde1',
  rateMatic:       '0x6f610d82',
  rateUsdt:        '0x174439f7',
  remainingTokens: '0x722b62ad',
  withdrawMatic:   '0x5e35359e',
  withdrawUSDT:    '0x0fb5a6b4',
  setPresaleOpen:  '0xd7a6c22d',
  setRates:        '0x2b74c0d3',
  pause:           '0x8456cb59',
  balanceOf:       '0x70a08231',
}

async function rpcCall(method: string, params: unknown[]) {
  const res = await fetch(POLYGON_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const json = await res.json()
  return json.result
}

async function ethCall(to: string, data: string) {
  return rpcCall('eth_call', [{ to, data }, 'latest'])
}

function fromHex18(hex: string): string {
  if (!hex || hex === '0x') return '0'
  const val = BigInt(hex)
  const whole = val / BigInt('1000000000000000000')
  return whole.toLocaleString()
}

function fromHex18Float(hex: string): string {
  if (!hex || hex === '0x') return '0'
  const val = BigInt(hex)
  const unit = BigInt('1000000000000000000')
  const whole = val / unit
  const dec = (val % unit) * BigInt(100) / unit
  return `${whole.toLocaleString()}.${dec.toString().padStart(2,'0')}`
}

function fromHex6(hex: string): string {
  if (!hex || hex === '0x') return '0'
  const val = BigInt(hex)
  const whole = val / BigInt('1000000')
  return whole.toLocaleString()
}

interface Stats {
  totalSold: string
  remaining: string
  presaleOpen: boolean
  rateMatic: string
  rateUsdt: string
  maticBalance: string
  usdtBalance: string
}

export default function AdminPage() {
  const [authed, setAuthed]   = useState(false)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [stats, setStats]     = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [txStatus, setTxStatus] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress]     = useState('')
  const [newRateMatic, setNewRateMatic] = useState('')
  const [newRateUsdt, setNewRateUsdt]   = useState('')
  const [showChangePw, setShowChangePw] = useState(false)
  const [currentPw, setCurrentPw]       = useState('')
  const [newPw, setNewPw]               = useState('')
  const [confirmPw, setConfirmPw]       = useState('')
  const [changePwMsg, setChangePwMsg]   = useState('')

  function getStoredPassword(): string {
    if (typeof window === 'undefined') return DEFAULT_PASSWORD
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD
  }

  function login() {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setPwError('Correo no autorizado')
      return
    }
    if (password !== getStoredPassword()) {
      setPwError('Contraseña incorrecta')
      return
    }
    setAuthed(true)
    setPwError('')
  }

  function changePassword() {
    if (currentPw !== getStoredPassword()) { setChangePwMsg('❌ Contraseña actual incorrecta'); return }
    if (newPw.length < 8) { setChangePwMsg('❌ Mínimo 8 caracteres'); return }
    if (newPw !== confirmPw) { setChangePwMsg('❌ Las contraseñas no coinciden'); return }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPw)
    setChangePwMsg('✅ Contraseña actualizada')
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => { setShowChangePw(false); setChangePwMsg('') }, 2000)
  }

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const [totalSoldHex, remainingHex, openHex, rateMaticHex, rateUsdtHex, maticBalHex, usdtBalHex] = await Promise.all([
        ethCall(PRESALE_ADDRESS, SIG.totalSold),
        ethCall(PRESALE_ADDRESS, SIG.remainingTokens),
        ethCall(PRESALE_ADDRESS, SIG.presaleOpen),
        ethCall(PRESALE_ADDRESS, SIG.rateMatic),
        ethCall(PRESALE_ADDRESS, SIG.rateUsdt),
        rpcCall('eth_getBalance', [PRESALE_ADDRESS, 'latest']),
        ethCall(USDT_ADDRESS, SIG.balanceOf + PRESALE_ADDRESS.toLowerCase().replace('0x','').padStart(64,'0')),
      ])
      setStats({
        totalSold:    fromHex18(totalSoldHex),
        remaining:    fromHex18(remainingHex),
        presaleOpen:  openHex !== '0x' + '0'.repeat(64),
        rateMatic:    BigInt(rateMaticHex || '0x0').toString(),
        rateUsdt:     BigInt(rateUsdtHex  || '0x0').toString(),
        maticBalance: fromHex18Float(maticBalHex),
        usdtBalance:  fromHex6(usdtBalHex),
      })
    } catch(e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) fetchStats() }, [authed, fetchStats])

  async function connectWallet() {
    const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum
    if (!eth) { setTxStatus('MetaMask no detectado'); return }
    const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[]
    setWalletAddress(accounts[0])
    setWalletConnected(true)
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x89' }] })
    } catch {
      await eth.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x89', chainName: 'Polygon', nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 }, rpcUrls: ['https://polygon-rpc.com'], blockExplorerUrls: ['https://polygonscan.com'] }] })
    }
  }

  async function sendTx(data: string, label: string) {
    const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum
    if (!eth || !walletConnected) { setTxStatus('Conecta MetaMask primero'); return }
    setTxStatus(`Enviando ${label}...`)
    try {
      const txHash = await eth.request({ method: 'eth_sendTransaction', params: [{ from: walletAddress, to: PRESALE_ADDRESS, data, gas: '0x30D40' }] }) as string
      setTxStatus(`✅ ${label} enviada: ${txHash.slice(0,18)}...`)
      setTimeout(fetchStats, 5000)
    } catch(e: unknown) {
      const err = e as { message?: string }
      setTxStatus(`❌ Error: ${err.message || 'rechazada'}`)
    }
  }

  if (!authed) return (
    <div style={{minHeight:'100vh', background:'#060b14', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px'}}>
      <div style={{background:'#0d1726', border:'1px solid #1e2d45', borderRadius:'16px', padding:'32px', width:'100%', maxWidth:'380px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px'}}>
          <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#16a34a,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'900', fontSize:'18px'}}>A</div>
          <div>
            <p style={{color:'white', fontWeight:'700', fontSize:'18px', margin:0}}>AGROVIDA Admin</p>
            <p style={{color:'#64748b', fontSize:'12px', margin:0}}>Panel de Control</p>
          </div>
        </div>

        <div style={{marginBottom:'16px', display:'flex', flexDirection:'column', gap:'12px'}}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Correo electrónico"
            style={{width:'100%', background:'#060b14', border:'1px solid #1e2d45', borderRadius:'12px', padding:'12px 16px', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box'}}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Contraseña"
            style={{width:'100%', background:'#060b14', border:'1px solid #1e2d45', borderRadius:'12px', padding:'12px 16px', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box'}}
          />
        </div>

        {pwError && <p style={{color:'#f87171', fontSize:'12px', marginBottom:'12px'}}>{pwError}</p>}

        <button onClick={login} style={{width:'100%', background:'#16a34a', color:'white', fontWeight:'700', padding:'12px', borderRadius:'12px', border:'none', cursor:'pointer', fontSize:'15px', marginBottom:'12px'}}>
          Ingresar
        </button>

        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
          <div style={{flex:1, height:'1px', background:'#1e2d45'}} />
          <span style={{color:'#475569', fontSize:'12px'}}>o</span>
          <div style={{flex:1, height:'1px', background:'#1e2d45'}} />
        </div>

        <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=291425223198-np10s5tdv5v069qe4omc10j8rh5av8ub.apps.googleusercontent.com&redirect_uri=https://agrovidatoken.com/api/auth/callback/google&response_type=code&scope=email+profile&prompt=select_account"
          style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', background:'white', color:'#1f2937', fontWeight:'700', padding:'12px', borderRadius:'12px', textDecoration:'none', fontSize:'14px', boxSizing:'border-box'}}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/></svg>
          Continuar con Google
        </a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      {/* Header */}
      <div className="border-b border-[#1e2d45] px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">A</div>
          <span className="font-bold">AGROVIDA <span className="text-green-500">Admin</span></span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {walletConnected
            ? <span className="text-xs text-green-400 bg-green-900/30 border border-green-700/30 px-3 py-1 rounded-full">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)} ✓</span>
            : <button onClick={connectWallet} className="text-xs bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-xl font-medium transition-colors">Conectar MetaMask</button>
          }
          <button onClick={fetchStats} className="text-xs text-slate-400 hover:text-white border border-[#1e2d45] px-3 py-1.5 rounded-lg transition-colors">
            {loading ? '⏳' : '🔄'} Actualizar
          </button>
          <button onClick={() => setShowChangePw(true)} className="text-xs text-slate-400 hover:text-white border border-[#1e2d45] px-3 py-1.5 rounded-lg transition-colors">
            🔑 Cambiar clave
          </button>
          <button onClick={() => setAuthed(false)} className="text-xs text-slate-500 hover:text-red-400 transition-colors">Salir</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {txStatus && (
          <div className={`rounded-xl px-4 py-3 text-sm border ${txStatus.startsWith('✅') ? 'bg-green-900/20 border-green-700/30 text-green-400' : txStatus.startsWith('❌') ? 'bg-red-900/20 border-red-700/30 text-red-400' : 'bg-blue-900/20 border-blue-700/30 text-blue-400'}`}>
            {txStatus}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'AGROVIDATOKEN Vendidos', value: stats?.totalSold ?? '—', color: 'text-green-400' },
            { label: 'AGROVIDATOKEN Disponibles', value: stats?.remaining ?? '—', color: 'text-blue-400' },
            { label: 'POL en Presale', value: stats ? stats.maticBalance + ' POL' : '—', color: 'text-purple-400' },
            { label: 'USDT en Presale', value: stats ? '$' + stats.usdtBalance : '—', color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-5">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Estado */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Estado Presale</p>
            <div className={`text-lg font-black ${stats?.presaleOpen ? 'text-green-400' : 'text-red-400'}`}>
              {stats?.presaleOpen ? '🟢 ABIERTA' : '🔴 CERRADA'}
            </div>
          </div>
          <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Tasa POL</p>
            <p className="text-lg font-black text-white">1 POL = <span className="text-green-400">{stats?.rateMatic ?? '—'} AGROVIDA</span></p>
          </div>
          <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Tasa USDT</p>
            <p className="text-lg font-black text-white">1 USDT = <span className="text-green-400">{stats?.rateUsdt ?? '—'} AGROVIDA</span></p>
          </div>
        </div>

        {/* Retiros */}
        <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-1">💰 Retirar Fondos</h2>
          <p className="text-slate-500 text-xs mb-5">Se envían a: {OWNER_ADDRESS.slice(0,10)}...{OWNER_ADDRESS.slice(-6)}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <button onClick={() => sendTx(SIG.withdrawMatic + OWNER_ADDRESS.toLowerCase().replace('0x','').padStart(64,'0'), 'Retiro POL')}
              className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              Retirar {stats?.maticBalance ?? '0'} POL →
            </button>
            <button onClick={() => sendTx(SIG.withdrawUSDT + OWNER_ADDRESS.toLowerCase().replace('0x','').padStart(64,'0'), 'Retiro USDT')}
              className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              Retirar ${stats?.usdtBalance ?? '0'} USDT →
            </button>
          </div>
        </div>

        {/* Control presale */}
        <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-1">⚙️ Control de Presale</h2>
          <p className="text-slate-500 text-xs mb-5">Abrir, cerrar o pausar la presale</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <button onClick={() => sendTx(SIG.setPresaleOpen + '1'.padStart(64,'0'), 'Abrir Presale')}
              className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              🟢 Abrir Presale
            </button>
            <button onClick={() => sendTx(SIG.setPresaleOpen + '0'.padStart(64,'0'), 'Cerrar Presale')}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              🔴 Cerrar Presale
            </button>
            <button onClick={() => sendTx(SIG.pause, 'Pausar Emergencia')}
              className="bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              ⏸ Pausar Emergencia
            </button>
          </div>
        </div>

        {/* Tasas */}
        <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-1">📈 Actualizar Tasas</h2>
          <p className="text-slate-500 text-xs mb-5">AGROVIDATOKEN entregados por 1 POL o 1 USDT</p>
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-slate-400 text-xs block mb-2">AGROVIDA por 1 POL</label>
              <input type="number" value={newRateMatic} onChange={e => setNewRateMatic(e.target.value)}
                placeholder={stats?.rateMatic ?? '10'}
                className="w-full bg-[#060b14] border border-[#1e2d45] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">AGROVIDA por 1 USDT</label>
              <input type="number" value={newRateUsdt} onChange={e => setNewRateUsdt(e.target.value)}
                placeholder={stats?.rateUsdt ?? '10'}
                className="w-full bg-[#060b14] border border-[#1e2d45] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-600" />
            </div>
            <button onClick={() => {
                if (!newRateMatic || !newRateUsdt) { setTxStatus('❌ Ingresa ambas tasas'); return }
                const rm = BigInt(newRateMatic).toString(16).padStart(64,'0')
                const ru = BigInt(newRateUsdt).toString(16).padStart(64,'0')
                sendTx(SIG.setRates + rm + ru, 'Actualizar Tasas')
              }}
              className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
              Actualizar Tasas
            </button>
          </div>
        </div>

        {/* Contratos */}
        <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">📋 Contratos en Polygon Mainnet</h2>
          <div className="space-y-3">
            {[
              { label: 'AGROVIDA Token', address: AGROVIDA_ADDRESS, color: 'text-green-400' },
              { label: 'Presale',        address: PRESALE_ADDRESS,  color: 'text-purple-400' },
              { label: 'Owner Wallet',   address: OWNER_ADDRESS,    color: 'text-yellow-400' },
            ].map(c => (
              <div key={c.label} className="flex items-center justify-between gap-4 py-2 border-b border-[#1e2d45] last:border-0">
                <span className="text-slate-400 text-sm w-32 shrink-0">{c.label}</span>
                <span className={`font-mono text-xs ${c.color} flex-1 break-all`}>{c.address}</span>
                <a href={`https://polygonscan.com/address/${c.address}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-white transition-colors shrink-0">Ver ↗</a>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modal cambiar contraseña */}
      {showChangePw && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#0d1726] border border-[#1e2d45] rounded-2xl p-8 w-full max-w-sm">
            <h3 className="text-white font-bold mb-5">🔑 Cambiar Contraseña</h3>
            <div className="space-y-3 mb-4">
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                placeholder="Contraseña actual"
                className="w-full bg-[#060b14] border border-[#1e2d45] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-600" />
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="Nueva contraseña (mín. 8 caracteres)"
                className="w-full bg-[#060b14] border border-[#1e2d45] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-600" />
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Confirmar nueva contraseña"
                className="w-full bg-[#060b14] border border-[#1e2d45] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-600" />
            </div>
            {changePwMsg && <p className={`text-xs mb-3 ${changePwMsg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{changePwMsg}</p>}
            <div className="flex gap-3">
              <button onClick={changePassword} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors text-sm">Guardar</button>
              <button onClick={() => { setShowChangePw(false); setChangePwMsg('') }} className="flex-1 bg-[#060b14] border border-[#1e2d45] text-slate-400 font-bold py-3 rounded-xl transition-colors text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
