import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiBookmark, FiMapPin, FiNavigation, FiSearch, FiSliders } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const fallbackPins = [
  ['20%', '34%'], ['58%', '25%'], ['78%', '43%'], ['42%', '55%'], ['25%', '68%'], ['70%', '72%'], ['52%', '40%'], ['34%', '24%'],
];

function pinPosition(item, index) {
  if (item.lat && item.lng) {
    const left = 18 + Math.abs((item.lng + 56.22) * 420) % 62;
    const top = 22 + Math.abs((item.lat + 34.94) * 520) % 52;
    return [`${left}%`, `${top}%`];
  }
  return fallbackPins[index % fallbackPins.length];
}

export default function Map() {
  const user = getCurrentUser();
  const [experiences, setExperiences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest('/experiences').then((data) => {
      setExperiences(data);
      setSelected(data[0]);
    });
  }, []);

  const save = async (id) => {
    if (!user?.id) return;
    const data = await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
    setMessage(data.message);
  };

  return (
    <main className="mova-screen">
      <section className="relative mova-mobile pb-28">
        <div className="absolute inset-0 bg-[#090909]" />
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(30deg,#1b1b1b 12%,transparent 12.5%,transparent 87%,#1b1b1b 87.5%,#1b1b1b),linear-gradient(150deg,#161616 12%,transparent 12.5%,transparent 87%,#161616 87.5%,#161616),linear-gradient(90deg,rgba(200,255,61,.12) 1px,transparent 1px)', backgroundSize: '88px 150px,88px 150px,54px 54px', backgroundPosition: '0 0, 0 0, 0 0' }} />
        <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black via-black/70 to-transparent" />

        <header className="relative z-10 flex items-center justify-between px-5 pt-7">
          <Link to="/home" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08] text-xl"><FiArrowLeft /></Link>
          <div>
            <p className="text-sm text-white/50">Mapa MOVA</p>
            <h1 className="text-3xl font-semibold">Planes cerca</h1>
          </div>
          <button className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.08] text-xl"><FiSliders /></button>
        </header>
        <div className="relative z-10 mx-5 mt-4 flex h-12 items-center gap-3 rounded-full bg-white/[0.08] px-4 text-sm">
          <FiSearch className="text-[#C8FF3D]" />
          <input placeholder="Buscar en el mapa" className="w-full bg-transparent outline-none placeholder:text-white/40" />
        </div>
        <div className="relative z-10 mx-5 mt-3 flex gap-2 overflow-x-auto">
          {['Todos', 'Night', 'Food', 'Chill', 'Outdoor'].map((chip) => <button key={chip} className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-semibold">{chip}</button>)}
        </div>

        {experiences.map((experience, index) => {
          const [left, top] = pinPosition(experience, index);
          const active = selected?.id === experience.id;
          return (
            <motion.button
              key={experience.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => setSelected(experience)}
              className={`absolute z-10 grid h-12 w-12 place-items-center rounded-full ${active ? 'bg-[#C8FF3D] text-black' : 'bg-[#C8FF3D]/18 text-[#C8FF3D]'} shadow-[0_0_32px_rgba(200,255,61,0.24)]`}
              style={{ left, top }}
            >
              <FiMapPin fill="currentColor" />
            </motion.button>
          );
        })}

        {selected && (
          <motion.div key={selected.id} initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-24 left-4 right-4 z-20 rounded-[1.6rem] border border-white/10 bg-[#111]/94 p-3 backdrop-blur-2xl">
            <div className="flex gap-3">
              <Link to={`/plan/${selected.id}`} className="flex min-w-0 flex-1 gap-3">
                <img src={selected.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold leading-tight">{selected.title}</h2>
                  <p className="mt-1 text-xs text-white/48">{selected.location || selected.neighborhood}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/55"><span>{selected.category}</span><span>2.3 km</span><span>★ {selected.rating || 4.8}</span></div>
                  <span className="mt-3 inline-flex rounded-full bg-[#C8FF3D] px-3 py-1.5 text-xs font-bold text-black">Ver más</span>
                </div>
              </Link>
              <button onClick={() => save(selected.id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#C8FF3D]/12 text-[#C8FF3D]"><FiBookmark /></button>
            </div>
            {message && <p className="mt-3 text-xs font-semibold text-[#D9FF73]">{message}</p>}
            <section className="mt-4 border-t border-white/8 pt-4">
              <h3 className="mb-3 text-sm font-semibold">Planes cerca de ti</h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {experiences.slice(0, 6).map((item) => <button key={item.id} onClick={() => setSelected(item)} className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl"><img src={item.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/78" /><span className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold leading-tight">{item.title}</span></button>)}
              </div>
            </section>
          </motion.div>
        )}

        <div className="absolute left-5 top-28 z-10 rounded-full bg-white/[0.08] px-3 py-2 text-xs text-white/60 backdrop-blur-xl">
          <FiNavigation className="mr-1 inline text-[#C8FF3D]" /> {experiences.length} puntos activos
        </div>
      </section>
    </main>
  );
}
