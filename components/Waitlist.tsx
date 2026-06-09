import WaitlistForm from './WaitlistForm'

export default function Waitlist() {
  return (
    <section id="waitlist" className="py-24 px-4 sm:px-6 bg-agro-dark-card/30">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-agro-green text-sm font-semibold uppercase tracking-widest">Lista de Espera</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4">
            Sé de los Primeros en Acceder
          </h2>
          <p className="text-slate-400">
            Los primeros 1,000 registrados obtienen acceso prioritario a la presale privada con precio preferencial.
          </p>
        </div>

        <div className="bg-agro-dark-card border border-agro-dark-border rounded-2xl p-6 sm:p-8">
          <WaitlistForm />
        </div>
      </div>
    </section>
  )
}
