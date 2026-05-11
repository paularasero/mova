import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiCamera, FiCoffee, FiStar } from 'react-icons/fi';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const achievements = [
  { label: 'Explorador', detail: '10 experiencias', icon: FiAward },
  { label: 'Fotógrafa', detail: 'Subí 20 fotos', icon: FiCamera },
  { label: 'Recomendador', detail: '5 reviews', icon: FiStar },
];

export default function Rewards() {
  const current = getCurrentUser();
  const [stats, setStats] = useState({ points: current?.puntos || 0, created: 0, saved: 0 });

  useEffect(() => {
    apiRequest(`/users/me/profile?userId=${current?.id}`)
      .then((profile) => setStats(profile.stats))
      .catch(() => setStats({ points: current?.puntos || 0, created: 0, saved: 0 }));
  }, [current?.id, current?.puntos]);

  const points = stats?.points || 0;
  const progress = Math.min(100, Math.round((points / 3000) * 100));

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/48">MOVA Points</p>
            <h1 className="text-2xl font-semibold tracking-[0.01em]">Recompensas</h1>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08] text-[#C8FF3D]"><FiStar /></span>
        </header>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-7 rounded-[1.7rem] border border-white/8 bg-white/[0.06] p-5">
          <p className="text-5xl font-semibold tracking-[0.02em]">{points.toLocaleString('es-UY')}</p>
          <p className="mt-1 text-sm text-white/45">Puntos disponibles</p>
          <div className="mt-5 rounded-2xl border border-white/8 bg-black/25 p-4">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-white/75">Nivel 12</span>
              <span className="text-white/42">Nivel 13</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full bg-[#C8FF3D]" />
            </div>
            <p className="mt-3 text-xs text-white/40">{Math.max(0, 3000 - points)} pts para el siguiente nivel</p>
          </div>
        </motion.section>

        <h2 className="mt-7 text-sm font-semibold">Logros</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {achievements.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/[0.055] p-3 text-center">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#C8FF3D]/13 text-[#C8FF3D]"><item.icon /></span>
              <p className="mt-3 text-xs font-semibold">{item.label}</p>
              <p className="mt-1 text-[10px] text-white/38">{item.detail}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-7 text-sm font-semibold">Canjeá tus puntos</h2>
        <button className="mt-3 flex w-full items-center gap-3 rounded-[1.4rem] border border-white/8 bg-white/[0.055] p-4 text-left">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C8FF3D]/14 text-[#C8FF3D]"><FiCoffee /></span>
          <span className="flex-1">
            <span className="block text-sm font-semibold">10% OFF en cafés</span>
            <span className="text-xs text-white/42">2.000 pts</span>
          </span>
          <span className="rounded-full bg-[#C8FF3D] px-3 py-2 text-xs font-bold text-black">Canjear</span>
        </button>
      </section>
    </main>
  );
}
