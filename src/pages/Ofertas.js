import { useState, useEffect, useRef } from 'react';

const API = 'https://dely-nea-backend.onrender.com';
const SUPABASE_URL = 'https://niipnuxwxrsxzvzucsis.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paXBudXh3eHJzeHp2enVjc2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzIzMjAsImV4cCI6MjA5MjQwODMyMH0.MW6aSOY0VKlqHUBtp5YGHP8QbYIo85JWeUxLbBarFlA'; // anon key

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const COLORES_PRESET = [
  '#7C3AED', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#DB2777', '#2563EB', '#1A1A2E',
];

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrando, setMostrando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const fileRef = useRef(null);

  const [nueva, setNueva] = useState({
    titulo: '', subtitulo: '', emoji: '🔥',
    color: '#7C3AED', btn_texto: 'Ver más →',
    orden: 1, imagen_url: '', etiqueta: '🔥 Oferta del día',
  });

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

  const subirImagen = async (file) => {
    if (!file) return null;
    setSubiendo(true);
    try {
      const fileName = `oferta-${Date.now()}.${file.name.split('.').pop()}`;
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/ofertas/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': file.type,
        },
        body: file,
      });
      if (res.ok) {
        const url = `${SUPABASE_URL}/storage/v1/object/public/ofertas/${fileName}`;
        setSubiendo(false);
        return url;
      }
    } catch (error) {
      console.log(error);
    }
    setSubiendo(false);
    return null;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await subirImagen(file);
    if (url) setNueva(prev => ({ ...prev, imagen_url: url }));
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
      setNueva({ titulo: '', subtitulo: '', emoji: '🔥', color: '#7C3AED', btn_texto: 'Ver más →', orden: 1, imagen_url: '', etiqueta: '🔥 Oferta del día' });
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

      {/* Preview */}
      <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 14 }}>Preview del carrusel</div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {ofertas.map((o, i) => (
            <div key={i} style={{
              minWidth: 220, height: 120, borderRadius: 14,
              backgroundColor: o.color, flexShrink: 0,
              opacity: o.activo ? 1 : 0.4,
              position: 'relative', overflow: 'hidden',
              padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              {o.imagen_url && (
                <img src={o.imagen_url} alt="" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', opacity: 0.3,
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 }}>
                  {o.etiqueta || '🔥 Oferta del día'}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{o.titulo}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{o.subtitulo}</div>
                <div style={{
                  backgroundColor: '#AAFF00', borderRadius: 6,
                  padding: '3px 8px', display: 'inline-block',
                  fontSize: 10, fontWeight: 800, color: '#000',
                }}>{o.btn_texto}</div>
              </div>
              <div style={{ fontSize: 36, position: 'relative', zIndex: 1 }}>{o.emoji}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario nueva oferta */}
      {mostrando && (
        <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>Nueva oferta</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {[
              { label: 'TÍTULO', key: 'titulo', placeholder: 'Ej: Envío GRATIS' },
              { label: 'SUBTÍTULO', key: 'subtitulo', placeholder: 'Ej: en tu primer pedido' },
              { label: 'TEXTO DEL BOTÓN', key: 'btn_texto', placeholder: 'Ver más →' },
              { label: 'ETIQUETA (texto arriba)', key: 'etiqueta', placeholder: '🔥 Oferta del día' },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>{f.label}</div>
                <input
                  value={nueva[f.key]}
                  onChange={e => setNueva({ ...nueva, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>EMOJI</div>
              <input
                value={nueva.emoji}
                onChange={e => setNueva({ ...nueva, emoji: e.target.value })}
                placeholder="🔥"
                style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 20, color: C.text, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>COLOR DE FONDO</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {COLORES_PRESET.map((color, i) => (
                <div key={i} onClick={() => setNueva({ ...nueva, color })} style={{
                  width: 32, height: 32, borderRadius: 8, backgroundColor: color, cursor: 'pointer',
                  border: nueva.color === color ? '3px solid #AAFF00' : '2px solid transparent',
                }} />
              ))}
              <input type="color" value={nueva.color} onChange={e => setNueva({ ...nueva, color: e.target.value })}
                style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', border: 'none', padding: 0 }} />
            </div>
          </div>

          {/* Imagen */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>IMAGEN DE FONDO (opcional)</div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => fileRef.current.click()} style={{
                backgroundColor: C.cardLight, color: C.cyan,
                border: `1px solid ${C.cyan}44`, borderRadius: 8,
                padding: '10px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
                {subiendo ? '⏳ Subiendo...' : '📷 Subir imagen'}
              </button>
              {nueva.imagen_url && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={nueva.imagen_url} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                  <span style={{ fontSize: 11, color: C.success }}>✅ Imagen cargada</span>
                  <button onClick={() => setNueva({ ...nueva, imagen_url: '' })} style={{
                    backgroundColor: `${C.error}18`, color: C.error,
                    border: `1px solid ${C.error}44`, borderRadius: 6,
                    padding: '4px 8px', fontSize: 11, cursor: 'pointer',
                  }}>✕</button>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>PREVIEW</div>
            <div style={{
              borderRadius: 14, padding: 16, backgroundColor: nueva.color,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              maxWidth: 320, position: 'relative', overflow: 'hidden', minHeight: 100,
            }}>
              {nueva.imagen_url && (
                <img src={nueva.imagen_url} alt="" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', opacity: 0.3,
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
                  {nueva.etiqueta || '🔥 Oferta del día'}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{nueva.titulo || 'Título'}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{nueva.subtitulo || 'Subtítulo'}</div>
                <div style={{ backgroundColor: '#AAFF00', borderRadius: 6, padding: '4px 10px', display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#000' }}>
                  {nueva.btn_texto || 'Ver más →'}
                </div>
              </div>
              <div style={{ fontSize: 36, position: 'relative', zIndex: 1 }}>{nueva.emoji}</div>
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

      {/* Lista */}
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
              width: 56, height: 56, borderRadius: 12,
              backgroundColor: o.color, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, overflow: 'hidden', position: 'relative',
            }}>
              {o.imagen_url
                ? <img src={o.imagen_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : o.emoji
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{o.titulo}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                {o.subtitulo} · {o.btn_texto} · <span style={{ color: C.cyan }}>{o.etiqueta}</span>
              </div>
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