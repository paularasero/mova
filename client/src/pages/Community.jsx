import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiBell, FiHeart, FiMessageCircle, FiUserPlus } from 'react-icons/fi';

const tabs = ['Actividad', 'Mensajes', 'Seguidores'];
const avatars = [
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Martina&backgroundColor=c8ff3d',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Juan&backgroundColor=38bdf8',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Sofia&backgroundColor=fb7185',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Lucas&backgroundColor=facc15',
];
const items = [
  { tab: 'Seguidores', icon: FiUserPlus, title: 'Martina empezó a seguirte', detail: 'Le gustan los planes de noche', avatar: avatars[0], time: '2 min' },
  { tab: 'Mensajes', icon: FiMessageCircle, title: 'Juan te mandó un mensaje', detail: '“Vamos a la fogata?”', avatar: avatars[1], time: '8 min' },
  { tab: 'Actividad', icon: FiBell, title: 'Sofía comentó tu plan', detail: '“Me encantó la data”', avatar: avatars[2], time: '25 min' },
  { tab: 'Actividad', icon: FiHeart, title: 'Tu experiencia recibió 12 guardados', detail: 'Fogata en la playa', avatar: avatars[3], time: '1 h' },
  { tab: 'Actividad', icon: FiBell, title: 'Lucas quiere ir a Café en Ciudad Vieja', detail: 'También está en tus guardados', avatar: avatars[3], time: '3 h' },
];

export default function Community() {
  const [active, setActive] = useState('Actividad');
  const filtered = items.filter((item) => active === 'Actividad' ? item.tab === 'Actividad' : item.tab === active);

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-8">
        <header>
          <p className="text-sm mova-muted">MOVA social</p>
          <h1 className="text-3xl font-semibold tracking-[0.005em]">Community</h1>
        </header>
        <div className="mt-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === tab ? 'bg-[#C8FF3D] text-black' : 'mova-card mova-muted'}`}>{tab}</button>)}
        </div>
        <div className="mt-6 space-y-3">
          {filtered.map((item, index) => (
            <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="mova-card flex gap-3 rounded-[1.5rem] p-4">
              <img src={item.avatar} alt="" className="h-12 w-12 rounded-full bg-[#C8FF3D]/20 object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-snug">{item.title}</p>
                  <item.icon className="shrink-0 text-[#8ab500]" />
                </div>
                <p className="mt-1 text-sm mova-muted">{item.detail}</p>
                <p className="mt-2 text-xs mova-muted">{item.time}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
