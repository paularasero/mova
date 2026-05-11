import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiBell, FiChevronRight, FiGlobe, FiHelpCircle, FiLock, FiLogOut, FiMapPin, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { apiRequest } from '../lib/api';
import { clearCurrentUser, getCurrentUser, setCurrentUser } from '../lib/auth';
import { applyTheme, getTheme } from '../lib/theme';

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
  const [theme, setTheme] = useState(getTheme());

  const handleLogout = () => {
    clearCurrentUser();
    window.location.href = '/login';
  };

  const changeTheme = async (nextTheme) => {
    const applied = applyTheme(nextTheme);
    setTheme(applied);
    if (!user?.id) return;
    try {
      const updated = await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          userId: user.id,
          preferences: { ...(user.preferences || {}), theme: applied },
        }),
      });
      setCurrentUser(updated);
    } catch {
      // La preferencia local queda guardada aunque falle la red.
    }
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm mova-muted">{user?.nombre || 'MOVA'}</p>
            <h1 className="text-2xl font-bold tracking-[-0.01em]">Ajustes</h1>
          </div>
          <Link to="/profile" className="mova-card rounded-full px-4 py-2 text-sm font-semibold">Perfil</Link>
        </header>

        <section className="mova-card mt-7 rounded-[1.4rem] p-4">
          <p className="text-sm font-semibold">Tema de la app</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => changeTheme('light')} className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${theme === 'light' ? 'bg-[#C8FF3D] text-black' : 'mova-card mova-muted'}`}><FiSun /> Modo claro</button>
            <button onClick={() => changeTheme('dark')} className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold ${theme === 'dark' ? 'bg-[#C8FF3D] text-black' : 'mova-card mova-muted'}`}><FiMoon /> Modo oscuro</button>
          </div>
        </section>

        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <button key={item.label} className="mova-card flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left">
              <item.icon className="text-[#C8FF3D]" />
              <span className="flex-1 text-sm font-semibold">{item.label}</span>
              {item.value && <span className="text-xs mova-muted">{item.value}</span>}
              <FiChevronRight className="mova-muted" />
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
