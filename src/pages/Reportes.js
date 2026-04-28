import { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
            {p.name === 'comisiones' ? `$${p.value.toLocaleString()}` : `${p.value} pedidos`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const coloresCat = [C.cyan, C.violet, C.success, C.warning, C.acid];

export default function Reportes() {
  const [periodo, setPeriodo] = useState('semanal');
  const [stats, setStats] = useState(null);
  const [comerciosStats, setComerciosStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/stats`).then(r => r.json()),
      fetch(`${API}/admin/comercios/stats`).then(r => r.json()),
    ]).then(([adminStats, comerciosData]) => {
      setStats(adminStats);
      setComerciosStats(comerciosData.comercios || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalComisiones = stats?.comisiones || 0;
  const totalPedidos = stats?.pedidos || 0;
  const ticketPromedio = totalPedidos > 0 ? Math.round(totalComisiones / totalPedidos) : 0;

  const dataComercios = comerciosStats.map((c, i) => ({
    name: c.nombre,
    comisiones: c.comisiones,
    pedidos: c.pedidos,
    color: coloresCat[i % coloresCat.length],
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            Reportes y Contabilidad 💰
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
            Datos reales de Dely Nea — Gran Resistencia
          </p>
        </div>
        <button style={{
          backgroundColor: C.acid, color: '#000', border: 'none',
          borderRadius: 10, padding: '10px 18px', fontSize: 12,
          fontWeight: 800, cursor: 'pointer',
        }}>⬇ Exportar Excel</button>
      </div>

      {/* KPIs reales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Comisiones totales', value: loading ? '...' : `$${totalComisiones.toLocaleString()}`, icon: '💰', color: C.success, sub: '10% por pedido' },
          { label: 'Pedidos realizados', value: loading ? '...' : totalPedidos, icon: '📦', color: C.cyan, sub: 'Total histórico' },
          { label: 'Ticket promedio', value: loading ? '...' : `$${ticketPromedio.toLocaleString()}`, icon: '🎫', color: C.violet, sub: 'por comisión' },
          { label: 'Comercios activos', value: loading ? '...' : comerciosStats.length, icon: '🏪', color: C.acid, sub: 'En la plataforma' },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 14, padding: '18px 20px',
            border: `1px solid ${s.color}22`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: C.muted, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, letterSpacing: '-0.5px', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Comisiones por comercio */}
      {comerciosStats.length > 0 && (
        <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Comisiones por comercio</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Datos reales de la base de datos</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataComercios}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v.toLocaleString()}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="comisiones" radius={[4, 4, 0, 0]} name="comisiones">
                {dataComercios.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabla detalle por comercio */}
      <div style={{ backgroundColor: C.card, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Detalle por comercio</div>
        </div>
        {loading ? (
          <div style={{ padding: 24, color: C.muted, fontSize: 13 }}>Cargando datos reales...</div>
        ) : comerciosStats.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: C.muted, fontSize: 13 }}>
            No hay datos de comercios todavía
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Comercio', 'Pedidos', 'Ventas totales', 'Comisiones (10%)', 'Estado'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, color: C.muted, letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comerciosStats.map((c, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.text, fontWeight: 600 }}>{c.nombre}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.cyan, fontWeight: 700 }}>{c.pedidos}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.text }}>${c.ventas.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: C.success, fontWeight: 700 }}>${c.comisiones.toLocaleString()}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: C.success,
                      backgroundColor: `${C.success}15`, borderRadius: 6, padding: '3px 10px',
                    }}>Activo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}