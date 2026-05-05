/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

export default function Comercios() {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [seleccionado, setSeleccionado] = useState(null);
  const [editandoComision, setEditandoComision] = useState(null);
  const [nuevaComision, setNuevaComision] = useState('');
  const [codigoAdmin, setCodigoAdmin] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarComercios();
  }, []);

  const cargarComercios = async () => {
    try {
      const res = await fetch(`${API}/admin/comercios`);
      const data = await res.json();
      setComercios(data.comercios || []);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await fetch(`${API}/admin/comercios/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      cargarComercios();
      setSeleccionado(null);
    } catch (error) {
      console.log(error);
    }
  };

  const guardarComision = async (id) => {
    if (!codigoAdmin) {
      setMensaje({ tipo: 'error', texto: 'Ingresá el código de administrador' });
      return;
    }
    setGuardando(true);
    try {
      const res = await fetch(`${API}/admin/comercios/${id}/comision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comision: parseFloat(nuevaComision),
          codigo_admin: codigoAdmin,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setMensaje({ tipo: 'error', texto: data.error });
      } else {
        setMensaje({ tipo: 'success', texto: '✅ Comisión actualizada' });
        cargarComercios();
        setTimeout(() => {
          setEditandoComision(null);
          setMensaje(null);
          setCodigoAdmin('');
        }, 2000);
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    }
    setGuardando(false);
  };

  const estadoColor = (e) => {
    if (e === 'aprobado' || e === true) return C.success;
    if (e === 'pendiente') return C.warning;
    if (e === 'rechazado') return C.error;
    return C.muted;
  };

  const estadoLabel = (e, activo) => {
    if (activo === false) return '❌ Inactivo';
    if (e === 'pendiente') return '⏳ Pendiente';
    if (e === 'rechazado') return '❌ Rechazado';
    return '✅ Activo';
  };

  const filtrados = comercios.filter(c => {
    if (filtro === 'todos') return true;
    if (filtro === 'pendiente') return c.estado === 'pendiente' || (!c.estado && !c.activo);
    if (filtro === 'aprobado') return c.activo === true;
    if (filtro === 'rechazado') return c.estado === 'rechazado';
    return true;
  });

  const pendientes = comercios.filter(c => c.estado === 'pendiente' || (!c.estado && !c.activo)).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            Comercios 🏪
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
            Gestioná los comercios de Dely Nea
          </p>
        </div>
        {pendientes > 0 && (
          <div style={{
            backgroundColor: `${C.warning}15`, border: `1px solid ${C.warning}44`,
            borderRadius: 10, padding: '8px 16px',
            fontSize: 13, color: C.warning, fontWeight: 700,
          }}>
            ⏳ {pendientes} pendiente{pendientes > 1 ? 's' : ''} de aprobación
          </div>
        )}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'pendiente', label: '⏳ Pendientes' },
          { key: 'aprobado', label: '✅ Aprobados' },
          { key: 'rechazado', label: '❌ Rechazados' },
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

      {loading ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Cargando...</div>
      ) : filtrados.length === 0 ? (
        <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 40, textAlign: 'center', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>No hay comercios en este estado</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtrados.map((comercio, i) => (
            <div key={i} style={{
              backgroundColor: C.card, borderRadius: 14, padding: 18,
              border: `1px solid ${comercio.estado === 'pendiente' ? C.warning + '44' : C.border}`,
              cursor: 'pointer',
            }} onClick={() => setSeleccionado(seleccionado?.id === comercio.id ? null : comercio)}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0,
                }}>{comercio.nombre[0]}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{comercio.nombre}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    📍 {comercio.direccion} · 📞 {comercio.telefono}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    ✉️ {comercio.email} · {comercio.categoria_principal || comercio.categorias?.nombre || '—'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: estadoColor(comercio.estado || comercio.activo),
                    backgroundColor: `${estadoColor(comercio.estado || comercio.activo)}15`,
                    borderRadius: 8, padding: '4px 12px',
                  }}>{estadoLabel(comercio.estado, comercio.activo)}</span>
                  <span style={{ fontSize: 13, color: C.acid, fontWeight: 700 }}>
                    {comercio.comision || 10}% comisión
                  </span>
                </div>
              </div>

              {/* Expandido */}
              {seleccionado?.id === comercio.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>

                  {/* Info adicional */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginBottom: 16 }}>
                    {[
                      { label: 'CUIT', value: comercio.cuit || '—' },
                      { label: 'Descripción', value: comercio.descripcion || '—' },
                      { label: 'Foto local', value: comercio.tiene_foto_local ? '✅' : '❌' },
                      { label: 'Logo', value: comercio.tiene_logo ? '✅' : '❌' },
                      { label: 'Documento', value: comercio.tiene_documento ? '✅' : '❌' },
                    ].map((d, j) => (
                      <div key={j} style={{ backgroundColor: C.cardLight, borderRadius: 10, padding: 10 }}>
                        <div style={{ fontSize: 9, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{d.label}</div>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{d.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Editar comisión */}
                  {editandoComision === comercio.id ? (
                    <div style={{ backgroundColor: C.cardLight, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Nueva comisión (%)</div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        {[5, 8, 10, 12, 15].map(v => (
                          <button key={v} onClick={() => setNuevaComision(String(v))} style={{
                            backgroundColor: nuevaComision === String(v) ? C.violet : C.card,
                            color: nuevaComision === String(v) ? '#fff' : C.muted,
                            border: `1px solid ${nuevaComision === String(v) ? C.violet : C.border}`,
                            borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          }}>{v}%</button>
                        ))}
                      </div>
                      <input
                        type="password"
                        placeholder="Código de administrador"
                        value={codigoAdmin}
                        onChange={e => setCodigoAdmin(e.target.value)}
                        style={{ width: '100%', backgroundColor: C.card, border: `1px solid ${C.violet}44`, borderRadius: 8, padding: '8px 12px', fontSize: 13, color: C.text, outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                      />
                      {mensaje && (
                        <div style={{ fontSize: 12, color: mensaje.tipo === 'success' ? C.success : C.error, marginBottom: 8 }}>
                          {mensaje.texto}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setEditandoComision(null)} style={{ backgroundColor: C.card, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 14px', fontSize: 12, cursor: 'pointer' }}>Cancelar</button>
                        <button onClick={() => guardarComision(comercio.id)} disabled={guardando} style={{ backgroundColor: C.acid, color: '#000', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                          {guardando ? 'Guardando...' : '✅ Guardar'}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(comercio.estado === 'pendiente' || !comercio.activo) && (
                      <button onClick={(e) => { e.stopPropagation(); cambiarEstado(comercio.id, 'aprobado'); }} style={{
                        backgroundColor: `${C.success}18`, color: C.success,
                        border: `1px solid ${C.success}44`, borderRadius: 8,
                        padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}>✅ Aprobar</button>
                    )}
                    {comercio.estado !== 'rechazado' && (
                      <button onClick={(e) => { e.stopPropagation(); cambiarEstado(comercio.id, 'rechazado'); }} style={{
                        backgroundColor: `${C.error}18`, color: C.error,
                        border: `1px solid ${C.error}44`, borderRadius: 8,
                        padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}>❌ Rechazar</button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setEditandoComision(comercio.id); setNuevaComision(String(comercio.comision || 10)); }} style={{
                      backgroundColor: `${C.acid}18`, color: C.acid,
                      border: `1px solid ${C.acid}44`, borderRadius: 8,
                      padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}>💰 Comisión</button>
                    <a href={`https://wa.me/549${comercio.telefono}`} target="_blank" rel="noreferrer" style={{
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