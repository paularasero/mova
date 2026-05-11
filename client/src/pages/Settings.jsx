import { Link } from 'react-router-dom';
import { FiBell, FiChevronRight, FiGlobe, FiHelpCircle, FiLock, FiLogOut, FiMapPin, FiUser } from 'react-icons/fi';
import { clearCurrentUser, getCurrentUser } from '../lib/auth';

const items = [
  { label: 'Editar perfil', icon: FiUser },
  { label: 'Notificaciones', icon: FiBell },
  { label: 'Privacidad', icon: FiLock },
  { label: 'Ciudad', value: 'Montevideo', icon: FiMapPin },
  { label: 'Idioma', value: 'Español', icon: FiGlobe },
  { label: 'Centro de ayuda', icon: FiHelpCircle },
];

export default function Settings() {
  const user = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    window.location.href = '/login';
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/48">{user?.nombre || 'MOVA'}</p>
            <h1 className="text-2xl font-bold tracking-[-0.01em]">Ajustes</h1>
          </div>
          <Link to="/profile" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/70">Perfil</Link>
        </header>

        <div className="mt-7 space-y-3">
          {items.map((item) => (
            <button key={item.label} className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.055] px-4 py-4 text-left">
              <item.icon className="text-[#C8FF3D]" />
              <span className="flex-1 text-sm font-semibold">{item.label}</span>
              {item.value && <span className="text-xs text-white/42">{item.value}</span>}
              <FiChevronRight className="text-white/34" />
            </button>
          ))}
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl border border-red-400/10 bg-red-500/8 px-4 py-4 text-left text-[#ff7777]">
            <FiLogOut />
            <span className="text-sm font-semibold">Cerrar sesión</span>
          </button>
        </div>
      </section>
    </main>
  );
}
