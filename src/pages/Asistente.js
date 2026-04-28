/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';

const API = 'https://dely-nea-backend.onrender.com';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const sugerencias = [
  "¿Cómo van las ventas?",
  "¿Hay actividad sospechosa?",
  "¿Qué comercio rinde mejor?",
  "¿Qué recomendás para crecer?",
  "¿Cuál es la proyección mensual?",
  "Analizá los repartidores",
];

export default function Asistente() {
  const [mensajes, setMensajes] = useState([
    {
      rol: 'asistente',
      texto: '¡Hola Franco! 👋 Soy Dely, tu asistente de inteligencia artificial para Dely Nea.\n\nPuedo ayudarte con:\n📊 Análisis financiero y contable\n🏪 Estudio de comercios y rendimiento\n🏍️ Análisis de repartidores\n👥 Comportamiento de clientes\n🔒 Alertas de seguridad\n💡 Recomendaciones de negocio\n\n¿En qué te puedo ayudar hoy?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/admin/stats`).then(r => r.json()).then(s => setStats(s));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = async (texto) => {
    const pregunta = texto || input;
    if (!pregunta.trim()) return;

    setMensajes(prev => [...prev, { rol: 'usuario', texto: pregunta }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API}/dely`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta }),
      });
      const data = await response.json();
      const respuesta = data.respuesta || 'No pude procesar la respuesta.';
      setMensajes(prev => [...prev, { rol: 'asistente', texto: respuesta }]);
    } catch (error) {
      setMensajes(prev => [...prev, {
        rol: 'asistente',
        texto: '❌ Error al conectar. Verificá tu conexión a internet.',
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            Dely IA 🤖
          </h1>
          <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
            Tu asistente inteligente de Dely Nea
          </p>
        </div>
        <div style={{
          backgroundColor: `${C.success}15`, border: `1px solid ${C.success}33`,
          borderRadius: 20, padding: '6px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: C.success, fontWeight: 600,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.success }} />
          Dely activa
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Usuarios', value: stats?.usuarios || 0, color: C.cyan },
          { label: 'Comercios', value: stats?.comercios || 0, color: C.violet },
          { label: 'Pedidos', value: stats?.pedidos || 0, color: C.acid },
          { label: 'Comisiones', value: `$${(stats?.comisiones || 0).toLocaleString()}`, color: C.success },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: C.card, borderRadius: 10, padding: '7px 14px',
            border: `1px solid ${s.color}22`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 11, color: C.muted }}>{s.label}:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{
        flex: 1, backgroundColor: C.card, borderRadius: 14,
        border: `1px solid ${C.border}`, display: 'flex',
        flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mensajes.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.rol === 'usuario' ? 'flex-end' : 'flex-start' }}>
              {m.rol === 'asistente' && (
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, marginRight: 10, flexShrink: 0, marginTop: 2,
                }}>D</div>
              )}
              <div style={{
                maxWidth: '72%',
                backgroundColor: m.rol === 'usuario' ? C.violet : C.cardLight,
                borderRadius: m.rol === 'usuario' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                padding: '12px 16px', fontSize: 13, color: C.text,
                lineHeight: 1.7, whiteSpace: 'pre-wrap',
                border: `1px solid ${m.rol === 'usuario' ? C.violet + '55' : C.border}`,
              }}>
                {m.texto}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>D</div>
              <div style={{ backgroundColor: C.cardLight, borderRadius: '4px 18px 18px 18px', padding: '12px 16px', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: C.muted }}>Dely está analizando</span>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      backgroundColor: C.violet,
                      animation: `pulse 1s ease-in-out ${j * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '8px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: `1px solid ${C.border}` }}>
          {sugerencias.map((s, i) => (
            <button key={i} onClick={() => enviarMensaje(s)} style={{
              backgroundColor: C.cardLight, color: C.muted,
              border: `1px solid ${C.border}`, borderRadius: 20,
              padding: '5px 12px', fontSize: 11, cursor: 'pointer',
            }}>{s}</button>
          ))}
        </div>

        <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !loading && enviarMensaje()}
            placeholder="Preguntale algo a Dely..."
            style={{
              flex: 1, backgroundColor: C.cardLight,
              border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '10px 14px', fontSize: 13, color: C.text, outline: 'none',
            }}
          />
          <button onClick={() => enviarMensaje()} disabled={loading} style={{
            background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
            color: '#fff', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>Enviar →</button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}