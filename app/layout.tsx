import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Token AGROVIDA — Amazon de Salud & Bienestar para LatAm',
  description:
    'AGROVIDA es el token de utilidad del super-ecosistema de salud: marketplace de arándanos, hongos, suplementos premium, membresías NFT y servicios de salud en Latinoamérica. TAM $100B+.',
  keywords: 'AGROVIDA, token AGROVIDA, arándanos, funghi, crypto, salud, bienestar, wellness, suplementos, alimentos saludables, LatAm, Colombia, DeFi, NFT, staking, marketplace',
  metadataBase: new URL('https://agrovidatoken.com'),
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: '/favicon-32.png',
  },
  openGraph: {
    title: 'Token AGROVIDA | Amazon de Salud & Bienestar para LatAm',
    description: 'Marketplace de salud & bienestar powered by blockchain. Base: arándanos colombianos. Membresías NFT, staking 15% APY, DAO governance.',
    type: 'website',
    url: 'https://agrovidatoken.com',
    siteName: 'AGROVIDA Token',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token AGROVIDA',
    description: 'Amazon de salud & bienestar para LatAm. Base: arándanos colombianos. TAM $100B+. Presale activa.',
    site: '@agrovida19',
    creator: '@agrovida19',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9KYC6GW5TJ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-9KYC6GW5TJ');
        `}</Script>
      </body>
    </html>
  )
}
