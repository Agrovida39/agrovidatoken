import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const ALLOWED_ROLES = new Set(['comprador', 'productor', 'inversor', 'partner', 'otro'])
const ALLOWED_TIERS = new Set(['semilla', 'cosecha', 'funghi', 'arandanos', ''])

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254
}

function sanitize(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(/[<>"'`\\]/g, '').trim().slice(0, maxLen)
}

// In-memory rate limiting (per deployment instance)
// For production, use Redis or an external store (e.g. Upstash)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW_MS = 60_000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: 'Demasiadas solicitudes. Intenta en un minuto.' },
      { status: 429 }
    )
  }

  // Parse body safely
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Cuerpo de solicitud inválido.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ message: 'Datos inválidos.' }, { status: 400 })
  }

  const { name, email, role, tier } = body as Record<string, unknown>

  const cleanName = sanitize(name, 80)
  const cleanEmail = sanitize(email, 254).toLowerCase()
  const cleanRole = sanitize(role, 20)
  const cleanTier = sanitize(tier, 20).toLowerCase()

  // Validate
  if (!cleanName || cleanName.length < 2) {
    return NextResponse.json({ message: 'Nombre requerido.' }, { status: 422 })
  }
  if (!isValidEmail(cleanEmail)) {
    return NextResponse.json({ message: 'Email inválido.' }, { status: 422 })
  }
  if (!ALLOWED_ROLES.has(cleanRole)) {
    return NextResponse.json({ message: 'Rol inválido.' }, { status: 422 })
  }
  if (!ALLOWED_TIERS.has(cleanTier)) {
    return NextResponse.json({ message: 'Membresía inválida.' }, { status: 422 })
  }

  // Log server-side (never exposed to client)
  console.info('[waitlist]', {
    name: cleanName,
    email: cleanEmail,
    role: cleanRole,
    tier: cleanTier || 'sin-tier',
    registeredAt: new Date().toISOString(),
  })

  // Persist to Firestore — failure does NOT block the user
  try {
    await addDoc(collection(db, 'waitlist_token'), {
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      tier: cleanTier,
      createdAt: serverTimestamp(),
      source: 'agrovidatoken.com',
    })
  } catch (dbErr) {
    console.error('[waitlist] Firestore write failed:', dbErr)
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

// Reject all other methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
