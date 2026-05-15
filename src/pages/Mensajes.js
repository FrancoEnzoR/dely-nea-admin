/* eslint-disable no-unused-vars */
import { useState } from 'react';

const C = {
  base: '#07080F', card: '#0E1020', cardLight: '#151828',
  cyan: '#00E5FF', violet: '#A855F7', acid: '#AAFF00',
  text: '#F0F4FF', muted: '#6B7599', border: 'rgba(100,200,255,0.08)',
  success: '#00E5A0', error: '#FF4567', warning: '#FFB800',
};

const CHATS_DEMO = [
  {
    id: '1',
    tipo: 'soporte',
    cliente: 'Fran Test',
    email: 'fran@delynea.com',
    pedido_id: '4821abc',
    comercio: 'La Leñera Pizzas',
    ultimo_mensaje: 'Hola, me faltaron 2 empanadas en el pedido',
    hora: 'hace 5 min',
    leido: false,
    mensajes: [
      { id: '1', contenido: 'Hola, me faltaron 2 empanadas en el pedido', emisor_tipo: 'cliente', hora: '19:45' },
      { id: '2', contenido: '¡Hola! ¿En qué te puedo ayudar?', emisor_tipo: 'soporte', hora: '19:46' },
      { id: '3', contenido: 'Pedí empanadas x6 pero solo llegaron 4', emisor_tipo: 'cliente', hora: '19:47' },
    ],
  },
  {
    id: '2',
    tipo: 'soporte',
    cliente: 'María López',
    email: 'maria@test.com',
    pedido_id: '4822def',
    comercio: 'Farmacia del Sol',
    ultimo_mensaje: 'El pedido llegó tarde, más de 1 hora',
    hora: 'hace 20 min',
    leido: false,
    mensajes: [
      { id: '1', contenido: 'El pedido llegó tarde, más de 1 hora', emisor_tipo: 'cliente', hora: '19:20' },
      { id: '2', contenido: 'Lamentamos el inconveniente. ¿Podés contarme más?', emisor_tipo: 'soporte', hora: '19:21' },
    ],
  },
  {
    id: '3',
    tipo: 'comercio_admin',
    cliente: 'La Leñera Pizzas',
    email: 'lalenera@test.com',
    pedido_id: null,
    comercio: 'La Leñera Pizzas',
    ultimo_mensaje: '¿Cuándo nos aprueban la cuenta?',
    hora: 'hace 1 hora',
    leido: true,
    mensajes: [
      { id: '1', contenido: '¿Cuándo nos aprueban la cuenta?', emisor_tipo: 'comercio', hora: '18:45' },
      { id: '2', contenido: 'Estamos revisando tu documentación. En 24hs te confirmamos.', emisor_tipo: 'admin', hora: '18:50' },
    ],
  },
];

export default function Mensajes() {
  const [chats, setChats] = useState(CHATS_DEMO);
  const [chatActivo, setChatActivo] = useState(null);
  const [input, setInput] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const chatsFiltrados = chats.filter(c => {
    if (filtro === 'todos') return true;
    if (filtro === 'soporte') return c.tipo === 'soporte';
    if (filtro === 'comercios') return c.tipo === 'comercio_admin';
    if (filtro === 'noLeidos') return !c.leido;
    return true;
  });

  const noLeidos = chats.filter(c => !c.leido).length;

  const abrirChat = (chat) => {
    setChatActivo(chat);
    setChats(chats.map(c => c.id === chat.id ? { ...c, leido: true } : c));
  };

  const enviarMensaje = () => {
    if (!input.trim() || !chatActivo) return;
    const nuevoMensaje = {
      id: Date.now().toString(),
      contenido: input,
      emisor_tipo: 'admin',
      hora: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };
    const chatsActualizados = chats.map(c =>
      c.id === chatActivo.id
        ? { ...c, mensajes: [...c.mensajes, nuevoMensaje], ultimo_mensaje: input, hora: 'ahora' }
        : c
    );
    setChats(chatsActualizados);
    setChatActivo({ ...chatActivo, mensajes: [...chatActivo.mensajes, nuevoMensaje] });
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            Mensajes 💬
          </h1>
          {noLeidos > 0 && (
            <div style={{ backgroundColor: C.error, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {noLeidos} nuevo{noLeidos > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <p style={{ color: C.muted, marginTop: 4, fontSize: 13 }}>
          Chats de soporte y comunicación con comercios
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>

        {/* Lista de chats */}
        <div style={{ width: 320, flexShrink: 0, backgroundColor: C.card, borderRadius: 14, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'noLeidos', label: `No leídos (${noLeidos})` },
              { key: 'soporte', label: '🛡️ Soporte' },
              { key: 'comercios', label: '🏪 Comercios' },
            ].map(f => (
              <button key={f.key} onClick={() => setFiltro(f.key)} style={{
                backgroundColor: filtro === f.key ? C.violet : C.cardLight,
                color: filtro === f.key ? '#fff' : C.muted,
                border: `1px solid ${filtro === f.key ? C.violet : C.border}`,
                borderRadius: 20, padding: '4px 10px', fontSize: 11,
                fontWeight: filtro === f.key ? 700 : 400, cursor: 'pointer',
              }}>{f.label}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatsFiltrados.map(chat => (
              <div
                key={chat.id}
                onClick={() => abrirChat(chat)}
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  borderBottom: `1px solid ${C.border}`,
                  backgroundColor: chatActivo?.id === chat.id ? `${C.violet}15` : !chat.leido ? `${C.cyan}06` : 'transparent',
                  borderLeft: chatActivo?.id === chat.id ? `3px solid ${C.violet}` : !chat.leido ? `3px solid ${C.cyan}` : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${chat.tipo === 'soporte' ? C.error : C.violet}, ${C.cyan})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  }}>
                    {chat.tipo === 'soporte' ? '🛡️' : '🏪'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {chat.cliente}
                      </div>
                      <div style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>{chat.hora}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.tipo === 'soporte' ? `📦 Pedido #${chat.pedido_id?.slice(-6).toUpperCase()}` : `🏪 ${chat.comercio}`}
                    </div>
                    <div style={{ fontSize: 12, color: !chat.leido ? C.text : C.muted, fontWeight: !chat.leido ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {chat.ultimo_mensaje}
                    </div>
                  </div>
                  {!chat.leido && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.cyan, flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de chat */}
        <div style={{ flex: 1, backgroundColor: C.card, borderRadius: 14, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {chatActivo ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${chatActivo.tipo === 'soporte' ? C.error : C.violet}, ${C.cyan})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>
                  {chatActivo.tipo === 'soporte' ? '🛡️' : '🏪'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{chatActivo.cliente}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>
                    {chatActivo.tipo === 'soporte'
                      ? `Reclamo · Pedido #${chatActivo.pedido_id?.slice(-6).toUpperCase()} · ${chatActivo.comercio}`
                      : `Comercio · ${chatActivo.email}`}
                  </div>
                </div>
                <a href={`mailto:${chatActivo.email}`} style={{
                  backgroundColor: `${C.cyan}18`, color: C.cyan,
                  border: `1px solid ${C.cyan}44`, borderRadius: 8,
                  padding: '6px 12px', fontSize: 11, fontWeight: 700, textDecoration: 'none',
                }}>✉️ Email</a>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {chatActivo.mensajes.map(m => {
                  const esPropio = m.emisor_tipo === 'admin';
                  return (
                    <div key={m.id} style={{ display: 'flex', justifyContent: esPropio ? 'flex-end' : 'flex-start', gap: 8 }}>
                      {!esPropio && (
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                          background: `linear-gradient(135deg, ${C.error}, ${C.violet})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                        }}>
                          {m.emisor_tipo === 'cliente' ? '👤' : '🏪'}
                        </div>
                      )}
                      <div style={{
                        maxWidth: '65%',
                        backgroundColor: esPropio ? C.violet : C.cardLight,
                        borderRadius: esPropio ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                        padding: '10px 14px',
                        border: `1px solid ${esPropio ? C.violet + '55' : C.border}`,
                      }}>
                        <div style={{ fontSize: 13, color: esPropio ? '#fff' : C.text, lineHeight: 1.5 }}>
                          {m.contenido}
                        </div>
                        <div style={{ fontSize: 10, color: esPropio ? 'rgba(255,255,255,0.6)' : C.muted, marginTop: 4, textAlign: 'right' }}>
                          {m.hora}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && enviarMensaje()}
                  placeholder="Escribí tu respuesta..."
                  style={{
                    flex: 1, backgroundColor: C.cardLight,
                    border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: '10px 14px', fontSize: 13, color: C.text, outline: 'none',
                  }}
                />
                <button onClick={enviarMensaje} style={{
                  background: `linear-gradient(135deg, ${C.violet}, ${C.cyan})`,
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>Enviar →</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 48 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Seleccioná un chat</div>
              <div style={{ fontSize: 13, color: C.muted }}>Elegí una conversación de la lista</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}