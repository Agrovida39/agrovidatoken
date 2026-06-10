export default function Footer() {
  return (
    <footer className="border-t border-agro-dark-border py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <img src="/logo-.png" alt="AGROVIDA" className="w-6 h-6 rounded-full object-cover" />
          <span>AGROVIDA Token © {new Date().getFullYear()}</span>
        </div>

        <p className="text-xs text-center max-w-md text-slate-600">
          AGROVIDA es un token de utilidad. No constituye una oferta de valores. Consulta asesoría legal antes de participar. Cumplimiento regulatorio es responsabilidad del usuario según su jurisdicción.
        </p>

        <div className="flex gap-4 items-center">
          <a href="https://t.me/Agro_vida" target="_blank" rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/></svg>
            Telegram
          </a>
          <a href="https://agrovidacol.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            agrovidacol.com
          </a>
          <a href="mailto:contacto@agrovidatoken.com" className="hover:text-white transition-colors">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  )
}
