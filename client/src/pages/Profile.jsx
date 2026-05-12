import { useEffect, useState } from 'react';
import { FiEdit3, FiMenu, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const tabs = ['Creados', 'Guardados', 'Asistidos'];
const fallbackVibes = ['jazz', 'sunsets', 'cafeterías', 'cine', 'outdoor'];

export default function Profile() {
  const current = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('Publicadas');

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
          <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07]"><FiEdit3 /></Link>
          <p className="text-sm font-semibold text-[var(--mova-muted)]">Perfil</p>
          <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07]"><FiMenu /></Link>
        </header>

        <section className="mt-8 text-center">
          <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-white/[0.08] ring-2 ring-[var(--mova-accent)] ring-offset-4 ring-offset-[var(--mova-bg)]">
            <img src={user?.avatar} alt="" className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold">{user?.nombre || user?.name || 'Paula'}</h1>
          <p className="mt-1 text-sm text-[var(--mova-muted)]">@{user?.username || 'movauser'}</p>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--mova-accent-soft)] px-4 py-2 text-xs font-bold text-[var(--mova-accent)]">
            <FiStar /> Urban Explorer · Nivel {Math.max(1, Math.floor(points / 500) + 1)}
          </div>
          <button className="mt-4 rounded-full border border-[var(--mova-border)] bg-[var(--mova-card)] px-5 py-2 text-sm font-semibold">Editar perfil</button>
        </section>

        <section className="mt-7 grid grid-cols-3 rounded-[1.6rem] border border-[var(--mova-border)] bg-[var(--mova-card)] py-4 text-center">
          <div><p className="text-xl font-bold">{created.length}</p><p className="text-xs text-[var(--mova-muted)]">Planes</p></div>
          <div><p className="text-xl font-bold">{stats.followers || user?.followersCount || user?.seguidores || 0}</p><p className="text-xs text-[var(--mova-muted)]">Seguidores</p></div>
          <div><p className="text-xl font-bold">{stats.following || user?.followingCount || user?.siguiendo || 0}</p><p className="text-xs text-[var(--mova-muted)]">Seguidos</p></div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Vibes</h2>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe) => <span key={vibe} className="rounded-full bg-[var(--mova-accent-soft)] px-4 py-2 text-xs font-semibold text-[var(--mova-accent)]">{vibe}</span>)}
          </div>
        </section>

        <section className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {[
            ['Puntos', points],
            ['Creados', created.length],
            ['Guardados', saved.length],
            ['Asistidos', 0],
          ].map(([label, value]) => (
            <article key={label} className="min-w-32 rounded-[1.35rem] border border-[var(--mova-border)] bg-[var(--mova-card)] p-4">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--mova-muted)]">{label}</p>
            </article>
          ))}
        </section>

        <div className="mt-6 flex gap-2">
          {tabs.map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === item ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/[0.07] text-[var(--mova-muted)]'}`}>{item}</button>
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
