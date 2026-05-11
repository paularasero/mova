import { motion } from 'framer-motion';
import { FiBell, FiHeart, FiMessageCircle, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';

const activity = [
  { icon: FiHeart, title: 'Martina guardó tu experiencia', detail: 'Jazz en Ciudad Vieja', time: 'Hace 2 min' },
  { icon: FiMessageCircle, title: 'Tomás comentó tu experiencia', detail: 'Atardecer en la Rambla', time: 'Hace 1 h' },
  { icon: FiStar, title: 'Tu experiencia recibió 12 likes', detail: 'Café en Pocitos', time: 'Hace 5 h' },
  { icon: FiBell, title: 'Sofía empezó a seguirte', detail: 'Nueva conexión urbana', time: 'Hace 8 h' },
];

export default function Activity() {
  const user = getCurrentUser();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/48">{user?.nombre || 'MOVA'}</p>
            <h1 className="text-2xl font-semibold tracking-[0.01em]">Actividad</h1>
          </div>
          <button className="rounded-full bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/62">Todas</button>
        </header>

        <div className="mt-7 space-y-3">
          {activity.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.055] p-4"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#C8FF3D]/14 text-[#C8FF3D]">
                <item.icon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                <p className="mt-1 text-xs text-white/50">{item.detail}</p>
                <p className="mt-2 text-[11px] text-white/34">{item.time}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <Link to="/home" className="mt-6 block rounded-full bg-[#C8FF3D] py-3 text-center text-sm font-semibold text-black">
          Volver a explorar
        </Link>
      </section>
    </main>
  );
}
