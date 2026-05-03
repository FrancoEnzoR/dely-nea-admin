import { useState, useEffect } from 'react';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const COLORES_PRESET = [
  '#7C3AED', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#DB2777', '#2563EB', '#000000',
];

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrando, setMostrando] = useState(false);
  const [nueva, setNueva] = useState({
    titulo: '', subtitulo: '', emoji: '🔥',
    color: '#7C3AED', btn_texto: 'Ver más →', orden: 1,
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    try {
      const res = await fetch(`${API}/ofertas`);
      const data = await res.json();
      setOfertas(data.ofertas || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const toggleActivo = async (oferta) => {
    try {
      await fetch(`${API}/ofertas/${oferta.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !oferta.activo }),
      });
      cargarOfertas();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta oferta?')) return;
    try {
      await fetch(`${API}/ofertas/${id}`, { method: 'DELETE' });
      cargarOfertas();
    } catch (error) {
      console.log(error);
    }
  };

  const agregar = async () => {
    if (!nueva.titulo) return;
    setGuardando(true);
    try {
      await fetch(`${API}/ofertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva),
      });
      setNueva({ titulo: '', subtitulo: '', emoji: '🔥', color: '#7C3AED', btn_texto: 'Ver más →', orden: 1 });
      setMostrando(false);
      cargarOfertas();
    } catch (error) {
      console.log(error);
    }
    setGuardando(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            Publicidad y Ofertas 📢
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
            Gestioná el carrusel de ofertas de la app
          </p>
        </div>
        <button onClick={() => setMostrando(!mostrando)} style={{
          backgroundColor: C.acid, color: '#000', border: 'none',
          borderRadius: 10, padding: '10px 18px', fontSize: 12,
          fontWeight: 800, cursor: 'pointer',
        }}>+ Nueva oferta</button>
      </div>

      {/* Preview carrusel */}
      <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>
          Preview del carrusel en la app
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {ofertas.map((o, i) => (
            <div key={i} style={{
              minWidth: 200, borderRadius: 14, padding: 16,
              backgroundColor: o.color, flexShrink: 0,
              opacity: o.activo ? 1 : 0.4,
            }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 6 }}>
                🔥 Oferta del día
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{o.titulo}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 10 }}>{o.subtitulo}</div>
              <div style={{
                backgroundColor: '#AAFF00', borderRadius: 6,
                padding: '4px 10px', display: 'inline-block',
                fontSize: 11, fontWeight: 800, color: '#000',
              }}>{o.btn_texto}</div>
              <div style={{ fontSize: 32, position: 'absolute', right: 16, top: '50%' }}>{o.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario nueva oferta */}
      {mostrando && (
        <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>Nueva oferta</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>TÍTULO</div>
              <input
                value={nueva.titulo}
                onChange={e => setNueva({ ...nueva, titulo: e.target.value })}
                placeholder="Ej: Envío GRATIS"
                style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>SUBTÍTULO</div>
              <input
                value={nueva.subtitulo}
                onChange={e => setNueva({ ...nueva, subtitulo: e.target.value })}
                placeholder="Ej: en tu primer pedido"
                style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>EMOJI</div>
              <input
                value={nueva.emoji}
                onChange={e => setNueva({ ...nueva, emoji: e.target.value })}
                placeholder="🔥"
                style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 20, color: C.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>TEXTO DEL BOTÓN</div>
              <input
                value={nueva.btn_texto}
                onChange={e => setNueva({ ...nueva, btn_texto: e.target.value })}
                placeholder="Ver más →"
                style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>COLOR DE FONDO</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLORES_PRESET.map((color, i) => (
                <div
                  key={i}
                  onClick={() => setNueva({ ...nueva, color })}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: color, cursor: 'pointer',
                    border: nueva.color === color ? '3px solid #AAFF00' : '2px solid transparent',
                  }}
                />
              ))}
              <input
                type="color"
                value={nueva.color}
                onChange={e => setNueva({ ...nueva, color: e.target.value })}
                style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', border: 'none', padding: 0 }}
              />
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>PREVIEW</div>
            <div style={{
              borderRadius: 14, padding: 16, backgroundColor: nueva.color,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              maxWidth: 300,
            }}>
              <div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>🔥 Oferta del día</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{nueva.titulo || 'Título'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{nueva.subtitulo || 'Subtítulo'}</div>
                <div style={{ backgroundColor: '#AAFF00', borderRadius: 6, padding: '4px 10px', display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#000' }}>
                  {nueva.btn_texto || 'Ver más →'}
                </div>
              </div>
              <div style={{ fontSize: 36 }}>{nueva.emoji}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setMostrando(false)} style={{
              backgroundColor: C.cardLight, color: C.muted,
              border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '10px 16px', fontSize: 13, cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={agregar} disabled={guardando} style={{
              backgroundColor: C.acid, color: '#000', border: 'none',
              borderRadius: 8, padding: '10px 20px', fontSize: 13,
              fontWeight: 800, cursor: 'pointer',
            }}>{guardando ? 'Guardando...' : '✅ Agregar oferta'}</button>
          </div>
        </div>
      )}

      {/* Lista de ofertas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ color: C.muted, fontSize: 13 }}>Cargando...</div>
        ) : ofertas.map((o, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 14, padding: 16,
            border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: o.activo ? 1 : 0.5,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              backgroundColor: o.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>{o.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{o.titulo}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{o.subtitulo} · {o.btn_texto}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleActivo(o)} style={{
                backgroundColor: o.activo ? `${C.success}18` : `${C.muted}18`,
                color: o.activo ? C.success : C.muted,
                border: `1px solid ${o.activo ? C.success : C.muted}44`,
                borderRadius: 8, padding: '6px 12px', fontSize: 11,
                fontWeight: 700, cursor: 'pointer',
              }}>{o.activo ? '✅ Activa' : '⏸ Inactiva'}</button>
              <button onClick={() => eliminar(o.id)} style={{
                backgroundColor: `${C.error}18`, color: C.error,
                border: `1px solid ${C.error}44`, borderRadius: 8,
                padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>🗑 Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}