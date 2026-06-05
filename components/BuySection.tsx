'use client'
import { useState, useCallback } from 'react'
import { Wallet, AlertCircle, CheckCircle2, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'

const PRESALE_ADDRESS = '0x0000000000000000000000000000000000000000' // reemplazar al desplegar
const POLYGON_CHAIN_ID = '0x89' // 137 decimal
const RATE = 1000 // 1 MATIC = 1000 AGROVIDA
const MIN_MATIC = 0.1
const MAX_MATIC = 1000

type Step = 'idle' | 'connecting' | 'switching' | 'buying' | 'success' | 'error'

export default function BuySection() {
  const [account, setAccount] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [txHash, setTxHash] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const agro = amount ? (parseFloat(amount) * RATE).toLocaleString() : '0'

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setErrorMsg('MetaMask no encontrado. Instálalo en metamask.io')
      setStep('error')
      return
    }
    try {
      setStep('connecting')
      const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[]
      const chainId = (await window.ethereum.request({ method: 'eth_chainId' })) as string

      if (chainId !== POLYGON_CHAIN_ID) {
        setStep('switching')
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: POLYGON_CHAIN_ID }],
          })
        } catch (switchErr: unknown) {
          const err = switchErr as { code?: number }
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: POLYGON_CHAIN_ID,
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com'],
                blockExplorerUrls: ['https://polygonscan.com'],
              }],
            })
          } else {
            throw switchErr
          }
        }
      }
      setAccount(accounts[0])
      setStep('idle')
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string }
      if (err.code === 4001) {
        setErrorMsg('Conexión rechazada por el usuario.')
      } else {
        setErrorMsg(err.message ?? 'Error al conectar la wallet.')
      }
      setStep('error')
    }
  }, [])

  const handleBuy = useCallback(async () => {
    const val = parseFloat(amount)
    if (!val || val < MIN_MATIC || val > MAX_MATIC) {
      setErrorMsg(`Ingresa entre ${MIN_MATIC} y ${MAX_MATIC} MATIC.`)
      setStep('error')
      return
    }
    if (!window.ethereum || !account) return

    try {
      setStep('buying')
      const weiHex = '0x' + Math.floor(val * 1e18).toString(16)
      const tx = (await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: PRESALE_ADDRESS,
          value: weiHex,
          gas: '0x30d40', // 200 000 gas
        }],
      })) as string
      setTxHash(tx)
      setStep('success')
    } catch (e: unknown) {
      const err = e as { code?: number; message?: string }
      if (err.code === 4001) {
        setErrorMsg('Transacción cancelada.')
      } else {
        setErrorMsg(err.message ?? 'Error al enviar la transacción.')
      }
      setStep('error')
    }
  }, [account, amount])

  const reset = () => { setStep('idle'); setErrorMsg('') }

  const shortAddr = account ? `${account.slice(0, 6)}…${account.slice(-4)}` : null

  return (
    <section id="comprar" className="relative py-24 overflow-hidden">
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-agro-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-agro-purple/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* header */}
        <div className="text-center mb-14">
          <span className="badge-green mb-4">
            <span className="pulse-dot" /> Presale Activa
          </span>
          <h2 className="section-title text-4xl sm:text-5xl text-white mt-3">
            Compra <span className="gradient-text">AGROVIDA</span> Ahora
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Precio de presale: <strong className="text-white">1 MATIC = {RATE.toLocaleString()} AGROVIDA</strong>.
            Red Polygon. Solo MetaMask.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass rounded-3xl p-8 card-glow border border-agro-dark-border">

            {/* wallet status */}
            {account ? (
              <div className="flex items-center gap-2 bg-agro-green/10 border border-agro-green/30 rounded-xl px-4 py-2.5 mb-6">
                <span className="pulse-dot" />
                <span className="text-agro-green-light text-sm font-medium">Conectado: {shortAddr}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={step === 'connecting' || step === 'switching'}
                className="btn-primary w-full mb-6"
              >
                {step === 'connecting' && <Loader2 size={18} className="animate-spin" />}
                {step === 'switching' && <Loader2 size={18} className="animate-spin" />}
                {step !== 'connecting' && step !== 'switching' && <Wallet size={18} />}
                {step === 'connecting' ? 'Conectando…' : step === 'switching' ? 'Cambiando a Polygon…' : 'Conectar MetaMask'}
              </button>
            )}

            {/* buy form */}
            {account && step !== 'success' && (
              <>
                <div className="mb-4">
                  <label className="text-slate-400 text-sm mb-1.5 block">Cantidad MATIC</label>
                  <input
                    type="number"
                    min={MIN_MATIC}
                    max={MAX_MATIC}
                    step="0.1"
                    placeholder={`Min ${MIN_MATIC} — Max ${MAX_MATIC}`}
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); reset() }}
                    className="input-dark"
                  />
                </div>

                <div className="bg-agro-dark rounded-xl px-4 py-3 mb-6 flex items-center justify-between border border-agro-dark-border">
                  <span className="text-slate-400 text-sm">Recibirás</span>
                  <span className="text-agro-green font-black text-lg">{agro} AGROVIDA</span>
                </div>

                <button
                  onClick={handleBuy}
                  disabled={!amount || step === 'buying'}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {step === 'buying'
                    ? <><Loader2 size={18} className="animate-spin" /> Procesando…</>
                    : <>Comprar AGROVIDA <ArrowRight size={18} /></>}
                </button>
              </>
            )}

            {/* success */}
            {step === 'success' && (
              <div className="text-center py-4">
                <CheckCircle2 size={48} className="text-agro-green mx-auto mb-3" />
                <p className="text-white font-bold text-lg mb-1">¡Compra enviada!</p>
                <p className="text-slate-400 text-sm mb-4">Tu transacción está en la red Polygon.</p>
                <a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-agro-purple-light text-sm underline underline-offset-2 hover:text-white"
                >
                  Ver en Polygonscan ↗
                </a>
                <button onClick={() => { setStep('idle'); setTxHash(''); setAmount('') }} className="btn-outline w-full mt-5 text-sm">
                  Nueva compra
                </button>
              </div>
            )}

            {/* error */}
            {step === 'error' && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mt-4">
                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* security note */}
            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-agro-dark-border">
              <ShieldCheck size={14} className="text-slate-500 shrink-0" />
              <p className="text-slate-500 text-xs">
                Contrato auditado · Solo Polygon · Min {MIN_MATIC} MATIC · Max {MAX_MATIC} MATIC
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
