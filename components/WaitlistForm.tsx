'use client'
import { useState, useRef } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const ROLES = [
  { value: 'comprador', label: 'Comprador / Cliente' },
  { value: 'productor', label: 'Productor Agrícola' },
  { value: 'inversor', label: 'Inversor' },
  { value: 'partner', label: 'Partner / Restaurante' },
  { value: 'otro', label: 'Otro' },
]

function sanitizeText(value: string, maxLen: number): string {
  return value.replace(/[<>"'`\\]/g, '').slice(0, maxLen)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const honeypot = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Honeypot anti-spam
    if (honeypot.current?.value) return

    const cleanName = sanitizeText(name.trim(), 80)
    const cleanEmail = email.trim().toLowerCase().slice(0, 254)
    const cleanRole = ROLES.find((r) => r.value === role)?.value ?? ''

    if (!cleanName || cleanName.length < 2) { setError('Ingresa tu nombre.'); return }
    if (!isValidEmail(cleanEmail)) { setError('Email inválido.'); return }
    if (!cleanRole) { setError('Selecciona tu rol.'); return }

    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, role: cleanRole }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Error al registrar.')
      }

      setStatus('success')
      setName(''); setEmail(''); setRole('')
    } catch (err: unknown) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error inesperado. Intenta de nuevo.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🌱</div>
        <h3 className="text-2xl font-black text-white mb-2">¡Ya estás en la lista!</h3>
        <p className="text-slate-400">Te notificamos cuando la presale esté abierta. Bienvenido al ecosistema AGROVIDA.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Honeypot — hidden from real users */}
      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="wl-name" className="block text-sm text-slate-400 mb-1.5">Nombre *</label>
          <input
            id="wl-name"
            type="text"
            value={name}
            onChange={(e) => setName(sanitizeText(e.target.value, 80))}
            placeholder="Tu nombre"
            maxLength={80}
            required
            className="w-full bg-agro-dark border border-agro-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-agro-green focus:ring-1 focus:ring-agro-green transition"
          />
        </div>
        <div>
          <label htmlFor="wl-email" className="block text-sm text-slate-400 mb-1.5">Email *</label>
          <input
            id="wl-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.slice(0, 254))}
            placeholder="tu@email.com"
            maxLength={254}
            required
            className="w-full bg-agro-dark border border-agro-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-agro-green focus:ring-1 focus:ring-agro-green transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="wl-role" className="block text-sm text-slate-400 mb-1.5">¿Cuál es tu rol? *</label>
        <select
          id="wl-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full bg-agro-dark border border-agro-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-agro-green focus:ring-1 focus:ring-agro-green transition appearance-none"
        >
          <option value="" disabled>Selecciona...</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Registrando...
          </>
        ) : (
          'Reservar mi lugar →'
        )}
      </button>

      <p className="text-center text-xs text-slate-600">
        Sin spam. Sin venta de datos. Solo notificaciones importantes del lanzamiento.
      </p>
    </form>
  )
}
