export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>AGROVIDA Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #060b14; color: #f1f5f9; font-family: system-ui, sans-serif; }
          input { color: white !important; background: #060b14 !important; }
          input::placeholder { color: #64748b !important; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
