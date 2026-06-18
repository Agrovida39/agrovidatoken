'use client'
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        position:'fixed',bottom:24,right:24,background:'#7c3aed',color:'#fff',
        border:'none',padding:'12px 22px',borderRadius:12,fontSize:14,
        fontWeight:600,cursor:'pointer',boxShadow:'0 4px 24px rgba(124,58,237,0.4)',
        zIndex:999
      }}
    >
      ⬇ Descargar PDF
    </button>
  )
}
