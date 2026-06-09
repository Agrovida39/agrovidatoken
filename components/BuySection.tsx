'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Wallet, AlertCircle, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import type { MetaMaskSDK as MetaMaskSDKType } from '@metamask/sdk'

const PRESALE_ADDRESS = '0xF516f7078d13984651fBE3Fb75A9A0ff0bfd6679'
const USDT_ADDRESS    = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' // USDT en Polygon
const POLYGON_CHAIN_ID = '0x89'

const RATE_MATIC = 1000  // 1 MATIC  = 1 000 AGROVIDA
const RATE_USDT  = 10    // 1 USDT   = 10   AGROVIDA ($0.10/token)

const MIN_MATIC = 0.1;   const MAX_MATIC = 1000
const MIN_USDT  = 1;     const MAX_USDT  = 100000

// ABI mínimo ERC-20 para approve + allowance
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
]

type Currency = 'MATIC' | 'USDT'
type Step = 'idle' | 'connecting' | 'switching' | 'approving' | 'buying' | 'success' | 'error'

// Codifica una llamada ERC-20 manualmente (sin ethers.js)
function encodeApprove(spender: string, amount: bigint): string {
  const selector = '0x095ea7b3'
  const paddedSpender = spender.replace('0x', '').padStart(64, '0')
  const paddedAmount  = amount.toString(16).padStart(64, '0')
  return selector + paddedSpender + paddedAmount
}

function encodeAllowance(owner: string, spender: string): string {
  const selector = '0xdd62ed3e'
  const paddedOwner   = owner.replace('0x', '').padStart(64, '0')
  const paddedSpender = spender.replace('0x', '').padStart(64, '0')
  return selector + paddedOwner + paddedSpender
}

export default function BuySection() {
  const [account, setAccount]   = useState<string | null>(null)
  const [currency, setCurrency] = useState<Currency>('MATIC')
  const [amount, setAmount]     = useState('')
  const [step, setStep]         = useState<Step>('idle')
  const [txHash, setTxHash]     = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [approved, setApproved] = useState(false)
  const sdkRef = useRef<MetaMaskSDKType | null>(null)

  useEffect(() => {
    let cancelled = false
    import('@metamask/sdk').then(({ MetaMaskSDK }) => {
      if (cancelled) return
      sdkRef.current = new MetaMaskSDK({
        dappMetadata: { name: 'AGROVIDA Token', url: 'https://agrovidatoken.com' },
        checkInstallationImmediately: false,
      })
    })
    return () => { cancelled = true }
  }, [])

  // Resetear aprobación al cambiar moneda o monto
  useEffect(() => { setApproved(false); setErrorMsg('') }, [currency, amount])

  const rate = currency === 'MATIC' ? RATE_MATIC : RATE_USDT
  const agro = amount ? (parseFloat(amount) * rate).toLocaleString() : '0'
  const min  = currency === 'MATIC' ? MIN_MATIC : MIN_USDT
  const max  = currency === 'MATIC' ? MAX_MATIC : MAX_USDT

  const getProvider = () => sdkRef.current?.getProvider() ?? window.ethereum

  const reset = () => { setStep('idle'); setErrorMsg('') }

  // ── Conectar wallet ────────────────────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    const provider = getProvider()
    if (!provider) { setErrorMsg('MetaMask no encontrado.'); setStep('error'); return }
    try {
      setStep('connecting')
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[]
      const chainId  = (await provider.request({ method: 'eth_chainId' })) as string
      if (chainId !== POLYGON_CHAIN_ID) {
        setStep('switching')
        try {
          await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: POLYGON_CHAIN_ID }] })
        } catch (e: unknown) {
          if ((e as { code?: number }).code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{ chainId: POLYGON_CHAIN_ID, chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com'] }],
            })
          } else throw e
        }
      }
      setAccount(accounts[0]); setStep('idle')
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string }
      setErrorMsg(err.code === 4001 ? 'Conexión rechazada.' : (err.message ?? 'Error al conectar.'))
      setStep('error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Aprobar USDT ───────────────────────────────────────────────────────────
  const handleApprove = useCallback(async () => {
    const val = parseFloat(amount)
    if (!val || val < MIN_USDT || val > MAX_USDT) {
      setErrorMsg(`Ingresa entre ${MIN_USDT} y ${MAX_USDT} USDT.`); setStep('error'); return
    }
    const provider = getProvider()
    if (!provider || !account) return
    try {
      setStep('approving')
      const usdtAmount = BigInt(Math.floor(val * 1e6))
      const data = encodeApprove(PRESALE_ADDRESS, usdtAmount)
      await provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: account, to: USDT_ADDRESS, data, gas: '0xC350' }],
      })
      setApproved(true)
      setStep('idle')
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string }
      setErrorMsg(err.code === 4001 ? 'Aprobación cancelada.' : (err.message ?? 'Error al aprobar.'))
      setStep('error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, amount])

  // ── Comprar ────────────────────────────────────────────────────────────────
  const handleBuy = useCallback(async () => {
    const val = parseFloat(amount)
    if (!val || val < min || val > max) {
      setErrorMsg(`Ingresa entre ${min} y ${max} ${currency}.`); setStep('error'); return
    }
    const provider = getProvider()
    if (!provider || !account) return
    try {
      setStep('buying')
      let tx: string

      if (currency === 'MATIC') {
        const weiHex = '0x' + Math.floor(val * 1e18).toString(16)
        tx = (await provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: account, to: PRESALE_ADDRESS, value: weiHex, gas: '0x30D40' }],
        })) as string
      } else {
        // Verificar allowance antes de comprar
        const allowanceData = encodeAllowance(account, PRESALE_ADDRESS)
        const allowanceHex  = (await provider.request({
          method: 'eth_call',
          params: [{ to: USDT_ADDRESS, data: allowanceData }, 'latest'],
        })) as string
        const allowance = BigInt(allowanceHex)
        const needed    = BigInt(Math.floor(val * 1e6))
        if (allowance < needed) {
          setErrorMsg('Primero debes aprobar el USDT en el Paso 1.')
          setApproved(false); setStep('error'); return
        }

        // Llamar buyWithUSDT(uint256) en el contrato Presale
        const selector    = '0x8c7b3b87' // keccak256("buyWithUSDT(uint256)")[0:4]
        const paddedAmount = needed.toString(16).padStart(64, '0')
        const data = selector + paddedAmount
        tx = (await provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: account, to: PRESALE_ADDRESS, data, gas: '0x30D40' }],
        })) as string
      }

      setTxHash(tx); setStep('success')
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string }
      setErrorMsg(err.code === 4001 ? 'Transacción cancelada.' : (err.message ?? 'Error al comprar.'))
      setStep('error')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, amount, currency, min, max])

  const shortAddr = account ? `${account.slice(0, 6)}…${account.slice(-4)}` : null

  return (
    <section id="comprar" className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-agro-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-agro-purple/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="badge-green mb-4"><span className="pulse-dot" /> Presale Activa</span>
          <h2 className="section-title text-2xl sm:text-4xl lg:text-5xl text-white mt-3">
            Compra <span className="gradient-text">AGROVIDA</span> Ahora
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            <strong className="text-white">1 MATIC = {RATE_MATIC.toLocaleString()} AGROVIDA</strong>
            {' · '}
            <strong className="text-white">1 USDT = {RATE_USDT} AGROVIDA</strong>
            {' · '}Red Polygon
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass rounded-3xl p-8 card-glow border border-agro-dark-border">

            {/* Wallet */}
            {account ? (
              <div className="flex items-center gap-2 bg-agro-green/10 border border-agro-green/30 rounded-xl px-4 py-2.5 mb-6">
                <span className="pulse-dot" />
                <span className="text-agro-green-light text-sm font-medium">Conectado: {shortAddr}</span>
              </div>
            ) : (
              <button onClick={connectWallet} disabled={step === 'connecting' || step === 'switching'}
                className="btn-primary w-full mb-6">
                {(step === 'connecting' || step === 'switching') ? <Loader2 size={18} className="animate-spin" /> : <Wallet size={18} />}
                {step === 'connecting' ? 'Conectando…' : step === 'switching' ? 'Cambiando a Polygon…' : 'Conectar MetaMask'}
              </button>
            )}

            {/* Formulario de compra */}
            {account && step !== 'success' && (
              <>
                {/* Selector MATIC / USDT */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {(['MATIC', 'USDT'] as Currency[]).map((c) => (
                    <button key={c} onClick={() => { setCurrency(c); setAmount(''); reset() }}
                      className={`py-2.5 rounded-xl font-black text-sm transition-all border ${
                        currency === c
                          ? 'bg-agro-green border-agro-green text-white'
                          : 'bg-agro-dark border-agro-dark-border text-slate-400 hover:border-slate-500'
                      }`}>
                      {c === 'MATIC' ? '◈ MATIC' : '💵 USDT'}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="mb-3">
                  <label className="text-slate-400 text-sm mb-1.5 block">Cantidad {currency}</label>
                  <input type="number" min={min} max={max} step={currency === 'MATIC' ? '0.1' : '1'}
                    placeholder={`Min ${min} — Max ${max}`} value={amount}
                    onChange={(e) => { setAmount(e.target.value); reset() }} className="input-dark" />
                </div>

                {/* Recibirás */}
                <div className="bg-agro-dark rounded-xl px-4 py-3 mb-5 flex items-center justify-between border border-agro-dark-border">
                  <span className="text-slate-400 text-sm">Recibirás</span>
                  <span className="text-agro-green font-black text-lg">{agro} AGROVIDA</span>
                </div>

                {/* Pasos USDT */}
                {currency === 'USDT' && (
                  <div className="space-y-3 mb-2">
                    {/* Paso 1 */}
                    <div className={`rounded-xl border p-3 transition-all ${approved ? 'border-agro-green/30 bg-agro-green/5' : 'border-agro-dark-border'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${approved ? 'bg-agro-green text-white' : 'bg-agro-dark-border text-slate-400'}`}>
                          {approved ? '✓' : '1'}
                        </span>
                        <span className="text-sm font-semibold text-slate-300">Autorizar USDT</span>
                        {approved && <span className="text-agro-green text-xs ml-auto">Aprobado ✓</span>}
                      </div>
                      {!approved && (
                        <button onClick={handleApprove} disabled={!amount || step === 'approving'}
                          className="btn-outline w-full text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                          {step === 'approving' ? <><Loader2 size={14} className="animate-spin" /> Aprobando…</> : 'Aprobar USDT →'}
                        </button>
                      )}
                    </div>

                    {/* Paso 2 */}
                    <div className={`rounded-xl border p-3 transition-all ${!approved ? 'opacity-40' : 'border-agro-dark-border'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-agro-dark-border flex items-center justify-center text-xs font-black text-slate-400 shrink-0">2</span>
                        <span className="text-sm font-semibold text-slate-300">Confirmar compra</span>
                      </div>
                      <button onClick={handleBuy} disabled={!approved || !amount || step === 'buying'}
                        className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        {step === 'buying' ? <><Loader2 size={14} className="animate-spin" /> Procesando…</> : <>Comprar AGROVIDATOKEN <ArrowRight size={14} /></>}
                      </button>
                    </div>
                  </div>
                )}

                {/* Botón directo MATIC */}
                {currency === 'MATIC' && (
                  <button onClick={handleBuy} disabled={!amount || step === 'buying'}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                    {step === 'buying' ? <><Loader2 size={18} className="animate-spin" /> Procesando…</> : <>Comprar AGROVIDATOKEN <ArrowRight size={18} /></>}
                  </button>
                )}
              </>
            )}

            {/* Éxito */}
            {step === 'success' && (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="text-agro-green mx-auto mb-3" />
                <p className="text-white font-bold text-lg mb-1">¡Compra enviada!</p>
                <p className="text-slate-400 text-sm mb-4">Tu transacción está en la red Polygon.</p>
                <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                  className="text-agro-purple-light text-sm underline underline-offset-2 hover:text-white">
                  Ver en Polygonscan ↗
                </a>
                <button onClick={() => { setStep('idle'); setTxHash(''); setAmount(''); setApproved(false) }}
                  className="btn-outline w-full mt-5 text-sm">
                  Nueva compra
                </button>
              </div>
            )}

            {/* Error */}
            {step === 'error' && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mt-4">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{errorMsg}</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-agro-dark-border">
              <ShieldCheck size={14} className="text-slate-500 shrink-0" />
              <p className="text-slate-500 text-xs">Contrato auditado · Polygon · MATIC o USDT</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
