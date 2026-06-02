import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AGROVIDA Token | AGRO — Amazon de Salud & Bienestar para LatAm',
  description:
    'AGRO es el token de utilidad del super-ecosistema AGROVIDA: marketplace de alimentos saludables, suplementos, membresías NFT y servicios de salud en Latinoamérica. TAM $100B+.',
  keywords: 'AGROVIDA, AGRO, token, crypto, salud, bienestar, wellness, suplementos, alimentos saludables, LatAm, Colombia, DeFi, NFT, staking, marketplace',
  openGraph: {
    title: 'AGROVIDA Token | Amazon de Salud & Bienestar para LatAm',
    description: 'Marketplace de salud & bienestar powered by blockchain. Membresías NFT, staking 15% APY, DAO governance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGROVIDA Token | AGRO',
    description: 'Amazon de salud & bienestar para LatAm. TAM $100B+. Presale Q1 2027.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
