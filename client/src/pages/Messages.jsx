import { motion } from 'framer-motion';
import { FiEdit3, FiSearch } from 'react-icons/fi';

const conversations = [
  { name: 'Martina', text: 'Te paso el sunset del sábado?', time: '2m', unread: 1, avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MartinaMova&backgroundColor=ff74c8' },
  { name: 'Amigos', text: 'Sofi: Buen plan, me copo', time: '10m', unread: 3, avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=AmigosMova&backgroundColor=7dff72' },
  { name: 'Tomás', text: 'Dale perfecto!', time: '1h', unread: 0, avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=TomasMova&backgroundColor=67c8ff' },
  { name: 'Juana', text: 'Jajaja buena data', time: '2h', unread: 0, avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JuanaMova&backgroundColor=ffd84d' },
];

export default function Messages() {
  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/48">MOVA social</p>
            <h1 className="text-2xl font-semibold tracking-[0.01em]">Mensajes</h1>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-[0.75rem] bg-[var(--mova-accent)] text-[#0B0B0F]">
            <FiEdit3 />
          </button>
        </header>

        <label className="mt-7 flex items-center gap-3 rounded-[0.9rem] border border-white/8 bg-white/[0.07] px-4 py-3 text-white/55">
          <FiSearch />
          <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Buscar" />
        </label>

        <div className="mt-5 space-y-3">
          {conversations.map((chat, index) => (
            <motion.article
              key={chat.name}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 rounded-[1rem] bg-white/[0.055] p-3"
            >
              <img src={chat.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{chat.name}</p>
                  <span className="text-xs text-white/38">{chat.time}</span>
                </div>
                <p className="mt-1 truncate text-sm text-white/48">{chat.text}</p>
              </div>
              {chat.unread > 0 && (
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--mova-accent)] px-2 text-xs font-bold text-white">
                  {chat.unread}
                </span>
              )}
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
