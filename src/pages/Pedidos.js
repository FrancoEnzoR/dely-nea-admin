const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const pedidosEjemplo = [
  { id: '#4821', cliente: 'Fran Test', comercio: 'La Leñera Pizzas', total: 7000, estado: 'entregado', fecha: '22/04/2026' },
  { id: '#4822', cliente: 'Juan García', comercio: 'Farmacia del Sol', total: 3500, estado: 'en camino', fecha: '27/04/2026' },
  { id: '#4823', cliente: 'María López', comercio: 'Ferretería Norte', total: 12000, estado: 'pendiente', fecha: '27/04/2026' },
];

export default function Pedidos() {
  const estadoColor = (e) => {
    if (e === 'entregado') return C.success;
    if (e === 'en camino') return C.cyan;
    if (e === 'pendiente') return C.warning;
    return C.error;
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: 0 }}>Pedidos 📦</h1>
        <p style={{ color: C.muted, marginTop: 6 }}>Seguimiento de todos los pedidos en tiempo real</p>
      </div>

      <div style={{ backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['ID', 'Cliente', 'Comercio', 'Total', 'Estado', 'Fecha'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidosEjemplo.map((p, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.cyan, fontWeight: 700 }}>{p.id}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.text }}>{p.cliente}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.text }}>{p.comercio}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.acid, fontWeight: 700 }}>${p.total.toLocaleString()}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: estadoColor(p.estado),
                    backgroundColor: `${estadoColor(p.estado)}15`,
                    borderRadius: 8, padding: '4px 12px',
                  }}>{p.estado}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: C.muted }}>{p.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}