import { useEffect, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

export default function Profile() {
  const current = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('Guardadas');

  useEffect(() => {
    apiRequest(`/users/me/profile?userId=${current?.id}`).then(setProfile).catch(() => setProfile(null));
  }, [current?.id]);

  const user = profile?.user || current;
  const list = tab === 'Publicadas' ? profile?.created || [] : profile?.saved || [];

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={user?.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-[#C8FF3D]" />
            <div>
              <p className="text-sm font-semibold">{user?.nombre}</p>
              <p className="text-xs text-white/45">Urban Explorer</p>
            </div>
          </div>
          <Link to="/settings" className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.07]"><FiSettings /></Link>
        </header>

        <div className="mt-7 rounded-[1.6rem] bg-white/[0.06] p-5">
          <div className="flex items-center gap-4">
            <img src={user?.avatar} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-[#C8FF3D]" />
            <div>
              <h1 className="text-xl font-bold">{user?.nombre}</h1>
              <p className="text-sm text-white/52">@{user?.username}</p>
              <p className="mt-2 rounded-full bg-[#C8FF3D]/12 px-3 py-1 text-xs font-semibold text-[#D9FF73]">Urban Explorer</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 text-center">
            <div><p className="text-xl font-bold">{profile?.stats?.points || user?.puntos || 0}</p><p className="text-xs text-white/45">Puntos</p></div>
            <div><p className="text-xl font-bold">{profile?.stats?.created || 0}</p><p className="text-xs text-white/45">Creadas</p></div>
            <div><p className="text-xl font-bold">{profile?.stats?.saved || 0}</p><p className="text-xs text-white/45">Guardadas</p></div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          {['Guardadas', 'Publicadas', 'Reseñas'].map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === item ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/62'}`}>{item}</button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {list.map((experience) => <PlanCard key={experience.id} plan={experience} compact />)}
        </div>
        {list.length === 0 && <p className="mt-6 text-sm text-white/45">No hay contenido para mostrar.</p>}
      </section>
    </main>
  );
}
