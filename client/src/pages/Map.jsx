import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiBookmark, FiMapPin, FiSliders } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';

const pinPositions = [
  ['22%', '34%'], ['62%', '28%'], ['78%', '44%'], ['46%', '54%'], ['28%', '66%'], ['68%', '72%'],
];

export default function Map() {
  const [experiences, setExperiences] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    apiRequest('/experiences').then((data) => {
      setExperiences(data);
      setSelected(data[0]);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#050505] pb-28">
        <div className="absolute inset-0 opacity-55" style={{ backgroundImage: 'linear-gradient(30deg, #111 12%, transparent 12.5%, transparent 87%, #111 87.5%, #111), linear-gradient(150deg, #111 12%, transparent 12.5%, transparent 87%, #111 87.5%, #111), linear-gradient(30deg, #111 12%, transparent 12.5%, transparent 87%, #111 87.5%, #111), linear-gradient(150deg, #111 12%, transparent 12.5%, transparent 87%, #111 87.5%, #111)', backgroundSize: '80px 140px', backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px' }} />
        <header className="relative z-10 flex items-center justify-between px-5 pt-7">
          <div>
            <p className="text-sm font-semibold">Montevideo</p>
            <h1 className="text-2xl font-bold">Mapa</h1>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08]"><FiSliders /></button>
        </header>

        {experiences.slice(0, 6).map((experience, index) => (
          <button key={experience.id} onClick={() => setSelected(experience)} className="absolute z-10 grid h-12 w-12 place-items-center rounded-full bg-[#C8FF3D]/18 text-[#C8FF3D]" style={{ left: pinPositions[index][0], top: pinPositions[index][1] }}>
            <FiMapPin fill="currentColor" />
          </button>
        ))}

        {selected && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-24 left-5 right-5 z-20 rounded-[1.4rem] border border-white/10 bg-[#111]/92 p-3 backdrop-blur-xl">
            <Link to={`/plan/${selected.id}`} className="flex gap-3">
              <img src={selected.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">{selected.title}</h2>
                <p className="mt-1 text-xs text-white/52">{selected.neighborhood} · 2.3 km</p>
                <p className="mt-2 text-xs text-[#C8FF3D]">★ {selected.rating || 4.8}</p>
              </div>
              <FiBookmark className="text-[#C8FF3D]" />
            </Link>
          </motion.div>
        )}
      </section>
    </main>
  );
}
