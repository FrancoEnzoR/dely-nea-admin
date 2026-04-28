import { useState } from 'react';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const tecnicosEjemplo = [
  { nombre: 'Juan Martínez', especialidad: 'Plomero', telefono: '3624111222', rating: 4.9, trabajos: 124, estado: 'aprobado' },
  { nombre: 'Pedro Rodríguez', especialidad: 'Electricista', telefono: '3624333444', rating: 4.8, trabajos: 89, estado: 'pendiente' },
  { nombre: 'Carlos López', especialidad: 'Técnico PC', telefono: '3624555666', rating: 4.7, trabajos: 56, estado: 'pendiente' },
];

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState(tecnicosEjemplo);
  const [filtro, setFiltro] = useState('todos');

  const aprobar = (i) => {
    const nuevos = [...tecnicos];
    nuevos[i].estado = 'aprobado';
    setTecnicos(nuevos);
  };

  const rechazar = (i) => {
    const nuevos = [...tecnicos];
    nuevos[i].estado = 'rechazado';
    setTecnicos(nuevos);
  };

  const filtrados = tecnicos.filter(t => filtro === 'todos' ? true : t.estado === filtro);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: 0 }}>Técnicos 🔧</h1>
        <p style={{ color: C.muted, marginTop: 6 }}>Aprobá y gestioná los técnicos profesionales</p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'pendiente', label: 'Pendientes' },
          { key: 'aprobado', label: 'Aprobados' },
          { key: 'rechazado', label: 'Rechazados' },
        ].map(f => (
          <button key={f.key} onClick={() => setFiltro(f.key)} style={{
            backgroundColor: filtro === f.key ? C.violet : C.cardLight,
            color: filtro === f.key ? '#fff' : C.muted,
            border: `1px solid ${filtro === f.key ? C.violet : C.border}`,
            borderRadius: 10, padding: '8px 16px', fontSize: 12,
            fontWeight: filtro === f.key ? 700 : 400, cursor: 'pointer',
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtrados.map((t, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 16, padding: 20,
            border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0,
            }}>{t.nombre[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{t.nombre}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                {t.especialidad} · ⭐ {t.rating} · {t.trabajos} trabajos · 📞 {t.telefono}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: t.estado === 'aprobado' ? C.success : t.estado === 'pendiente' ? C.warning : C.error,
                backgroundColor: t.estado === 'aprobado' ? `${C.success}15` : t.estado === 'pendiente' ? `${C.warning}15` : `${C.error}15`,
                borderRadius: 8, padding: '4px 12px',
              }}>
                {t.estado === 'aprobado' ? '✅ Aprobado' : t.estado === 'pendiente' ? '⏳ Pendiente' : '❌ Rechazado'}
              </span>
              {t.estado === 'pendiente' && (
                <>
                  <button onClick={() => aprobar(i)} style={{
                    backgroundColor: `${C.success}18`, color: C.success,
                    border: `1px solid ${C.success}44`, borderRadius: 8,
                    padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}>Aprobar</button>
                  <button onClick={() => rechazar(i)} style={{
                    backgroundColor: `${C.error}18`, color: C.error,
                    border: `1px solid ${C.error}44`, borderRadius: 8,
                    padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}>Rechazar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}