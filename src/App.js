import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Comercios from './pages/Comercios';
import Tecnicos from './pages/Tecnicos';
import Pedidos from './pages/Pedidos';
import Usuarios from './pages/Usuarios';
import Categorias from './pages/Categorias';
import Reportes from './pages/Reportes';
import Asistente from './pages/Asistente';
import { useState } from 'react';
const C = {
  base: '#07080F',
  card: '#0E1020',
  cardLight: '#151828',
  cyan: '#00E5FF',
  violet: '#A855F7',
  acid: '#AAFF00',
  text: '#F0F4FF',
  muted: '#6B7599',
  border: 'rgba(100,200,255,0.08)',
  borderBright: 'rgba(100,200,255,0.15)',
  success: '#00E5A0',
  error: '#FF4567',
};

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '▪', emoji: '📊' },
  { path: '/comercios', label: 'Comercios', icon: '▪', emoji: '🏪' },
  { path: '/trabajadores', label: 'Choferes y Técnicos', icon: '▪', emoji: '👷' },  { path: '/pedidos', label: 'Pedidos', icon: '▪', emoji: '📦' },
  { path: '/usuarios', label: 'Usuarios', icon: '▪', emoji: '👥' },
  { path: '/categorias', label: 'Categorías', icon: '▪', emoji: '🏷️' },
  { path: '/reportes', label: 'Reportes', icon: '▪', emoji: '💰' },
  { path: '/asistente', label: 'Dely IA', icon: '▪', emoji: '🤖' },
];

function Sidebar() {
  const location = useLocation();
  return (
    <div style={{
      width: 240,
      minHeight: '100vh',
      backgroundColor: C.card,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900, color: '#fff',
        }}>D</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: '-0.3px' }}>
            Dely <span style={{ color: C.cyan }}>Nea</span>
          </div>
          <div style={{ fontSize: 9, color: C.muted, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: '16px 16px 6px' }}>
        <div style={{ fontSize: 9, color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
          Navegación
        </div>
      </div>

      {/* Menu items */}
      <nav style={{ padding: '0 8px', flex: 1 }}>
        {menuItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                backgroundColor: active ? `rgba(168,85,247,0.12)` : 'transparent',
                border: `1px solid ${active ? 'rgba(168,85,247,0.25)' : 'transparent'}`,
                color: active ? C.violet : C.muted,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 15 }}>{item.emoji}</span>
                <span>{item.label}</span>
                {active && (
                  <div style={{
                    marginLeft: 'auto',
                    width: 6, height: 6,
                    borderRadius: '50%',
                    backgroundColor: C.violet,
                  }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: C.border, margin: '0 16px' }} />

      {/* Bottom section */}
      <div style={{ padding: 16 }}>
        <div style={{
          backgroundColor: C.cardLight,
          borderRadius: 10,
          padding: '10px 12px',
          border: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>F</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Franco Enzo</div>
            <div style={{ fontSize: 10, color: C.muted }}>Administrador</div>
          </div>
          <div style={{ fontSize: 14, color: C.muted, cursor: 'pointer' }}>⚙️</div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  const location = useLocation();
  const current = menuItems.find(m => m.path === location.pathname);
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 240, right: 0,
      height: 56,
      backgroundColor: `${C.base}EE`,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 99,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: C.muted }}>Dely Nea</span>
        <span style={{ fontSize: 11, color: C.muted }}>/</span>
        <span style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>{current?.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          fontSize: 11, fontWeight: 600,
          color: C.success,
          backgroundColor: `${C.success}15`,
          border: `1px solid ${C.success}33`,
          borderRadius: 20,
          padding: '4px 12px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.success }} />
          Sistema online
        </div>
        <div style={{
          fontSize: 11, color: C.muted,
          backgroundColor: C.cardLight,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: '4px 12px',
        }}>
          Gran Resistencia
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', backgroundColor: C.base, minHeight: '100vh', fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.violet}; border-radius: 2px; }
        a:hover > div { background-color: rgba(168,85,247,0.06) !important; }
        button:hover { opacity: 0.85; }
        input:focus { border-color: ${C.violet} !important; outline: none; }
      `}</style>
      <Sidebar />
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ marginTop: 56, padding: 28, color: C.text, flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

const ADMIN_PASSWORD = 'Budin1183JKanime2'; // Cambiá esto

function LoginAdmin({ onLogin }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem('dely_admin', 'true');
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: C.base,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        backgroundColor: C.card, borderRadius: 20, padding: 40,
        border: `1px solid ${C.border}`, width: '100%', maxWidth: 380,
        textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 900, color: '#fff',
          margin: '0 auto 20px',
        }}>D</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>
          Dely <span style={{ color: C.cyan }}>Nea</span>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 28, letterSpacing: 2 }}>
          PANEL ADMINISTRADOR
        </div>
        <input
          type="password"
          placeholder="Contraseña de administrador"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%', backgroundColor: C.cardLight,
            border: `1px solid ${error ? C.error : C.border}`,
            borderRadius: 12, padding: '12px 16px',
            fontSize: 14, color: C.text, outline: 'none',
            marginBottom: 12, boxSizing: 'border-box',
          }}
        />
        {error && (
          <div style={{ fontSize: 12, color: C.error, marginBottom: 10 }}>
            ❌ Contraseña incorrecta
          </div>
        )}
        <button onClick={handleLogin} style={{
          width: '100%', background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
          color: '#fff', border: 'none', borderRadius: 12,
          padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>Ingresar al panel →</button>
      </div>
    </div>
  );
}

export default function App() {
  const [logueado, setLogueado] = useState(
    localStorage.getItem('dely_admin') === 'true'
  );

  if (!logueado) {
    return <LoginAdmin onLogin={() => setLogueado(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/comercios" element={<Layout><Comercios /></Layout>} />
        <Route path="/trabajadores" element={<Layout><Tecnicos /></Layout>} />        <Route path="/pedidos" element={<Layout><Pedidos /></Layout>} />
        <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
        <Route path="/categorias" element={<Layout><Categorias /></Layout>} />
        <Route path="/reportes" element={<Layout><Reportes /></Layout>} />
        <Route path="/asistente" element={<Layout><Asistente /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}