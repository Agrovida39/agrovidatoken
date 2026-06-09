export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { color: white !important; background: #060b14 !important; }
        input::placeholder { color: #64748b !important; }
      `}</style>
      {children}
    </>
  )
}
