import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBell, FiMapPin, FiSliders } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const categories = ['Night', 'Food', 'Chill', 'Rooftops', 'Art', 'Aire libre'];

function normalizeCategory(value = '') {
  const lower = value.toLowerCase();
  if (lower.includes('cine') || lower.includes('cultural')) return 'Art';
  if (lower.includes('aire')) return 'Aire libre';
  if (lower.includes('comida') || lower.includes('food')) return 'Food';
  if (lower.includes('noche') || lower.includes('night') || lower.includes('música')) return 'Night';
  return value;
}

export default function Home() {
  const user = getCurrentUser();
  const [experiences, setExperiences] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Night');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    apiRequest('/experiences')
      .then((data) => {
        setExperiences(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const featured = experiences[0];
  const filtered = useMemo(() => {
    const byCategory = experiences.filter((item) => normalizeCategory(item.category || item.categoria) === activeCategory);
    return byCategory.length ? byCategory : experiences;
  }, [experiences, activeCategory]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-7">
        <header className="flex items-start justify-between">
          <div>
            <button className="flex items-center gap-1 text-sm font-semibold text-white/72">
              Montevideo <FiMapPin className="text-[#C8FF3D]" />
            </button>
            <h1 className="mt-5 text-xl font-semibold tracking-[-0.01em]">
              Buenas noches, {user?.nombre?.split(' ')[0] || 'Paula'} 👋
            </h1>
          </div>
          <Link to="/activity" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06]">
            <FiBell />
          </Link>
        </header>

        {status === 'loading' && <p className="mt-8 text-sm text-white/55">Cargando experiencias...</p>}
        {status === 'error' && <p className="mt-8 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}

        {featured && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <Link to={`/plan/${featured.id}`} className="group relative block h-64 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.06]">
              <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/18 to-black/88" />
              <div className="absolute bottom-0 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8FF3D]">Destacada</p>
                <h2 className="max-w-[13rem] text-3xl font-bold leading-[1.02] tracking-[-0.02em]">
                  {featured.title || featured.titulo}
                </h2>
                <p className="mt-2 text-sm text-white/72">{featured.time || featured.horario} · {featured.neighborhood || featured.barrio}</p>
                <span className="mt-4 inline-flex rounded-full bg-white/14 px-4 py-2 text-sm font-semibold backdrop-blur-xl">Ver experiencia</span>
              </div>
            </Link>
          </motion.section>
        )}

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/82">Explorá por categoría</h2>
            <FiSliders className="text-white/45" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold tracking-[-0.01em]">Para vos</h2>
          <div className="grid grid-cols-2 gap-3">
            {filtered.slice(0, 4).map((experience) => (
              <PlanCard key={experience.id} plan={experience} compact />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
