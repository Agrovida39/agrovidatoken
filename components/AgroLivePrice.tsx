'use client'

/**
 * AgroLivePrice — muestra el precio del token AGRO en vivo (mercado real).
 * Se refresca solo cada 60s. Variantes: "badge" (compacto) y "hero" (grande).
 */
import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { fetchAgroPrice, type AgroPriceData } from '@/lib/agroPrice'

const UNISWAP_URL =
  'https://app.uniswap.org/explore/tokens/polygon/0xfb172a5f2dd76ea03d225e78cfcc2f21773aedf5'

const fmtUsd = (n: number) => (n >= 1 ? n.toFixed(2) : n.toFixed(6))
const fmtCop = (n: number) =>
  n >= 1 ? n.toLocaleString('es-CO', { maximumFractionDigits: 2 }) : n.toFixed(4)

export default function AgroLivePrice({ variant = 'badge' }: { variant?: 'badge' | 'hero' }) {
  const [price, setPrice] = useState<AgroPriceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    const cargar = async () => {
      const p = await fetchAgroPrice()
      if (!activo) return
      setPrice(p)
      setLoading(false)
    }
    cargar()
    const id = setInterval(cargar, 60_000)
    return () => { activo = false; clearInterval(id) }
  }, [])

  const sinDatos = !loading && (!price || price.usd === 0)

  if (variant === 'hero') {
    return (
      <a
        href={UNISWAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 backdrop-blur transition-colors hover:bg-emerald-500/20"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <div className="text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            AGRO · Precio en vivo
          </div>
          <div className="text-lg font-extrabold text-white">
            {loading ? 'Cargando…'
              : sinDatos ? 'Pre-venta'
              : `$${fmtUsd(price!.usd)} USD`}
          </div>
          {!sinDatos && price && (
            <div className="text-xs text-emerald-200/80">≈ ${fmtCop(price.cop)} COP</div>
          )}
        </div>
        <TrendingUp className="h-5 w-5 text-emerald-400" />
      </a>
    )
  }

  return (
    <a
      href={UNISWAP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
      title="Ver en Uniswap"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      AGRO {loading ? '…' : sinDatos ? 'Pre-venta' : `$${fmtUsd(price!.usd)}`}
    </a>
  )
}
