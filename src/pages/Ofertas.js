/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API = 'https://dely-nea-backend.onrender.com';
const SUPABASE_URL = 'https://niipnuxwxrsxzvzucsis.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paXBudXh3eHJzeHp2enVjc2lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjgzMjMyMCwiZXhwIjoyMDkyNDA4MzIwfQ.2gg50iofZLTKSML_hl-UrjNaQ12YmIkZBe0F4Nq948E';

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

function SortableOferta({ oferta, onToggle, onEliminar }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: oferta.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{
        minWidth: 220, height: 120, borderRadius: 14,
        backgroundColor: oferta.color, flexShrink: 0,
        opacity: oferta.activo ? 1 : 0.4,
        position: 'relative', overflow: 'hidden',
        padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'grab', userSelect: 'none',
      }} {...attributes} {...listeners}>
        {oferta.imagen_url && (
          <img src={oferta.imagen_url} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 1,
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1, background: oferta.imagen_url ? 'rgba(0,0,0,0.4)' : 'transparent', borderRadius: 8, padding: 4 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', letterSpacing: 1, marginBottom: 4 }}>
            {oferta.etiqueta || '🔥 Oferta del día'}
          </div>
          {oferta.titulo && <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{oferta.titulo}</div>}
          {oferta.subtitulo && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{oferta.subtitulo}</div>}
          <div style={{
            backgroundColor: '#AAFF00', borderRadius: 6,
            padding: '3px 8px', display: 'inline-block',
            fontSize: 10, fontWeight: 800, color: '#000',
          }}>{oferta.btn_texto}</div>
        </div>
        {!oferta.imagen_url && <div style={{ fontSize: 36, position: 'relative', zIndex: 1 }}>{oferta.emoji}</div>}
        <div style={{
          position: 'absolute', top: 6, right: 6,
          backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 6,
          padding: '2px 6px', fontSize: 10, color: '#fff',
        }}>⠿ arrastrar</div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        <button onClick={() => onToggle(oferta)} style={{
          flex: 1, backgroundColor: oferta.activo ? `${C.success}18` : `${C.muted}18`,
          color: oferta.activo ? C.success : C.muted,
          border: `1px solid ${oferta.activo ? C.success : C.muted}44`,
          borderRadius: 8, padding: '5px 8px', fontSize: 10,
          fontWeight: 700, cursor: 'pointer',
        }}>{oferta.activo ? '✅ Activa' : '⏸ Inactiva'}</button>
        <button onClick={() => onEliminar(oferta.id)} style={{
          backgroundColor: `${C.error}18`, color: C.error,
          border: `1px solid ${C.error}44`, borderRadius: 8,
          padding: '5px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer',
        }}>🗑</button>
      </div>
    </div>
  );
}

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

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => { cargarOfertas(); }, []);

  const cargarOfertas = async () => {
    try {
      const res = await fetch(`${API}/ofertas`);
      const data = await res.json();
      setOfertas(data.ofertas || []);
    } catch (error) { console.log(error); }
    setLoading(false);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ofertas.findIndex(o => o.id === active.id);
    const newIndex = ofertas.findIndex(o => o.id === over.id);
    const nuevasOfertas = arrayMove(ofertas, oldIndex, newIndex);
    setOfertas(nuevasOfertas);
    // Actualizar orden en backend
    nuevasOfertas.forEach(async (o, i) => {
      await fetch(`${API}/ofertas/${o.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orden: i + 1 }),
      });
    });
  };

  const subirImagen = async (file) => {
    if (!file) return null;
    setSubiendo(true);
    try {
      const fileName = `oferta-${Date.now()}.${file.name.split('.').pop()}`;
      const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/ofertas/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': file.type,
        },
        body: file,
      });
      if (res.ok) {
        const url = `${SUPABASE_URL}/storage/v1/object/public/ofertas/${fileName}`;
        setSubiendo(false);
        return url;
      }
    } catch (error) { console.log(error); }
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
    } catch (error) { console.log(error); }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta oferta?')) return;
    try {
      await fetch(`${API}/ofertas/${id}`, { method: 'DELETE' });
      cargarOfertas();
    } catch (error) { console.log(error); }
  };

  const agregar = async () => {
    if (!nueva.titulo && !nueva.imagen_url) return;
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
    } catch (error) { console.log(error); }
    setGuardando(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>Publicidad y Ofertas 📢</h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>Arrastrá las tarjetas para cambiar el orden en la app</p>
        </div>
        <button onClick={() => setMostrando(!mostrando)} style={{
          backgroundColor: C.acid, color: '#000', border: 'none',
          borderRadius: 10, padding: '10px 18px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
        }}>+ Nueva oferta</button>
      </div>

      {/* Preview con drag and drop */}
      <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>Preview del carrusel</div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>⠿ Arrastrá para reordenar</div>
        {loading ? (
          <div style={{ color: C.muted, fontSize: 13 }}>Cargando...</div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={ofertas.map(o => o.id)} strategy={horizontalListSortingStrategy}>
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                {ofertas.map(o => (
                  <SortableOferta key={o.id} oferta={o} onToggle={toggleActivo} onEliminar={eliminar} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Formulario nueva oferta */}
      {mostrando && (
        <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>Nueva oferta</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'TÍTULO', key: 'titulo', placeholder: 'Ej: Envío GRATIS' },
              { label: 'SUBTÍTULO', key: 'subtitulo', placeholder: 'Ej: en tu primer pedido' },
              { label: 'TEXTO DEL BOTÓN', key: 'btn_texto', placeholder: 'Ver más →' },
              { label: 'ETIQUETA (texto arriba)', key: 'etiqueta', placeholder: '🔥 Oferta del día' },
            ].map((f, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>{f.label}</div>
                <div style={{ position: 'relative' }}>
                  <input
                    value={nueva[f.key]}
                    onChange={e => setNueva({ ...nueva, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 36px 10px 12px', fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box' }}
                  />
                  {nueva[f.key] && (
                    <button onClick={() => setNueva({ ...nueva, [f.key]: '' })} style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      backgroundColor: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14,
                    }}>✕</button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>EMOJI</div>
              <div style={{ position: 'relative' }}>
                <input
                  value={nueva.emoji}
                  onChange={e => setNueva({ ...nueva, emoji: e.target.value })}
                  placeholder="🔥"
                  style={{ width: '100%', backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 36px 10px 12px', fontSize: 20, color: C.text, outline: 'none', boxSizing: 'border-box' }}
                />
                {nueva.emoji && (
                  <button onClick={() => setNueva({ ...nueva, emoji: '' })} style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    backgroundColor: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 14,
                  }}>✕</button>
                )}
              </div>
            </div>
          </div>

          {/* Color e imagen */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>COLOR DE FONDO E IMAGEN</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {COLORES_PRESET.map((color, i) => (
                <div key={i} onClick={() => setNueva({ ...nueva, color })} style={{
                  width: 32, height: 32, borderRadius: 8, backgroundColor: color, cursor: 'pointer',
                  border: nueva.color === color ? '3px solid #AAFF00' : '2px solid transparent',
                }} />
              ))}
              <input type="color" value={nueva.color} onChange={e => setNueva({ ...nueva, color: e.target.value })}
                style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', border: 'none', padding: 0 }} />
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <div onClick={() => fileRef.current.click()} style={{
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                backgroundColor: C.cardLight, border: `1px solid ${C.cyan}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                {subiendo ? '⏳' : '📷'}
              </div>
              {nueva.imagen_url && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={nueva.imagen_url} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                  <span style={{ fontSize: 11, color: C.success }}>✅</span>
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
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1,
                }} />
              )}
              <div style={{ position: 'relative', zIndex: 1, background: nueva.imagen_url ? 'rgba(0,0,0,0.4)' : 'transparent', borderRadius: 8, padding: 4 }}>
                {nueva.etiqueta && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{nueva.etiqueta}</div>}
                {nueva.titulo && <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{nueva.titulo}</div>}
                {nueva.subtitulo && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>{nueva.subtitulo}</div>}
                {nueva.btn_texto && <div style={{ backgroundColor: '#AAFF00', borderRadius: 6, padding: '4px 10px', display: 'inline-block', fontSize: 11, fontWeight: 800, color: '#000' }}>{nueva.btn_texto}</div>}
              </div>
              {!nueva.imagen_url && nueva.emoji && <div style={{ fontSize: 36, position: 'relative', zIndex: 1 }}>{nueva.emoji}</div>}
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
    </div>
  );
}