import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const ventasSemana = [
  { dia: 'Lun', ventas: 12400, pedidos: 4 },
  { dia: 'Mar', ventas: 18600, pedidos: 6 },
  { dia: 'Mié', ventas: 9800, pedidos: 3 },
  { dia: 'Jue', ventas: 24000, pedidos: 8 },
  { dia: 'Vie', ventas: 31500, pedidos: 11 },
  { dia: 'Sáb', ventas: 42000, pedidos: 14 },
  { dia: 'Dom', ventas: 28000, pedidos: 9 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
            {p.name === 'ventas' ? `$${p.value.toLocaleString()}` : `${p.value} pedidos`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/`).then(r => r.json()),
      fetch(`${API}/admin/stats`).then(r => r.json()),
    ]).then(([api, adminStats]) => {
      setApiOnline(true);
      setStats(adminStats);
      setLoading(false);
    }).catch(() => {
      setApiOnline(false);
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: 'Usuarios registrados', value: loading ? '...' : stats?.usuarios || 0, icon: '👥', color: C.cyan, sub: 'Total en la plataforma' },
    { label: 'Comercios activos', value: loading ? '...' : stats?.comercios || 0, icon: '🏪', color: C.violet, sub: 'Gran Resistencia' },
    { label: 'Pedidos totales', value: loading ? '...' : stats?.pedidos || 0, icon: '📦', color: C.acid, sub: `${stats?.pedidosHoy || 0} hoy` },
    { label: 'Comisiones totales', value: loading ? '...' : `$${(stats?.comisiones || 0).toLocaleString()}`, icon: '💰', color: C.success, sub: `$${(stats?.comisionesHoy || 0).toLocaleString()} hoy` },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
          Bienvenido, Franco 👋
        </h1>
        <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
          Resumen en tiempo real de Dely Nea — Gran Resistencia
        </p>
      </div>

      {/* Stats reales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14, marginBottom: 24 }}>
        {cards.map((s, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 14, padding: '18px 20px',
            border: `1px solid ${s.color}22`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 9, color: C.muted, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600 }}>
                {s.label}
              </span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, letterSpacing: '-1px', marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Ventas esta semana</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Ingresos diarios en pesos</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ventasSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="dia" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ventas" stroke={C.cyan} strokeWidth={2.5} dot={{ fill: C.cyan, r: 3 }} name="ventas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Pedidos por día</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Cantidad de pedidos</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ventasSemana}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="dia" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pedidos" fill={C.violet} radius={[4, 4, 0, 0]} name="pedidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Estado del sistema */}
      <div style={{ backgroundColor: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>Estado del sistema</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {[
            { label: 'API Server', estado: apiOnline ? 'Online' : 'Offline', color: apiOnline ? C.success : C.error },
            { label: 'Base de datos', estado: 'Conectada', color: C.success },
            { label: 'App móvil', estado: 'Activa', color: C.success },
            { label: 'Google Login', estado: 'En desarrollo', color: C.warning },
            { label: 'Email verificación', estado: 'Pendiente', color: C.warning },
            { label: 'App Store', estado: 'Próximamente', color: C.muted },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px', backgroundColor: C.cardLight,
              borderRadius: 8, border: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: 12, color: C.text }}>{item.label}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: item.color,
                backgroundColor: `${item.color}15`, borderRadius: 6, padding: '2px 8px',
              }}>{item.estado}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}