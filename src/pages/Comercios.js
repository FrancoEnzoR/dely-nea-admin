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
  const [editando, setEditando] = useState(null);
  const [nuevaComision, setNuevaComision] = useState('');
  const [notasAdmin, setNotasAdmin] = useState('');
  const [codigoAdmin, setCodigoAdmin] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarComercios();
  }, []);

  const cargarComercios = () => {
    fetch(`${API}/comercios`)
      .then(r => r.json())
      .then(data => {
        setComercios(data.comercios || []);
        setLoading(false);
      });
  };

  const abrirEditor = (comercio) => {
    setEditando(comercio);
    setNuevaComision(comercio.comision || '10');
    setNotasAdmin(comercio.notas_admin || '');
    setCodigoAdmin('');
    setMensaje(null);
  };

  const guardarComision = async () => {
    if (!codigoAdmin) {
      setMensaje({ tipo: 'error', texto: 'Ingresá el código de administrador' });
      return;
    }
    setGuardando(true);
    try {
      const res = await fetch(`${API}/admin/comercios/${editando.id}/comision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comision: parseFloat(nuevaComision),
          notas_admin: notasAdmin,
          codigo_admin: codigoAdmin,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setMensaje({ tipo: 'error', texto: data.error });
      } else {
        setMensaje({ tipo: 'success', texto: data.mensaje });
        cargarComercios();
        setTimeout(() => {
          setEditando(null);
          setMensaje(null);
        }, 2000);
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    }
    setGuardando(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>Comercios 🏪</h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>Gestioná los comercios y sus comisiones</p>
        </div>
        <button style={{
          backgroundColor: C.acid, color: '#000', border: 'none',
          borderRadius: 10, padding: '10px 18px', fontSize: 12,
          fontWeight: 800, cursor: 'pointer',
        }}>+ Agregar comercio</button>
      </div>

      {loading ? (
        <div style={{ color: C.muted, fontSize: 13 }}>Cargando comercios...</div>
      ) : comercios.length === 0 ? (
        <div style={{ backgroundColor: C.card, borderRadius: 16, padding: 40, textAlign: 'center', border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>No hay comercios todavía</div>
          <div style={{ fontSize: 13, color: C.muted }}>Agregá el primer comercio de Dely Nea</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {comercios.map((comercio, i) => (
            <div key={i} style={{
              backgroundColor: C.card, borderRadius: 14, padding: 20,
              border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0,
              }}>{comercio.nombre[0]}</div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{comercio.nombre}</div>
                <div style={{ fontSize: 12, color: C.muted }}>
                  📍 {comercio.direccion} · 📞 {comercio.telefono}
                </div>
                {comercio.notas_admin && (
                  <div style={{ fontSize: 11, color: C.warning, marginTop: 4 }}>
                    📝 {comercio.notas_admin}
                  </div>
                )}
              </div>

              {/* Comisión actual */}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{
                  fontSize: 24, fontWeight: 900,
                  color: comercio.comision <= 5 ? C.success : comercio.comision <= 10 ? C.cyan : C.warning,
                }}>{comercio.comision || 10}%</div>
                <div style={{ fontSize: 10, color: C.muted }}>comisión</div>
              </div>

              {/* Botón editar */}
              <button onClick={() => abrirEditor(comercio)} style={{
                backgroundColor: `${C.violet}18`, color: C.violet,
                border: `1px solid ${C.violet}44`, borderRadius: 10,
                padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>Editar comisión</button>
            </div>
          ))}
        </div>
      )}

      {/* Modal editar comisión */}
      {editando && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: C.card, borderRadius: 20, padding: 32,
            border: `1px solid ${C.border}`, width: '100%', maxWidth: 440,
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>
              Editar comisión
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>
              {editando.nombre}
            </div>

            {/* Nueva comisión */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Nueva comisión (%)
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {[5, 8, 10, 12, 15].map(v => (
                  <button key={v} onClick={() => setNuevaComision(String(v))} style={{
                    backgroundColor: nuevaComision === String(v) ? C.violet : C.cardLight,
                    color: nuevaComision === String(v) ? '#fff' : C.muted,
                    border: `1px solid ${nuevaComision === String(v) ? C.violet : C.border}`,
                    borderRadius: 8, padding: '6px 12px', fontSize: 12,
                    fontWeight: 700, cursor: 'pointer',
                  }}>{v}%</button>
                ))}
              </div>
              <input
                type="number"
                min="0"
                max="50"
                value={nuevaComision}
                onChange={e => setNuevaComision(e.target.value)}
                style={{
                  width: '100%', backgroundColor: C.cardLight,
                  border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: '10px 14px', fontSize: 14, color: C.text,
                  outline: 'none',
                }}
              />
            </div>

            {/* Notas */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Notas (opcional)
              </div>
              <input
                placeholder="Ej: Descuento por ser comercio nuevo"
                value={notasAdmin}
                onChange={e => setNotasAdmin(e.target.value)}
                style={{
                  width: '100%', backgroundColor: C.cardLight,
                  border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: '10px 14px', fontSize: 13, color: C.text,
                  outline: 'none',
                }}
              />
            </div>

            {/* Código admin */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: '1px', textTransform: 'uppercase' }}>
                🔐 Código de administrador
              </div>
              <input
                type="password"
                placeholder="Ingresá tu código secreto"
                value={codigoAdmin}
                onChange={e => setCodigoAdmin(e.target.value)}
                style={{
                  width: '100%', backgroundColor: C.cardLight,
                  border: `1px solid ${C.violet}44`, borderRadius: 10,
                  padding: '10px 14px', fontSize: 13, color: C.text,
                  outline: 'none',
                }}
              />
            </div>

            {/* Mensaje */}
            {mensaje && (
              <div style={{
                backgroundColor: mensaje.tipo === 'success' ? `${C.success}15` : `${C.error}15`,
                border: `1px solid ${mensaje.tipo === 'success' ? C.success : C.error}44`,
                borderRadius: 10, padding: '10px 14px', marginBottom: 16,
                fontSize: 13, color: mensaje.tipo === 'success' ? C.success : C.error,
              }}>{mensaje.texto}</div>
            )}

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditando(null)} style={{
                flex: 1, backgroundColor: C.cardLight, color: C.muted,
                border: `1px solid ${C.border}`, borderRadius: 10,
                padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={guardarComision} disabled={guardando} style={{
                flex: 1.5, backgroundColor: C.acid, color: '#000',
                border: 'none', borderRadius: 10,
                padding: '11px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}>{guardando ? 'Guardando...' : '✅ Confirmar cambio'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}