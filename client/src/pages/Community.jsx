import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBell, FiHeart, FiMessageCircle, FiSearch, FiSend, FiUserPlus } from 'react-icons/fi';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['Actividad', 'Mensajes'];
const avatars = [
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Martina&backgroundColor=c8ff3d',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Juan&backgroundColor=38bdf8',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Sofia&backgroundColor=fb7185',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Lucas&backgroundColor=facc15',
];
const activity = [
  { icon: FiUserPlus, title: 'Martina empezó a seguirte', detail: 'Le gustan los planes de noche', avatar: avatars[0], time: '2 min' },
  { icon: FiMessageCircle, title: 'Juan comentó tu plan', detail: '“Vamos a la fogata?”', avatar: avatars[1], time: '8 min' },
  { icon: FiHeart, title: 'Sofía guardó tu experiencia', detail: 'Jazz en azotea', avatar: avatars[2], time: '25 min' },
  { icon: FiBell, title: 'Tu experiencia recibió 12 likes', detail: 'Fogata en la playa', avatar: avatars[3], time: '1 h' },
];
const conversations = [
  { name: 'Martina', message: 'Te parece si vamos el sábado?', avatar: avatars[0], unread: 1 },
  { name: 'Juan', message: 'Dale, confirmo en un rato', avatar: avatars[1], unread: 0 },
  { name: 'Sofía', message: 'Ese rooftop está buenísimo', avatar: avatars[2], unread: 2 },
];

export default function Community() {
  const current = getCurrentUser();
  const [active, setActive] = useState('Actividad');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(current?.following || []);
  const [chat, setChat] = useState(conversations[0]);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([{ from: 'Martina', text: 'Te parece si vamos el sábado?' }]);

  useEffect(() => {
    if (active !== 'Actividad') return;
    apiRequest(`/users/search?q=${encodeURIComponent(query)}`)
      .then((data) => setUsers(data.filter((user) => user.id !== current?.id)))
      .catch(() => setUsers([]));
  }, [active, query, current?.id]);

  const visibleUsers = useMemo(() => users.filter((user) => `${user.name} ${user.username} ${user.city}`.toLowerCase().includes(query.toLowerCase())), [users, query]);

  const toggleFollow = async (targetId) => {
    const data = await apiRequest(`/users/${targetId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ userId: current?.id }),
    });
    setFollowing(data.user.following || []);
    setCurrentUser(data.user);
  };

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { from: 'Yo', text: draft.trim() }]);
    setDraft('');
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-32 pt-8">
        <header>
          <p className="text-sm text-[var(--mova-muted)]">MOVA social</p>
          <h1 className="text-3xl font-semibold tracking-[0.005em]">Actividad</h1>
        </header>
        <div className="mt-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === tab ? 'bg-[var(--mova-accent)] text-white' : 'mova-card text-[var(--mova-muted)]'}`}>{tab}</button>)}
        </div>

        {active === 'Actividad' && (
          <div className="mt-6 space-y-3">
            {activity.map((item, index) => (
              <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="mova-card flex gap-3 rounded-[1.5rem] p-4">
                <img src={item.avatar} alt="" className="h-12 w-12 rounded-full bg-[var(--mova-accent-soft)] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold leading-snug">{item.title}</p>
                    <item.icon className="shrink-0 text-[var(--mova-accent)]" />
                  </div>
                  <p className="mt-1 text-sm text-[var(--mova-muted)]">{item.detail}</p>
                  <p className="mt-2 text-xs text-[var(--mova-muted)]">{item.time}</p>
                </div>
              </motion.article>
            ))}
            <section className="pt-5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Personas para descubrir</h2>
                  <p className="text-xs text-[var(--mova-muted)]">Seguí gente con planes afines.</p>
                </div>
              </div>
              <label className="flex h-14 items-center gap-3 rounded-full border border-[var(--mova-border)] bg-[var(--mova-card)] px-4">
                <FiSearch className="text-[var(--mova-accent)]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar personas" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--mova-muted)]" />
              </label>
              <div className="mova-scrollbar-none mt-4 flex gap-3 overflow-x-auto pb-1">
                {visibleUsers.slice(0, 8).map((user) => {
                  const isFollowing = following.includes(user.id);
                  return (
                    <article key={user.id} className="min-w-40 rounded-[1.5rem] border border-[var(--mova-border)] bg-[var(--mova-card)] p-4 text-center">
                      <img src={user.avatar} alt="" className="mx-auto h-16 w-16 rounded-full bg-[var(--mova-accent-soft)] object-cover" />
                      <p className="mt-3 truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-[var(--mova-muted)]">@{user.username}</p>
                      <button onClick={() => toggleFollow(user.id)} className={`mt-3 rounded-full px-4 py-2 text-xs font-bold ${isFollowing ? 'bg-[var(--mova-surface)] text-[var(--mova-text)]' : 'bg-[var(--mova-accent)] text-white'}`}>
                        {isFollowing ? 'Siguiendo' : 'Seguir'}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {active === 'Mensajes' && (
          <section className="mt-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {conversations.map((conversation) => (
                <button key={conversation.name} onClick={() => setChat(conversation)} className={`min-w-36 rounded-[1.35rem] border p-3 text-left ${chat.name === conversation.name ? 'border-[var(--mova-accent)] bg-[var(--mova-accent-soft)]' : 'border-[var(--mova-border)] bg-[var(--mova-card)]'}`}>
                  <img src={conversation.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <p className="mt-2 text-sm font-semibold">{conversation.name}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-[var(--mova-muted)]">{conversation.message}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-[1.7rem] border border-[var(--mova-border)] bg-[var(--mova-card)] p-4">
              <h2 className="text-sm font-semibold">Chat con {chat.name}</h2>
              <div className="mt-4 space-y-2">
                {messages.map((message, index) => (
                  <p key={`${message.text}-${index}`} className={`max-w-[82%] rounded-2xl px-4 py-2 text-sm ${message.from === 'Yo' ? 'ml-auto bg-[var(--mova-accent)] text-white' : 'bg-white/[0.08]'}`}>{message.text}</p>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribir mensaje" className="h-11 flex-1 rounded-full bg-white/[0.07] px-4 text-sm outline-none" />
                <button onClick={sendMessage} className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mova-accent)] text-white"><FiSend /></button>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
