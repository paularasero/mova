import { useEffect, useState } from 'react';
import { FiMenu, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const tabs = ['Creados', 'Guardados', 'Asistidos'];
const fallbackVibes = ['jazz', 'sunsets', 'cafeterías', 'cine', 'outdoor'];
const fallbackAvatar = 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MOVA-Play&backgroundColor=ff74c8,67c8ff,ffd84d';

export default function Profile() {
  const current = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('Creados');

  useEffect(() => {
    apiRequest(`/users/me/profile?userId=${current?.id}`).then(setProfile).catch(() => setProfile(null));
  }, [current?.id]);

  const user = profile?.user || current;
  const created = profile?.created || [];
  const saved = profile?.saved || [];
  const stats = profile?.stats || {};
  const list = tab === 'Creados' ? created : tab === 'Guardados' ? saved : [];
  const points = stats.points || user?.puntos || 0;
  const vibes = user?.preferences?.favoriteCategories?.length ? user.preferences.favoriteCategories : fallbackVibes;

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-32 pt-7">
        <header className="flex items-center justify-between">
          <span className="h-11 w-11" />
          <p className="text-sm font-semibold text-[var(--mova-muted)]">Perfil</p>
          <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07]"><FiMenu /></Link>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-[1.25rem] bg-white/[0.045] px-5 pb-6 pt-7 text-center ring-1 ring-white/10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FF8A3D]/20 blur-xl" />
          <div className="pointer-events-none absolute -left-10 bottom-8 h-28 w-28 rounded-[1.5rem] bg-[#67C8FF]/12 blur-lg" />
          <div className="mova-organic relative mx-auto grid h-32 w-32 place-items-center overflow-hidden bg-[#FF8A3D] p-1 shadow-[0_12px_0_rgba(133,185,107,.16)] ring-2 ring-[#FFD84D]/70 ring-offset-4 ring-offset-[#111117]">
            <img src={user?.avatar || fallbackAvatar} alt="" className="h-full w-full rounded-[38%_62%_46%_54%] object-cover bg-[#67C8FF]" />
          </div>
          <h1 className="relative mt-5 text-3xl font-semibold">{user?.nombre || user?.name || 'Paula'}</h1>
          <p className="mt-1 text-sm text-[var(--mova-muted)]">@{user?.username || 'movauser'}</p>
          <div className="mova-sticker mx-auto mt-3 inline-flex -rotate-1 items-center gap-2 rounded-[0.7rem] bg-[#FFD84D] px-4 py-2 text-xs font-black">
            <FiStar /> Urban Explorer · Nivel {Math.max(1, Math.floor(points / 500) + 1)}
          </div>
          <button className="mt-4 rounded-[0.8rem] border border-white/12 bg-white/10 px-5 py-2 text-sm font-black">Editar perfil</button>
        </section>

        <section className="mova-playful-card mt-7 grid grid-cols-3 py-4 text-center">
          <div><p className="text-xl font-bold">{created.length}</p><p className="text-xs text-[var(--mova-muted)]">Planes</p></div>
          <div><p className="text-xl font-bold">{stats.followers || user?.followersCount || user?.seguidores || 0}</p><p className="text-xs text-[var(--mova-muted)]">Seguidores</p></div>
          <div><p className="text-xl font-bold">{stats.following || user?.followingCount || user?.siguiendo || 0}</p><p className="text-xs text-[var(--mova-muted)]">Seguidos</p></div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Vibes</h2>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe, index) => <span key={vibe} className={`rounded-[0.75rem] px-4 py-2 text-xs font-black text-[#0B0B0F] ${index % 4 === 0 ? 'bg-[#85B96B]' : index % 4 === 1 ? 'bg-[#67C8FF]' : index % 4 === 2 ? 'bg-[#FF8A3D]' : 'bg-[#9D7BFF]'}`}>{vibe}</span>)}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Highlights</h2>
          <div className="grid grid-cols-3 gap-2">
            {(saved.slice(0, 3).length ? saved.slice(0, 3) : created.slice(0, 3)).map((item) => (
              <article key={item.id} className="h-24 overflow-hidden rounded-[0.9rem] bg-white/[0.06]">
                <img src={item.image || item.imagen} alt="" className="h-full w-full object-cover" />
              </article>
            ))}
            {saved.length + created.length === 0 && ['Música', 'Sunset', 'Café'].map((item, index) => (
              <article key={item} className={`grid h-24 place-items-center rounded-[0.9rem] text-xs font-black text-[#0B0B0F] ${index === 0 ? 'bg-[#FF8A3D]' : index === 1 ? 'bg-[#67C8FF]' : 'bg-[#85B96B]'}`}>{item}</article>
            ))}
          </div>
        </section>

        <section className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {[
            ['Puntos', points],
            ['Creados', created.length],
            ['Guardados', saved.length],
            ['Asistidos', 0],
          ].map(([label, value]) => (
            <article key={label} className="mova-playful-card min-w-32 p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--mova-muted)]">{label}</p>
            </article>
          ))}
        </section>

        <div className="mt-6 flex gap-2">
          {tabs.map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-[1rem] px-4 py-2 text-xs font-black ${tab === item ? 'bg-[#85B96B] text-[#0B0B0F]' : 'bg-white/[0.07] text-[var(--mova-muted)]'}`}>{item}</button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {list.map((experience) => <PlanCard key={experience.id} plan={experience} compact />)}
        </div>
        {tab === 'Asistidos' && <p className="mt-6 rounded-2xl bg-white/[0.06] px-4 py-4 text-sm text-[var(--mova-muted)]">Tus planes asistidos van a aparecer acá.</p>}
        {tab !== 'Asistidos' && list.length === 0 && <p className="mt-6 rounded-2xl bg-white/[0.06] px-4 py-4 text-sm text-[var(--mova-muted)]">No hay contenido para mostrar.</p>}
      </section>
    </main>
  );
}
