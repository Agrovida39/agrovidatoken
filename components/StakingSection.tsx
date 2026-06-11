'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Lock, Unlock, Gift, AlertCircle, ExternalLink, Loader2, CheckCircle } from 'lucide-react'

const STAKING_ADDRESS = '0x265AfFe87aAb6d85a309E929d3F0216f1336570E'
const AGRO_ADDRESS    = '0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5'
const POLYGON_CHAIN_ID = '0x89'
const EXPLORER       = 'https://polygonscan.com/tx/'

// ─── Manual ABI encoding ──────────────────────────────────────────────────────

function encodeUint256(n: bigint): string {
  return n.toString(16).padStart(64, '0')
}

function encodeAddress(addr: string): string {
  return addr.replace('0x', '').toLowerCase().padStart(64, '0')
}

// approve(address,uint256) = 0x095ea7b3
function encodeApprove(spender: string, amount: bigint): string {
  return '0x095ea7b3' + encodeAddress(spender) + encodeUint256(amount)
}

// allowance(address,address) = 0xdd62ed3e
function encodeAllowance(owner: string, spender: string): string {
  return '0xdd62ed3e' + encodeAddress(owner) + encodeAddress(spender)
}

// balanceOf(address) = 0x70a08231
function encodeBalanceOf(addr: string): string {
  return '0x70a08231' + encodeAddress(addr)
}

// stake(uint256) = 0xa694fc3a
function encodeStake(amount: bigint): string {
  return '0xa694fc3a' + encodeUint256(amount)
}

// unstake() = 0x2def6620
const UNSTAKE_SIG = '0x2def6620'

// claimRewards() = 0x372500ab
const CLAIM_SIG = '0x372500ab'

// pendingRewards(address) = 0xf40f0f52
function encodePendingRewards(addr: string): string {
  return '0xf40f0f52' + encodeAddress(addr)
}

// stakes(address) = 0xa1e9818e — returns (uint256 principal, uint256 stakedAt, uint256 pendingReward)
function encodeStakes(addr: string): string {
  return '0xa1e9818e' + encodeAddress(addr)
}

// totalStaked() = 0x817b1cd2
const TOTAL_STAKED_SIG = '0x817b1cd2'

// rewardReserve() = 0x006c33a3
const REWARD_RESERVE_SIG = '0x006c33a3'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function eth() {
  return (window as any).ethereum ?? null
}

async function rpcCall(method: string, params: unknown[]) {
  const e = eth()
  if (!e) return null
  return e.request({ method, params })
}

async function ethCall(to: string, data: string): Promise<string> {
  const res = await rpcCall('eth_call', [{ to, data }, 'latest'])
  return res ?? '0x'
}

function fromWei(hex: string): number {
  if (!hex || hex === '0x') return 0
  return Number(BigInt(hex)) / 1e18
}

function fmtAgro(n: number): string {
  if (n === 0) return '0'
  if (n < 0.001) return '<0.001'
  return n.toLocaleString('es-CO', { maximumFractionDigits: 3 })
}

async function switchToPolygon() {
  const e = eth()
  if (!e) return
  try {
    await e.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_CHAIN_ID }] })
  } catch (err: any) {
    if (err.code === 4902) {
      await e.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: POLYGON_CHAIN_ID,
          chainName: 'Polygon Mainnet',
          nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
          rpcUrls: ['https://polygon-rpc.com'],
          blockExplorerUrls: ['https://polygonscan.com'],
        }],
      })
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

type Step = 'idle' | 'approving' | 'staking' | 'unstaking' | 'claiming' | 'done' | 'error'

export default function StakingSection() {
  const [account, setAccount]           = useState<string | null>(null)
  const [agroBalance, setAgroBalance]   = useState(0)
  const [staked, setStaked]             = useState(0)
  const [rewards, setRewards]           = useState(0)
  const [totalStaked, setTotalStaked]   = useState(0)
  const [rewardReserve, setRewardReserve] = useState(0)
  const [stakeAmount, setStakeAmount]   = useState('')
  const [step, setStep]                 = useState<Step>('idle')
  const [txHash, setTxHash]             = useState('')
  const [errorMsg, setErrorMsg]         = useState('')
  const [loading, setLoading]           = useState(false)

  // ── Cargar datos del usuario ───────────────────────────────────────────────
  const loadData = useCallback(async (addr: string) => {
    setLoading(true)
    try {
      const [balHex, stakedHex, rewardsHex, totalHex, reserveHex] = await Promise.all([
        ethCall(AGRO_ADDRESS,    encodeBalanceOf(addr)),
        ethCall(STAKING_ADDRESS, encodeStakes(addr)),
        ethCall(STAKING_ADDRESS, encodePendingRewards(addr)),
        ethCall(STAKING_ADDRESS, TOTAL_STAKED_SIG),
        ethCall(STAKING_ADDRESS, REWARD_RESERVE_SIG),
      ])

      setAgroBalance(fromWei(balHex))

      // stakes() devuelve 3 slots de 32 bytes: principal, stakedAt, pendingReward
      const raw = stakedHex.replace('0x', '')
      const principal = raw.length >= 64 ? '0x' + raw.slice(0, 64) : '0x'
      setStaked(fromWei(principal))

      setRewards(fromWei(rewardsHex))
      setTotalStaked(fromWei(totalHex))
      setRewardReserve(fromWei(reserveHex))
    } catch (e) {
      console.error('loadData error', e)
    }
    setLoading(false)
  }, [])

  // ── Conectar wallet ────────────────────────────────────────────────────────
  async function connect() {
    const e = eth()
    if (!e) { alert('Instala MetaMask para usar el staking'); return }
    await switchToPolygon()
    const accounts: string[] = await e.request({ method: 'eth_requestAccounts' })
    if (accounts[0]) {
      setAccount(accounts[0])
      await loadData(accounts[0])
    }
  }

  useEffect(() => {
    const e = eth()
    if (!e) return
    e.request({ method: 'eth_accounts' }).then((accs: string[]) => {
      if (accs[0]) { setAccount(accs[0]); loadData(accs[0]) }
    })
  }, [loadData])

  // ── Stake ──────────────────────────────────────────────────────────────────
  async function handleStake() {
    if (!account || !stakeAmount) return
    const amount = parseFloat(stakeAmount)
    if (isNaN(amount) || amount <= 0) return
    const wei = BigInt(Math.round(amount * 1e18))

    setStep('approving'); setErrorMsg('')
    try {
      // 1. Approve
      await rpcCall('eth_sendTransaction', [{
        from: account, to: AGRO_ADDRESS, value: '0x0', data: encodeApprove(STAKING_ADDRESS, wei),
      }])
      await new Promise(r => setTimeout(r, 3000))

      // 2. Stake
      setStep('staking')
      const tx = await rpcCall('eth_sendTransaction', [{
        from: account, to: STAKING_ADDRESS, value: '0x0', data: encodeStake(wei),
      }])
      setTxHash(tx)
      setStep('done')
      setStakeAmount('')
      await loadData(account)
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Error al hacer staking')
      setStep('error')
    }
  }

  // ── Unstake ────────────────────────────────────────────────────────────────
  async function handleUnstake() {
    if (!account) return
    setStep('unstaking'); setErrorMsg('')
    try {
      const tx = await rpcCall('eth_sendTransaction', [{
        from: account, to: STAKING_ADDRESS, value: '0x0', data: UNSTAKE_SIG,
      }])
      setTxHash(tx); setStep('done')
      await loadData(account)
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Error al retirar')
      setStep('error')
    }
  }

  // ── Claim ──────────────────────────────────────────────────────────────────
  async function handleClaim() {
    if (!account) return
    setStep('claiming'); setErrorMsg('')
    try {
      const tx = await rpcCall('eth_sendTransaction', [{
        from: account, to: STAKING_ADDRESS, value: '0x0', data: CLAIM_SIG,
      }])
      setTxHash(tx); setStep('done')
      await loadData(account)
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Error al reclamar')
      setStep('error')
    }
  }

  const busy = ['approving', 'staking', 'unstaking', 'claiming'].includes(step)
  const annualReward = staked * 0.10

  return (
    <section id="staking" className="py-24 px-4 sm:px-6" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d1a 100%)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-agro-green text-sm font-semibold uppercase tracking-widest">Staking</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">
            Haz crecer tus <span className="text-agro-green">AGROVIDA</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Bloquea tus tokens y gana <strong className="text-white">10% APY</strong> en AGROVIDA.
            Contrato auditado en Polygon Mainnet — sin custodia.
          </p>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'APY',           value: '10%',                          color: '#22c55e' },
            { label: 'Total Stakeado', value: `${fmtAgro(totalStaked)} AGRO`, color: '#a78bfa' },
            { label: 'Reserva Rewards', value: `${fmtAgro(rewardReserve)} AGRO`, color: '#f59e0b' },
            { label: 'Blockchain',    value: 'Polygon',                      color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-5">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Panel izquierdo — info + acción */}
          <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6 space-y-5">
            <h3 className="text-white font-black text-lg flex items-center gap-2">
              <Lock className="w-5 h-5 text-agro-green" /> Tu posición
            </h3>

            {!account ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-6 text-sm">Conecta MetaMask para ver tu posición y hacer staking</p>
                <button
                  onClick={connect}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  Conectar MetaMask
                </button>
              </div>
            ) : (
              <>
                {/* Datos del usuario */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Balance AGRO', value: fmtAgro(agroBalance), color: '#e2e8f0' },
                    { label: 'Stakeado',     value: fmtAgro(staked),      color: '#22c55e' },
                    { label: 'Rewards',      value: fmtAgro(rewards),     color: '#f59e0b' },
                  ].map(d => (
                    <div key={d.label} className="bg-slate-900/60 rounded-xl p-3 text-center">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">{d.label}</p>
                      <p className="font-black text-sm" style={{ color: d.color }}>{d.value}</p>
                    </div>
                  ))}
                </div>

                {staked > 0 && (
                  <div className="rounded-xl p-3 text-sm" style={{ background: '#22c55e12', border: '1px solid #22c55e30' }}>
                    <p className="text-agro-green font-bold">
                      Ganancia anual estimada: ~{fmtAgro(annualReward)} AGRO
                    </p>
                  </div>
                )}

                {/* Input stake */}
                <div className="space-y-3">
                  <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Cantidad a stakear</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      value={stakeAmount}
                      onChange={e => setStakeAmount(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-agro-green transition-colors"
                    />
                    <button
                      onClick={() => setStakeAmount(String(Math.floor(agroBalance)))}
                      className="px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-agro-green border border-agro-green/30 hover:bg-agro-green/10 transition-colors"
                    >
                      MAX
                    </button>
                  </div>

                  <button
                    onClick={handleStake}
                    disabled={busy || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === 'approving' && <><Loader2 className="w-4 h-4 animate-spin" /> Aprobando AGRO...</>}
                    {step === 'staking'   && <><Loader2 className="w-4 h-4 animate-spin" /> Enviando a Polygon...</>}
                    {!busy && <><Lock className="w-4 h-4" /> Stakear AGRO</>}
                  </button>
                </div>

                {/* Acciones si tiene staking activo */}
                {staked > 0 && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <button
                      onClick={handleClaim}
                      disabled={busy || rewards <= 0}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 transition-colors disabled:opacity-40"
                    >
                      {step === 'claiming' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Gift className="w-3 h-3" />}
                      Reclamar rewards
                    </button>
                    <button
                      onClick={handleUnstake}
                      disabled={busy}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                    >
                      {step === 'unstaking' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
                      Retirar todo
                    </button>
                  </div>
                )}

                {/* Estado tx */}
                {step === 'done' && txHash && (
                  <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: '#22c55e12', border: '1px solid #22c55e30' }}>
                    <CheckCircle className="w-4 h-4 text-agro-green shrink-0" />
                    <div>
                      <p className="text-agro-green font-bold text-xs">Transacción enviada</p>
                      <a href={EXPLORER + txHash} target="_blank" rel="noopener noreferrer"
                        className="text-slate-400 text-[10px] hover:text-white flex items-center gap-1">
                        Ver en Polygonscan <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {step === 'error' && (
                  <div className="flex items-start gap-3 rounded-xl p-3" style={{ background: '#ef444420', border: '1px solid #ef444440' }}>
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-300 text-xs">{errorMsg}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-slate-600 text-[10px]">
                    Wallet: {account.slice(0, 6)}...{account.slice(-4)} ·{' '}
                    <button onClick={() => loadData(account)} className="text-slate-500 hover:text-slate-300">
                      {loading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Panel derecho — cómo funciona */}
          <div className="space-y-4">
            <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6">
              <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-agro-green" /> Cómo funciona
              </h3>
              <div className="space-y-4">
                {[
                  { n: '1', t: 'Aprueba AGRO', d: 'MetaMask pide permiso para que el contrato use tus tokens', c: '#a78bfa' },
                  { n: '2', t: 'Stakea',        d: 'Tus AGRO quedan bloqueados en el contrato de Polygon', c: '#22c55e' },
                  { n: '3', t: 'Acumula 10% APY', d: 'Los rewards se acumulan segundo a segundo sin hacer nada', c: '#f59e0b' },
                  { n: '4', t: 'Reclamar o retirar', d: 'Retira solo los rewards o todo (principal + rewards)', c: '#0ea5e9' },
                ].map(s => (
                  <div key={s.n} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5" style={{ background: s.c + '20', color: s.c }}>
                      {s.n}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{s.t}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-5">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Contrato verificado</p>
              <a
                href={`https://polygonscan.com/address/${STAKING_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-agro-green hover:underline text-xs font-mono break-all"
              >
                {STAKING_ADDRESS} <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div><p className="text-slate-600">APY</p><p className="text-white font-bold">10% anual</p></div>
                <div><p className="text-slate-600">Lock period</p><p className="text-white font-bold">Sin lockup</p></div>
                <div><p className="text-slate-600">Red</p><p className="text-white font-bold">Polygon Mainnet</p></div>
                <div><p className="text-slate-600">Token</p><p className="text-white font-bold">AGRO (ERC-20)</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
