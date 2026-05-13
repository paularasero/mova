import { motion } from 'framer-motion';
import { FiArrowLeft, FiBell, FiBookmark, FiMapPin, FiMessageCircle, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const notifications = [
  { icon: FiUsers, title: 'Juan empezó a seguirte', text: 'También guarda planes de música y rambla.', time: 'Hace 2 min', color: '#FF8A3D' },
  { icon: FiBookmark, title: 'Martina guardó tu plan', text: 'Fogata en la playa empezó a moverse.', time: 'Hace 4 min', color: '#FF74C8' },
  { icon: FiUsers, title: '5 personas se sumaron', text: 'Tu plan de esta noche tiene nuevo grupo.', time: 'Hace 18 min', color: '#85B96B' },
  { icon: FiMessageCircle, title: 'Sofía comentó tu experiencia', text: '“Me encanta, voy con una amiga.”', time: 'Hace 1 h', color: '#67C8FF' },
  { icon: FiMapPin, title: 'Nuevo evento cerca tuyo', text: 'Hay música en vivo a menos de 2 km.', time: 'Hoy', color: '#FFD84D' },
];

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <main className="mova-screen">
      <section className="mova-mobile relative overflow-hidden px-5 pb-28 pt-8">
        <div className="pointer-events-none absolute -right-14 top-20 h-40 w-40 rounded-[2rem] bg-[#FF74C8]/14 blur-xl" />
        <div className="pointer-events-none absolute -left-14 bottom-24 h-44 w-44 rounded-full bg-[#67C8FF]/10 blur-xl" />
        <button onClick={() => navigate(-1)} aria-label="Volver" className="relative z-10 mb-6 grid h-10 w-10 place-items-center rounded-[0.65rem] border border-white/10 bg-white/[0.06] text-white/82">
          <FiArrowLeft />
        </button>
        <header className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/42">MOVA</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[0.005em]">Notificaciones</h1>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-[0.7rem] bg-[#FF8A3D] text-[#0B0B0F]">
            <FiBell />
          </div>
        </header>

        <div className="relative z-10 mt-8 space-y-3">
          {notifications.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 rounded-[1rem] border border-white/10 bg-white/[0.055] p-4"
              >
                <div style={{ backgroundColor: item.color }} className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.75rem] text-[#0B0B0F]">
                  <Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold leading-tight">{item.title}</p>
                    <span className="shrink-0 text-[11px] text-white/38">{item.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-white/52">{item.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
