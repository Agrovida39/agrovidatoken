# AGROVIDA Token — Landing Page

Token de utilidad del ecosistema AGROVIDA. Este repo contiene la landing page pública.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel** (deploy automático)

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy

Conecta este repo en [vercel.com](https://vercel.com) → Import → Deploy.
El dominio gratuito será `agrovida-token.vercel.app`.

## Seguridad implementada

- Cabeceras HTTP: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- Validación + sanitización en cliente Y servidor (API route)
- Rate limiting por IP (3 req/min en endpoint waitlist)
- Honeypot anti-spam en formulario
- Sin dependencias externas innecesarias

## Estructura

```
app/
  layout.tsx        — Root layout + metadata SEO
  page.tsx          — Landing (Navbar + Hero + Tokenomics + UseCases + Roadmap + Waitlist + Footer)
  globals.css       — Estilos globales Tailwind
  api/
    waitlist/
      route.ts      — POST /api/waitlist (validación servidor, rate limiting)
components/
  Navbar.tsx
  Hero.tsx
  Tokenomics.tsx
  UseCases.tsx
  Roadmap.tsx
  Waitlist.tsx
  WaitlistForm.tsx  — Formulario con honeypot + sanitización
  Footer.tsx
```

## Advertencia regulatoria

AGRO es un token de utilidad. No constituye una oferta de valores. Se requiere asesoría legal antes de cualquier lanzamiento público.
