import { useEffect, useState } from 'react';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const tabs = ['Quiero ir', 'Fui', 'Favoritos'];

export default function Saved() {
  const user = getCurrentUser();
  const [active, setActive] = useState('Quiero ir');
  const [saved, setSaved] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    apiRequest(`/users/me/saved?userId=${user?.id}`)
      .then((data) => {
        setSaved(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [user?.id]);

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-7">
        <h1 className="text-2xl font-bold">Guardadas</h1>
        <div className="mt-5 flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActive(tab)} className={`rounded-full px-4 py-2 text-xs font-semibold ${active === tab ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/[0.07] text-white/62'}`}>{tab}</button>
          ))}
        </div>
        {status === 'error' && <p className="mt-6 text-sm text-[#ff8f8f]">No pudimos cargar tus guardadas.</p>}
        {status === 'ready' && saved.length === 0 && <p className="mt-6 text-sm text-white/52">Todavía no guardaste experiencias.</p>}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {saved.map((experience) => <PlanCard key={experience.id} plan={experience} compact />)}
        </div>
      </section>
    </main>
  );
}
