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

        <div className="flex gap-4">
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
