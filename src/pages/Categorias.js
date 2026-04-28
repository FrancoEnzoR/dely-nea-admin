import { useState } from 'react';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567',
};

const categoriasIniciales = [
  { nombre: 'Comida', icono: '🍔', activo: true },
  { nombre: 'Ferretería', icono: '🔧', activo: true },
  { nombre: 'Farmacia', icono: '💊', activo: true },
  { nombre: 'Ropa', icono: '👕', activo: true },
  { nombre: 'Técnicos', icono: '⚡', activo: true },
];

export default function Categorias() {
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [nuevo, setNuevo] = useState({ nombre: '', icono: '' });

  const agregar = () => {
    if (!nuevo.nombre || !nuevo.icono) return;
    setCategorias([...categorias, { ...nuevo, activo: true }]);
    setNuevo({ nombre: '', icono: '' });
  };

  const toggleActivo = (i) => {
    const nuevas = [...categorias];
    nuevas[i].activo = !nuevas[i].activo;
    setCategorias(nuevas);
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: 0 }}>Categorías 🏷️</h1>
        <p style={{ color: C.muted, marginTop: 6 }}>Agregá y gestioná las categorías de la app</p>
      </div>

      {/* Agregar nueva */}
      <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>Agregar categoría nueva</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            placeholder="Nombre (ej: Supermercado)"
            value={nuevo.nombre}
            onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
            style={{
              flex: 1, minWidth: 180, backgroundColor: C.cardLight, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: '10px 14px', fontSize: 13, color: C.text,
              outline: 'none',
            }}
          />
          <input
            placeholder="Ícono (ej: 🛒)"
            value={nuevo.icono}
            onChange={e => setNuevo({ ...nuevo, icono: e.target.value })}
            style={{
              width: 100, backgroundColor: C.cardLight, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: '10px 14px', fontSize: 18, color: C.text,
              outline: 'none', textAlign: 'center',
            }}
          />
          <button onClick={agregar} style={{
            backgroundColor: C.acid, color: '#000', border: 'none',
            borderRadius: 10, padding: '10px 20px', fontSize: 13,
            fontWeight: 800, cursor: 'pointer',
          }}>+ Agregar</button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {categorias.map((cat, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 14, padding: 18,
            border: `1px solid ${cat.activo ? C.border : C.error + '33'}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ fontSize: 28 }}>{cat.icono}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: cat.activo ? C.text : C.muted }}>{cat.nombre}</div>
              <div style={{ fontSize: 11, color: cat.activo ? C.success : C.error, marginTop: 2 }}>
                {cat.activo ? '● Activa' : '● Inactiva'}
              </div>
            </div>
            <button onClick={() => toggleActivo(i)} style={{
              backgroundColor: cat.activo ? `${C.error}18` : `${C.success}18`,
              color: cat.activo ? C.error : C.success,
              border: `1px solid ${cat.activo ? C.error + '44' : C.success + '44'}`,
              borderRadius: 8, padding: '6px 12px', fontSize: 11,
              fontWeight: 700, cursor: 'pointer',
            }}>{cat.activo ? 'Desactivar' : 'Activar'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}