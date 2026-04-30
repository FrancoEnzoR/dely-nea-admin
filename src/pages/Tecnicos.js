/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

export default function Tecnicos() {
  const [tab, setTab] = useState('repartidores');
  const [repartidores, setRepartidores] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [r, t] = await Promise.all([
        fetch(`${API}/admin/repartidores`).then(res => res.json()),
        fetch(`${API}/admin/tecnicos`).then(res => res.json()),
      ]);
      setRepartidores(r.repartidores || []);
      setTecnicos(t.tecnicos || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const cambiarEstado = async (id, tipo, estado) => {
    try {
      await fetch(`${API}/admin/${tipo}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      cargarDatos();
      setSeleccionado(null);
    } catch (error) {
      console.log(error);
    }
  };

  const estadoColor = (e) => {
    if (e === 'aprobado') return C.success;
    if (e === 'pendiente' || e === 'pendiente_entrevista') return C.warning;
    if (e === 'rechazado') return C.error;
    return C.muted;
  };

  const estadoLabel = (e) => {
    if (e === 'aprobado') return '✅ Aprobado';
    if (e === 'pendiente') return '⏳ Pendiente';
    if (e === 'pendiente_entrevista') return '🤝 Entrevista pendiente';
    if (e === 'rechazado') return '❌ Rechazado';
    return e;
  };

  const lista = tab === 'repartidores' ? repartidores : tecnicos;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
          Trabajadores 👷
        </h1>
        <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
          Gestioná repartidores y técnicos de Dely Nea
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'repartidores', label: '🏍️ Repartidores', count: repartidores.length },
          { key: 'tecnicos', label: '🔧 Técnicos', count: tecnicos.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            backgroundColor: tab === t.key ? C.violet : C.cardLight,
            color: tab === t.key ? '#fff' : C.muted,
            border: `1px solid ${tab === t.key ? C.violet : C.border}`,
            borderRadius: 10, padding: '9px 18px', fontSize: 13,
            fontWeight: tab === t.key ? 700 : 400, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {t.label}
            <span style={{
              backgroundColor: tab === t.key ? 'rgba(255,255,255,0.2)' : C.card,
              borderRadius: 20, padding: '1px 8px', fontSize: 11,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Cargando...</div>
      ) : lista.length === 0 ? (
        <div style={{
          backgroundColor: C.card, borderRadius: 16, padding: 40,
          textAlign: 'center', border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {tab === 'repartidores' ? '🏍️' : '🔧'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>
            No hay {tab} todavía
          </div>
          <div style={{ fontSize: 13, color: C.muted }}>
            Cuando alguien se registre aparecerá acá
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lista.map((item, i) => (
            <div key={i} style={{
              backgroundColor: C.card, borderRadius: 14, padding: 18,
              border: `1px solid ${C.border}`, cursor: 'pointer',
            }} onClick={() => setSeleccionado(seleccionado?.id === item.id ? null : item)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${tab === 'repartidores' ? C.cyan : C.violet}, ${C.violet})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0,
                }}>{item.nombre[0]}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{item.nombre}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    📞 {item.telefono} · ✉️ {item.email}
                  </div>
                  {tab === 'repartidores' && (
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      🏍️ {item.tipo_vehiculo} {item.marca_moto} {item.modelo_moto} · 📍 {item.zonas}
                    </div>
                  )}
                  {tab === 'tecnicos' && (
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      🔧 {item.especialidades} · 📍 {item.zonas}
                    </div>
                  )}
                </div>

                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: estadoColor(item.estado),
                  backgroundColor: `${estadoColor(item.estado)}15`,
                  borderRadius: 8, padding: '4px 12px', flexShrink: 0,
                }}>{estadoLabel(item.estado)}</span>
              </div>

              {/* Detalle expandido */}
              {seleccionado?.id === item.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
                    {tab === 'repartidores' && [
                      { label: 'DNI', value: item.dni },
                      { label: 'Dirección', value: item.direccion },
                      { label: 'Patente', value: item.patente },
                      { label: 'Año vehículo', value: item.anio_moto },
                    ].map((d, j) => (
                      <div key={j} style={{ backgroundColor: C.cardLight, borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{d.label}</div>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{d.value || '—'}</div>
                      </div>
                    ))}
                    {tab === 'tecnicos' && [
                      { label: 'DNI', value: item.dni },
                      { label: 'Experiencia', value: `${item.anios_experiencia} años` },
                      { label: 'Tarifa/hora', value: `$${item.tarifa_hora}` },
                      { label: 'Descripción', value: item.descripcion },
                    ].map((d, j) => (
                      <div key={j} style={{ backgroundColor: C.cardLight, borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 10, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{d.label}</div>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{d.value || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Documentación */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Documentación</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {tab === 'repartidores' && [
                        { label: 'Foto perfil', ok: item.tiene_foto_perfil },
                        { label: 'DNI', ok: item.tiene_dni },
                        { label: 'Carnet', ok: item.tiene_carnet },
                        { label: 'Foto moto', ok: item.tiene_foto_moto },
                        { label: 'Seguro', ok: item.tiene_seguro },
                        { label: 'VTV', ok: item.tiene_vtv },
                      ].map((doc, j) => (
                        <span key={j} style={{
                          fontSize: 11, fontWeight: 600,
                          color: doc.ok ? C.success : C.error,
                          backgroundColor: doc.ok ? `${C.success}15` : `${C.error}15`,
                          borderRadius: 8, padding: '4px 10px',
                        }}>{doc.ok ? '✅' : '❌'} {doc.label}</span>
                      ))}
                      {tab === 'tecnicos' && [
                        { label: 'Foto perfil', ok: item.tiene_foto_perfil },
                        { label: 'DNI', ok: item.tiene_dni },
                        { label: 'Certificado', ok: item.tiene_certificado },
                        { label: 'Portfolio', ok: item.tiene_portfolio },
                      ].map((doc, j) => (
                        <span key={j} style={{
                          fontSize: 11, fontWeight: 600,
                          color: doc.ok ? C.success : C.error,
                          backgroundColor: doc.ok ? `${C.success}15` : `${C.error}15`,
                          borderRadius: 8, padding: '4px 10px',
                        }}>{doc.ok ? '✅' : '❌'} {doc.label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={(e) => { e.stopPropagation(); cambiarEstado(item.id, tab, 'aprobado'); }} style={{
                      backgroundColor: `${C.success}18`, color: C.success,
                      border: `1px solid ${C.success}44`, borderRadius: 8,
                      padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>✅ Aprobar</button>
                    <button onClick={(e) => { e.stopPropagation(); cambiarEstado(item.id, tab, 'rechazado'); }} style={{
                      backgroundColor: `${C.error}18`, color: C.error,
                      border: `1px solid ${C.error}44`, borderRadius: 8,
                      padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>❌ Rechazar</button>
                    <a href={`https://wa.me/549${item.telefono}`} target="_blank" rel="noreferrer" style={{
                      backgroundColor: `${C.success}18`, color: C.success,
                      border: `1px solid ${C.success}44`, borderRadius: 8,
                      padding: '8px 16px', fontSize: 12, fontWeight: 700,
                      textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                    }}>💬 WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}