import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus, FiSearch, FiSend, FiUserPlus } from 'react-icons/fi';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const demoPeople = [
  { id: 'demo-martina', name: 'Martina', username: 'martu', city: 'Montevideo', vibe: 'jazz', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MartinaSocial&backgroundColor=fd7407' },
  { id: 'demo-juan', name: 'Juan', username: 'juanplan', city: 'Montevideo', vibe: 'outdoor', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JuanSocial&backgroundColor=0869d0' },
  { id: 'demo-sofia', name: 'Sofía', username: 'sofiafilms', city: 'Montevideo', vibe: 'cine', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=SofiaSocial&backgroundColor=f9a809' },
  { id: 'demo-lucas', name: 'Lucas', username: 'lucasnight', city: 'Montevideo', vibe: 'night', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=LucasSocial&backgroundColor=04533e' },
  { id: 'demo-ana', name: 'Ana', username: 'ana.cafe', city: 'Montevideo', vibe: 'cafés', avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=AnaSocial&backgroundColor=fb97b3' },
];

const demoConversations = [
  {
    id: 'chat-rooftop',
    name: 'Martina',
    avatar: demoPeople[0].avatar,
    vibe: 'rooftop',
    preview: '¿Van hoy al rooftop?',
    time: '2m',
    unread: 2,
    messages: [
      { from: 'Martina', text: '¿Van hoy al rooftop?', time: '20:14' },
      { from: 'Yo', text: 'Estoy viendo si llego después de cenar', time: '20:16' },
      { from: 'Martina', text: 'Hay lugar todavía?', time: '20:18' },
    ],
  },
  {
    id: 'chat-rambla',
    name: 'Juan',
    avatar: demoPeople[1].avatar,
    vibe: 'rambla',
    preview: 'Nos vemos en la rambla',
    time: '18m',
    unread: 0,
    messages: [
      { from: 'Juan', text: 'Nos vemos en la rambla', time: '19:42' },
      { from: 'Yo', text: 'Dale, llevo mate', time: '19:44' },
    ],
  },
  {
    id: 'chat-cartas',
    name: 'Sofía',
    avatar: demoPeople[2].avatar,
    vibe: 'cine',
    preview: 'Yo llevo cartas',
    time: '1h',
    unread: 1,
    messages: [
      { from: 'Sofía', text: 'Yo llevo cartas', time: '18:05' },
      { from: 'Sofía', text: 'Y después podemos caer al cine al aire libre', time: '18:06' },
    ],
  },
  {
    id: 'chat-grupo',
    name: 'Grupo Fogata',
    avatar: demoPeople[3].avatar,
    vibe: 'outdoor',
    preview: '¿Alguien lleva parlante?',
    time: '3h',
    unread: 0,
    messages: [
      { from: 'Lucas', text: '¿Alguien lleva parlante?', time: '16:31' },
      { from: 'Yo', text: 'Yo puedo llevar uno chico', time: '16:35' },
      { from: 'Ana', text: 'Perfecto, yo llevo algo para picar', time: '16:38' },
    ],
  },
];

function normalizeUser(user) {
  const name = user.name || user.nombre || 'Usuario MOVA';
  const seed = `${name}-${user.id || user.email || 'mova'}`;
  return {
    id: user.id,
    name,
    username: user.username || name.toLowerCase().split(' ')[0],
    city: user.city || user.ciudad || 'Montevideo',
    vibe: user.preferences?.favoriteCategories?.[0] || 'planes',
    avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=fd7407,f9a809,fb97b3,0869d0,04533e`,
  };
}

function Suggestion({ person, following, onFollow }) {
  const isDemo = String(person.id).startsWith('demo-');
  return (
    <motion.article whileTap={{ scale: 0.98 }} className="w-24 shrink-0 text-center">
      <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-[1rem] bg-white/[0.06] ring-1 ring-white/10">
        <img src={person.avatar} alt="" className="h-full w-full object-cover" />
        <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-[0.45rem] bg-white text-[10px] font-black text-[#111215]">+</span>
      </div>
      <p className="mt-2 truncate text-sm font-semibold">{person.name}</p>
      <p className="truncate text-[11px] text-white/42">{person.vibe}</p>
      {!isDemo && (
        <button onClick={() => onFollow(person.id)} className={`mt-2 rounded-[0.16rem] px-2 py-1 text-[10px] font-black ${following.includes(person.id) ? 'bg-white text-[#111215]' : 'bg-white/[0.08] text-white/60'}`}>
          {following.includes(person.id) ? 'Siguiendo' : 'Seguir'}
        </button>
      )}
    </motion.article>
  );
}

function ChatRow({ chat, onOpen }) {
  return (
    <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.99 }} onClick={() => onOpen(chat)} className="flex h-20 w-full items-center gap-3 overflow-hidden rounded-[0.35rem] bg-white/[0.045] p-3 text-left ring-1 ring-white/8">
      <img src={chat.avatar} alt="" style={{ width: 52, height: 52 }} className="shrink-0 rounded-[0.25rem] object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-semibold">{chat.name}</p>
          <span className="shrink-0 text-[11px] text-white/38">{chat.time}</span>
        </div>
        <p className="mt-1 truncate text-sm text-white/48">{chat.preview}</p>
      </div>
      {chat.unread > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-[0.16rem] bg-[#FB97B3] px-2 text-xs font-black text-[#111215]">{chat.unread}</span>}
    </motion.button>
  );
}

function ChatView({ chat, onBack }) {
  const [messages, setMessages] = useState(chat.messages);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setMessages(chat.messages);
    setDraft('');
  }, [chat]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { from: 'Yo', text: draft.trim(), time: 'Ahora' }]);
    setDraft('');
  };

  return (
    <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} className="flex min-h-[calc(100vh-9rem)] flex-col">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="grid h-10 w-10 place-items-center rounded-[0.7rem] border border-white/10 bg-white/[0.06]"><FiArrowLeft /></button>
        <img src={chat.avatar} alt="" className="h-11 w-11 rounded-[0.85rem] object-cover" />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">{chat.name}</h1>
          <p className="text-xs text-white/42">{chat.vibe}</p>
        </div>
      </header>

      <div className="mt-7 flex-1 space-y-3 pb-28">
        {messages.map((message, index) => {
          const mine = message.from === 'Yo';
          return (
            <motion.div key={`${message.text}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] rounded-[1rem] px-4 py-3 ${mine ? 'bg-white text-[#111215]' : 'bg-white/[0.07] text-white'}`}>
                {!mine && <p className="mb-1 text-[11px] font-semibold text-white/42">{message.from}</p>}
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`mt-1 text-[10px] ${mine ? 'text-black/42' : 'text-white/34'}`}>{message.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="fixed bottom-24 left-1/2 z-30 flex w-[92%] max-w-[398px] -translate-x-1/2 gap-2 rounded-[1rem] border border-white/10 bg-[#111215]/94 p-2 backdrop-blur-xl">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') send(); }} placeholder="Escribir mensaje" className="h-11 flex-1 rounded-[0.75rem] bg-white/[0.06] px-4 text-sm outline-none placeholder:text-white/34" />
        <button onClick={send} className="grid h-11 w-11 place-items-center rounded-[0.75rem] bg-[#FB97B3] text-[#111215]"><FiSend /></button>
      </div>
    </motion.section>
  );
}

export default function Community() {
  const current = getCurrentUser();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState(demoConversations);
  const [following, setFollowing] = useState(current?.following || []);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    apiRequest(`/users/search?q=${encodeURIComponent(query)}`)
      .then((data) => setUsers(data.filter((user) => user.id !== current?.id).map(normalizeUser)))
      .catch(() => setUsers([]));
  }, [query, current?.id]);

  useEffect(() => {
    apiRequest('/conversations')
      .then((data) => setConversations(data.length ? data : demoConversations))
      .catch(() => setConversations(demoConversations));
  }, []);

  const people = useMemo(() => {
    const combined = [...users, ...demoPeople];
    const unique = combined.filter((person, index) => combined.findIndex((item) => item.id === person.id) === index);
    const text = query.toLowerCase();
    return unique.filter((person) => `${person.name} ${person.username} ${person.vibe} ${person.city}`.toLowerCase().includes(text)).slice(0, 10);
  }, [users, query]);

  const chats = useMemo(() => conversations.filter((chat) => `${chat.name} ${chat.preview} ${chat.vibe}`.toLowerCase().includes(query.toLowerCase())), [conversations, query]);

  const toggleFollow = async (targetId) => {
    const data = await apiRequest(`/users/${targetId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ userId: current?.id }),
    });
    setFollowing(data.user.following || []);
    setCurrentUser(data.user);
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile relative overflow-hidden px-5 pb-32 pt-8">
        <div className="pointer-events-none absolute -right-14 top-16 h-40 w-40 rounded-[2rem] bg-[#FB97B3]/12 blur-xl" />
        <div className="pointer-events-none absolute -left-16 bottom-32 h-48 w-48 rounded-full bg-[#0869D0]/8 blur-xl" />

        <AnimatePresence mode="wait">
          {activeChat ? (
            <ChatView key={activeChat.id} chat={activeChat} onBack={() => setActiveChat(null)} />
          ) : (
            <motion.div key="social-list" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <header className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/42">Comunidad</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-[0.005em]">Hola, {current?.nombre?.split(' ')[0] || 'Pau'}</h1>
                </div>
              </header>

              <label className="relative z-10 mt-7 flex h-14 items-center gap-3 rounded-[0.95rem] border border-white/10 bg-white/[0.055] px-4 text-white/52">
                <FiSearch />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar personas o chats" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34" />
              </label>

              <section className="relative z-10 mt-7">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Personas cerca</h2>
                    <p className="text-xs text-white/42">Gente con gustos parecidos</p>
                  </div>
                  <FiUserPlus className="text-white/38" />
                </div>
                <div className="mova-scrollbar-none flex gap-4 overflow-x-auto pb-2">
                  {people.map((person) => <Suggestion key={person.id} person={person} following={following} onFollow={toggleFollow} />)}
                </div>
              </section>

              <section className="relative z-10 mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Chats</h2>
                  <button className="grid h-9 w-9 place-items-center rounded-[0.65rem] border border-white/10 bg-white/[0.055] text-white/62"><FiPlus /></button>
                </div>
                <div className="space-y-3">
                  {chats.map((chat) => <ChatRow key={chat.id} chat={chat} onOpen={setActiveChat} />)}
                </div>
                {chats.length === 0 && <p className="rounded-[1rem] border border-white/10 bg-white/[0.045] p-4 text-sm text-white/48">No encontramos chats con esa búsqueda.</p>}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
