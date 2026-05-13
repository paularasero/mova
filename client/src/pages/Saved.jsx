import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiBookmark, FiCalendar, FiCheck, FiMapPin, FiUsers } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const tabs = ['Guardados', 'Me sumé'];

function imageOf(item) {
  return item?.image || item?.imagen || item?.images?.[0] || '';
}

function titleOf(item) {
  return item?.title || item?.titulo || 'Plan MOVA';
}

function neighborhoodOf(item) {
  return item?.neighborhood || item?.barrio || item?.location || 'Montevideo';
}

function interestedOf(item) {
  return item?.interestedCount ?? item?.joinedUsers?.length ?? item?.saves ?? 0;
}

function SavedItem({ item, stateLabel }) {
  return (
    <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.055]">
      <Link to={`/plan/${item.id}`} className="flex gap-3 p-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[0.85rem] bg-white/[0.06]">
          {imageOf(item) && <img src={imageOf(item)} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1 py-0.5 text-left">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-[0.45rem] bg-[#0869D0]/16 px-2 py-1 text-[10px] font-black text-[#0869D0]">{stateLabel}</span>
            <span className="text-[11px] text-white/38">{item.category || 'Plan'}</span>
          </div>
          <h2 className="line-clamp-2 text-base font-semibold leading-tight">{titleOf(item)}</h2>
          <div className="mt-2 grid gap-1 text-[11px] text-white/52">
            <span className="inline-flex items-center gap-1"><FiMapPin /> {neighborhoodOf(item)}</span>
            <span className="inline-flex items-center gap-1"><FiCalendar /> {item.date || item.fecha || 'Próximamente'} · {item.time || item.horario || 'A confirmar'}</span>
            <span className="inline-flex items-center gap-1 text-[#FB97B3]"><FiUsers /> {interestedOf(item)} personas</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Saved() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [active, setActive] = useState('Guardados');
  const [saved, setSaved] = useState([]);
  const [joined, setJoined] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    Promise.all([
      apiRequest(`/users/me/saved?userId=${user?.id}`),
      apiRequest('/experiences'),
    ])
      .then(([savedData, allExperiences]) => {
        setSaved(savedData);
        setJoined(allExperiences.filter((experience) => experience.joinedUsers?.some((id) => String(id) === String(user?.id))));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [user?.id]);

  const visible = useMemo(() => (active === 'Guardados' ? saved : joined), [active, saved, joined]);

  return (
    <main className="mova-screen">
      <section className="mova-mobile relative overflow-hidden px-5 pb-28 pt-8">
        <div className="pointer-events-none absolute -right-12 top-20 h-40 w-40 rounded-[2rem] bg-[#0869D0]/14 blur-xl" />
        <button onClick={() => navigate(-1)} aria-label="Volver" className="relative z-10 mb-6 grid h-10 w-10 place-items-center rounded-[0.65rem] border border-white/10 bg-white/[0.06] text-white/82">
          <FiArrowLeft />
        </button>
        <header className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/42">Tus planes</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[0.005em]">Guardados</h1>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-[0.7rem] bg-[#F9A809] text-[#111215]">
            <FiBookmark />
          </div>
        </header>

        <div className="relative z-10 mt-6 grid grid-cols-2 gap-2 rounded-[0.9rem] border border-white/10 bg-white/[0.045] p-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActive(tab)} className={`h-10 rounded-[0.7rem] text-sm font-bold ${active === tab ? 'bg-white text-[#111215]' : 'text-white/58'}`}>{tab}</button>
          ))}
        </div>

        {status === 'error' && <p className="relative z-10 mt-6 rounded-[0.8rem] bg-red-500/10 px-4 py-3 text-sm text-[#FB97B3]">No pudimos cargar tus planes.</p>}
        {status === 'ready' && visible.length === 0 && (
          <div className="relative z-10 mt-8 rounded-[1rem] border border-white/10 bg-white/[0.05] p-5">
            <div className="grid h-12 w-12 place-items-center rounded-[0.8rem] bg-[#FB97B3] text-[#111215]"><FiCheck /></div>
            <h2 className="mt-5 text-xl font-semibold">{active === 'Guardados' ? 'Todavía no guardaste planes' : 'Todavía no te sumaste'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/52">Cuando encuentres algo que te mueva, va a aparecer acá.</p>
          </div>
        )}

        <div className="relative z-10 mt-6 space-y-3">
          {visible.map((experience) => <SavedItem key={experience.id} item={experience} stateLabel={active === 'Guardados' ? 'Guardado' : 'Te sumaste'} />)}
        </div>
      </section>
    </main>
  );
}
