/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const estadoColor = (e) => {
  if (e === 'entregado' || e === 'finalizado') return '#00E5A0';
  if (e === 'en camino' || e === 'tecnico_en_camino') return '#00E5FF';
  if (e === 'preparando' || e === 'en_curso') return '#FFB800';
  if (e === 'listo' || e === 'en_domicilio') return '#A855F7';
  if (e === 'nuevo' || e === 'solicitado') return '#FF4567';
  if (e === 'publicado') return '#F59E0B';
  if (e === 'asignado') return '#6366F1';
  return '#6B7599';
};

const pedidosEjemplo = [
  { id: '#4821', cliente: 'Fran Test', cliente_tel: '3624000001', comercio: 'La Leñera Pizzas', items: ['Pizza Muzzarella x1', 'Empanadas x6'], total: 7000, estado: 'entregado', fecha: '22/04/2026', direccion: 'Av. Italia 890' },
  { id: '#4822', cliente: 'Juan García', cliente_tel: '3624111222', comercio: 'Farmacia del Sol', items: ['Ibuprofeno x2'], total: 3500, estado: 'preparando', fecha: '27/04/2026', direccion: 'Belgrano 1240' },
  { id: '#4823', cliente: 'María López', cliente_tel: '3624333444', comercio: 'La Leñera Pizzas', items: ['Pizza Napolitana x2'], total: 12000, estado: 'nuevo', fecha: '27/04/2026', direccion: 'San Martín 456' },
];

const trabajosEjemplo = [
  { id: '#T001', cliente: 'Roberto Díaz', cliente_tel: '3624555666', tecnico: 'Juan Martínez', especialidad: 'Plomería', descripcion: 'Pérdida de agua en baño', estado: 'finalizado', fecha: '26/04/2026', direccion: 'Av. Sarmiento 890' },
  { id: '#T002', cliente: 'Laura Gómez', cliente_tel: '3624777888', tecnico: null, especialidad: 'Electricidad', descripcion: 'Instalación de toma corriente', estado: 'publicado', fecha: '27/04/2026', direccion: 'Fontana 1240' },
  { id: '#T003', cliente: 'Pedro Ruiz', cliente_tel: '3624999000', tecnico: 'Carlos López', especialidad: 'Técnico PC', descripcion: 'PC no enciende', estado: 'en_curso', fecha: '27/04/2026', direccion: 'Belgrano 456' },
];

export default function Pedidos() {
  const [tab, setTab] = useState('comercios');
  const [pedidos, setPedidos] = useState(pedidosEjemplo);
  const [trabajos, setTrabajos] = useState(trabajosEjemplo);
  const [expandido, setExpandido] = useState(null);
  const [filtroPedidos, setFiltroPedidos] = useState('todos');
  const [filtroTrabajos, setFiltroTrabajos] = useState('todos');

  const pedidosFiltrados = filtroPedidos === 'todos'
    ? pedidos
    : pedidos.filter(p => p.estado === filtroPedidos);

  const trabajosFiltrados = filtroTrabajos === 'todos'
    ? trabajos
    : trabajos.filter(t => t.estado === filtroTrabajos);

  const avanzarEstadoPedido = (id) => {
    const flujo = { 'nuevo': 'preparando', 'preparando': 'listo', 'listo': 'en camino', 'en camino': 'entregado' };
    setPedidos(pedidos.map(p => p.id === id ? { ...p, estado: flujo[p.estado] || p.estado } : p));
  };

  const avanzarEstadoTrabajo = (id) => {
    const flujo = { 'publicado': 'asignado', 'asignado': 'tecnico_en_camino', 'tecnico_en_camino': 'en_domicilio', 'en_domicilio': 'en_curso', 'en_curso': 'finalizado' };
    setTrabajos(trabajos.map(t => t.id === id ? { ...t, estado: flujo[t.estado] || t.estado } : t));
  };

  const btnLabelPedido = (estado) => {
    if (estado === 'nuevo') return '👨‍🍳 Aceptar pedido';
    if (estado === 'preparando') return '✅ Marcar listo';
    if (estado === 'listo') return '🏍️ En camino';
    if (estado === 'en camino') return '📦 Entregado';
    return null;
  };

  const btnLabelTrabajo = (estado) => {
    if (estado === 'publicado') return '👷 Asignar técnico';
    if (estado === 'asignado') return '🏍️ Técnico en camino';
    if (estado === 'tecnico_en_camino') return '🏠 En domicilio';
    if (estado === 'en_domicilio') return '🔧 Trabajo en curso';
    if (estado === 'en_curso') return '✅ Finalizado';
    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
          Pedidos y Servicios 📦
        </h1>
        <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
          Gestioná pedidos de comercios y solicitudes de técnicos
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'comercios', label: '🏪 Pedidos de comercios', count: pedidos.length },
          { key: 'tecnicos', label: '🔧 Servicios técnicos', count: trabajos.length },
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

      {/* TAB COMERCIOS */}
      {tab === 'comercios' && (
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Nuevos', value: pedidos.filter(p => p.estado === 'nuevo').length, color: C.error },
              { label: 'Preparando', value: pedidos.filter(p => p.estado === 'preparando').length, color: C.warning },
              { label: 'En camino', value: pedidos.filter(p => p.estado === 'en camino').length, color: C.cyan },
              { label: 'Entregados', value: pedidos.filter(p => p.estado === 'entregado').length, color: C.success },
            ].map((s, i) => (
              <div key={i} onClick={() => setFiltroPedidos(s.label.toLowerCase())} style={{
                backgroundColor: C.card, borderRadius: 12, padding: '14px 16px',
                border: `1px solid ${s.color}22`, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['todos', 'nuevo', 'preparando', 'listo', 'en camino', 'entregado'].map(f => (
              <button key={f} onClick={() => setFiltroPedidos(f)} style={{
                backgroundColor: filtroPedidos === f ? C.violet : C.cardLight,
                color: filtroPedidos === f ? '#fff' : C.muted,
                border: `1px solid ${filtroPedidos === f ? C.violet : C.border}`,
                borderRadius: 20, padding: '5px 14px', fontSize: 11,
                fontWeight: filtroPedidos === f ? 700 : 400, cursor: 'pointer',
                textTransform: 'capitalize',
              }}>{f}</button>
            ))}
          </div>

          {/* Lista pedidos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pedidosFiltrados.map((p, i) => (
              <div key={i} style={{
                backgroundColor: C.card, borderRadius: 14, padding: 18,
                border: `1px solid ${p.estado === 'nuevo' ? C.error + '44' : C.border}`,
                cursor: 'pointer',
              }} onClick={() => setExpandido(expandido === p.id ? null : p.id)}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.cyan }}>{p.id}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: estadoColor(p.estado),
                        backgroundColor: `${estadoColor(p.estado)}15`,
                        borderRadius: 6, padding: '2px 8px',
                        textTransform: 'capitalize',
                      }}>{p.estado}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.cliente}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>🏪 {p.comercio} · 📅 {p.fecha}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: C.acid }}>${p.total.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>📍 {p.direccion}</div>
                  </div>
                </div>

                {expandido === p.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ marginBottom: 12 }}>
                      {p.items.map((item, j) => (
                        <div key={j} style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>• {item}</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {btnLabelPedido(p.estado) && (
                        <button onClick={(e) => { e.stopPropagation(); avanzarEstadoPedido(p.id); }} style={{
                          backgroundColor: C.acid, color: '#000', border: 'none',
                          borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                        }}>{btnLabelPedido(p.estado)}</button>
                      )}
                      <a href={`https://wa.me/549${p.cliente_tel}`} target="_blank" rel="noreferrer" style={{
                        backgroundColor: `${C.success}18`, color: C.success,
                        border: `1px solid ${C.success}44`, borderRadius: 8,
                        padding: '8px 16px', fontSize: 12, fontWeight: 700,
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                      }}>💬 WhatsApp cliente</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB TÉCNICOS */}
      {tab === 'tecnicos' && (
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Solicitados', value: trabajos.filter(t => t.estado === 'solicitado').length, color: C.error },
              { label: 'Publicados', value: trabajos.filter(t => t.estado === 'publicado').length, color: C.warning },
              { label: 'En curso', value: trabajos.filter(t => t.estado === 'en_curso').length, color: C.cyan },
              { label: 'Finalizados', value: trabajos.filter(t => t.estado === 'finalizado').length, color: C.success },
            ].map((s, i) => (
              <div key={i} style={{
                backgroundColor: C.card, borderRadius: 12, padding: '14px 16px',
                border: `1px solid ${s.color}22`,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['todos', 'solicitado', 'publicado', 'asignado', 'en_curso', 'finalizado'].map(f => (
              <button key={f} onClick={() => setFiltroTrabajos(f)} style={{
                backgroundColor: filtroTrabajos === f ? C.violet : C.cardLight,
                color: filtroTrabajos === f ? '#fff' : C.muted,
                border: `1px solid ${filtroTrabajos === f ? C.violet : C.border}`,
                borderRadius: 20, padding: '5px 14px', fontSize: 11,
                fontWeight: filtroTrabajos === f ? 700 : 400, cursor: 'pointer',
              }}>{f}</button>
            ))}
          </div>

          {/* Lista trabajos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trabajosFiltrados.map((t, i) => (
              <div key={i} style={{
                backgroundColor: C.card, borderRadius: 14, padding: 18,
                border: `1px solid ${t.estado === 'publicado' ? C.warning + '44' : C.border}`,
                cursor: 'pointer',
              }} onClick={() => setExpandido(expandido === t.id ? null : t.id)}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.violet }}>{t.id}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: estadoColor(t.estado),
                        backgroundColor: `${estadoColor(t.estado)}15`,
                        borderRadius: 6, padding: '2px 8px',
                      }}>{t.estado}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.cliente}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      🔧 {t.especialidad} · 📅 {t.fecha}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      👷 {t.tecnico || '⚠️ Sin técnico asignado'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: C.muted }}>📍 {t.direccion}</div>
                  </div>
                </div>

                {expandido === t.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 13, color: C.text, marginBottom: 12 }}>
                      📝 {t.descripcion}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {btnLabelTrabajo(t.estado) && (
                        <button onClick={(e) => { e.stopPropagation(); avanzarEstadoTrabajo(t.id); }} style={{
                          backgroundColor: C.acid, color: '#000', border: 'none',
                          borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                        }}>{btnLabelTrabajo(t.estado)}</button>
                      )}
                      <a href={`https://wa.me/549${t.cliente_tel}`} target="_blank" rel="noreferrer" style={{
                        backgroundColor: `${C.success}18`, color: C.success,
                        border: `1px solid ${C.success}44`, borderRadius: 8,
                        padding: '8px 16px', fontSize: 12, fontWeight: 700,
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                      }}>💬 WhatsApp cliente</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}