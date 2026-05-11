import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';

const dates = ['Hoy', 'Mañana', 'Fin de semana'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const categories = ['Música', 'Comida', 'Noche', 'Arte', 'Cultura', 'Aire libre', 'Chill'];

export default function Explore() {
  const [experiences, setExperiences] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    apiRequest('/experiences')
      .then((data) => {
        setExperiences(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const results = useMemo(() => {
    return experiences.filter((item) => {
      const text = `${item.title} ${item.description} ${item.neighborhood} ${item.category}`.toLowerCase();
      const matchesText = !query || text.includes(query.toLowerCase());
      const matchesCategory = !category || String(item.category || '').toLowerCase().includes(category.toLowerCase());
      const matchesCompany = !company || String(item.company || '').toLowerCase() === company.toLowerCase();
      const matchesDate = !dateFilter || dateFilter === 'Hoy' || dateFilter === 'Mañana' || dateFilter === 'Fin de semana';
      return matchesText && matchesCategory && matchesCompany && matchesDate;
    });
  }, [experiences, query, category, company, dateFilter]);

  const Chip = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${active ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/68'}`}>
      {label}
    </button>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-7">
        <h1 className="text-2xl font-bold tracking-[-0.01em]">Buscar planes</h1>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
          <FiSearch className="text-white/45" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por barrio, música, comida..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/34" />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex gap-2 overflow-x-auto"><Chip label="Todas" active={!dateFilter} onClick={() => setDateFilter('')} />{dates.map((item) => <Chip key={item} label={item} active={dateFilter === item} onClick={() => setDateFilter(item)} />)}</div>
          <div className="flex gap-2 overflow-x-auto"><Chip label="Todos" active={!company} onClick={() => setCompany('')} />{companies.map((item) => <Chip key={item} label={item} active={company === item} onClick={() => setCompany(item)} />)}</div>
          <div className="flex gap-2 overflow-x-auto"><Chip label="Todo" active={!category} onClick={() => setCategory('')} />{categories.map((item) => <Chip key={item} label={item} active={category === item} onClick={() => setCategory(item)} />)}</div>
        </div>

        {status === 'error' && <p className="mt-6 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid grid-cols-2 gap-3">
          {results.map((experience) => <PlanCard key={experience.id} plan={experience} compact />)}
        </motion.div>
        {status === 'ready' && results.length === 0 && <p className="mt-8 text-sm text-white/50">No encontramos experiencias con esos filtros.</p>}
      </section>
    </main>
  );
}
