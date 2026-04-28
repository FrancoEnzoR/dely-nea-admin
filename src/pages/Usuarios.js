const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567',
};

const usuariosEjemplo = [
  { nombre: 'Fran Test', email: 'fran@delynea.com', rol: 'cliente', fecha: '22/04/2026' },
  { nombre: 'Test Verificacion', email: 'enzifran18@gmail.com', rol: 'cliente', fecha: '26/04/2026' },
  { nombre: 'Franco Enzo', email: 'franker1613@gmail.com', rol: 'admin', fecha: '22/04/2026' },
];

export default function Usuarios() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: 0 }}>Usuarios 👥</h1>
        <p style={{ color: C.muted, marginTop: 6 }}>Gestioná todos los usuarios de Dely Nea</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {usuariosEjemplo.map((u, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 14, padding: '16px 20px',
            border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0,
            }}>{u.nombre[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{u.nombre}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{u.email} · Registrado {u.fecha}</div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: u.rol === 'admin' ? C.acid : C.cyan,
              backgroundColor: u.rol === 'admin' ? `${C.acid}15` : `${C.cyan}15`,
              borderRadius: 8, padding: '4px 12px',
            }}>{u.rol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}