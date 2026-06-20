/**
 * agroPrice — precio del token AGRO en vivo desde el mercado real.
 *
 * Usa GeckoTerminal (gratis, sin API key), que indexa el mismo pool de Uniswap
 * en Polygon que ves en app.uniswap.org. Devuelve precio en USD y en COP (TRM).
 */

export const AGRO_TOKEN_ADDRESS = "0xfb172a5f2dd76eA03D225e78CfCC2f21773aEDf5"

const GECKO_URL =
  `https://api.geckoterminal.com/api/v2/simple/networks/polygon_pos/token_price/${AGRO_TOKEN_ADDRESS.toLowerCase()}`

export interface AgroPriceData {
  usd: number
  cop: number
  trm: number
}

/** Precio de 1 AGRO en USD (mercado real). 0 si no hay liquidez/datos. */
export async function fetchAgroPriceUSD(): Promise<number> {
  try {
    const res = await fetch(GECKO_URL, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    })
    const data = await res.json()
    const priceStr: string | undefined =
      data?.data?.attributes?.token_prices?.[AGRO_TOKEN_ADDRESS.toLowerCase()]
    const price = priceStr ? Number(priceStr) : 0
    return price > 0 ? price : 0
  } catch {
    return 0
  }
}

/** TRM aproximada USD→COP vía precio de USDT en CoinGecko. */
export async function fetchTrmCOP(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=cop",
      { signal: AbortSignal.timeout(6000) }
    )
    const data = await res.json()
    const trm = data?.tether?.cop
    return trm && trm > 0 ? trm : 4200
  } catch {
    return 4200
  }
}

/** Precio AGRO completo (USD + COP). */
export async function fetchAgroPrice(): Promise<AgroPriceData> {
  const [usd, trm] = await Promise.all([fetchAgroPriceUSD(), fetchTrmCOP()])
  return { usd, trm, cop: usd * trm }
}
