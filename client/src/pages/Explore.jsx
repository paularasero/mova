import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const popular = ['bar', 'amigos', 'cena', 'playa', 'música', 'gratis', 'noche', 'arte', 'chill', 'pareja', 'café', 'aire libre'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Outdoor'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia'];
const budgets = ['$', '$$', '$$$'];

function ResultCard({ item, onSave }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }}>
      <Link to={`/plan/${item.id}`} className="flex gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-3">
        <img src={item.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight">{item.title}</h3>
            <button onClick={(event) => { event.preventDefault(); onSave(item.id); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[#C8FF3D]"><FiBookmark /></button>
          </div>
          <p className="mt-1 text-xs text-white/45">{item.neighborhood}, {item.city}</p>
          <div className="mt-3 flex gap-2 text-[11px] text-white/52"><span>{item.category}</span><span>★ {item.rating || 4.8}</span><span>{item.price}</span></div>
        </div>
      </Link>
    </motion.div>
  );
}

function FilterSheet({ open, onClose, filters, setFilters }) {
  const set = (field, value) => setFilters((prev) => ({ ...prev, [field]: prev[field] === value ? '' : value }));
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" aria-label="Cerrar filtros" />
          <motion.div initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[2rem] border border-white/10 bg-[#0b0b0b] p-5 pb-8 text-white">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/18" />
            <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Filtros</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button></div>
            <label className="mt-5 block text-sm font-semibold text-white/68">Ciudad</label>
            <select value={filters.city} onChange={(event) => setFilters((prev) => ({ ...prev, city: event.target.value }))} className="mt-2 w-full rounded-2xl bg-white/[0.07] px-4 py-3 text-sm outline-none">{cities.map((city) => <option key={city}>{city}</option>)}</select>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <input type="date" value={filters.date} onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))} className="rounded-2xl bg-white/[0.07] px-4 py-3 text-sm outline-none" />
              <input type="range" min="1" max="20" value={filters.distance} onChange={(event) => setFilters((prev) => ({ ...prev, distance: event.target.value }))} className="accent-[#C8FF3D]" />
            </div>
            {[
              ['Categoría', 'category', categories],
              ['Compañía', 'company', companies],
              ['Presupuesto', 'budget', budgets],
            ].map(([title, field, items]) => (
              <div key={title} className="mt-5">
                <p className="mb-2 text-sm font-semibold text-white/68">{title}</p>
                <div className="flex flex-wrap gap-2">{items.map((item) => <button key={item} onClick={() => set(field, item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${filters[field] === item ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/68'}`}>{item}</button>)}</div>
              </div>
            ))}
            <button onClick={onClose} className="mt-6 h-14 w-full rounded-full bg-[#C8FF3D] font-bold text-black">Aplicar</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Explore() {
  const user = getCurrentUser();
  const [experiences, setExperiences] = useState([]);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(['playa', 'bar', 'sunset']);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [filters, setFilters] = useState({ city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', distance: 8 });

  useEffect(() => {
    apiRequest('/experiences').then((data) => { setExperiences(data); setStatus('ready'); }).catch(() => setStatus('error'));
  }, []);

  const results = useMemo(() => experiences.filter((item) => {
    const text = `${item.title} ${item.description} ${item.neighborhood} ${item.category} ${(item.tags || []).join(' ')}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (!filters.city || item.city === filters.city)
      && (!filters.category || String(item.category).toLowerCase().includes(filters.category.toLowerCase()))
      && (!filters.company || item.company === filters.company)
      && (!filters.budget || item.price === filters.budget)
      && (!filters.date || item.date === filters.date);
  }), [experiences, query, filters]);

  const applyChip = (chip) => {
    setQuery(chip);
    setRecent((prev) => [chip, ...prev.filter((item) => item !== chip)].slice(0, 5));
  };
  const saveExperience = async (id) => {
    if (!user?.id) return;
    await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <div><p className="text-sm text-white/48">MOVA Search</p><h1 className="text-3xl font-semibold tracking-[0.005em]">Buscar experiencias</h1></div>
          <button onClick={() => setFiltersOpen(true)} className="grid h-12 w-12 place-items-center rounded-full bg-white/[0.08] text-xl"><FiSliders /></button>
        </header>
        <label className="mt-6 flex h-14 items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-4">
          <FiSearch className="text-white/45" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar experiencias" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
        </label>

        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-white/72">Búsquedas populares</h2>
          <div className="flex flex-wrap gap-2">{popular.map((chip) => <button key={chip} onClick={() => applyChip(chip)} className={`rounded-full px-4 py-2 text-xs font-semibold ${query === chip ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/70'}`}>{chip}</button>)}</div>
        </section>
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-white/72">Recientes</h2>
          <div className="flex gap-2 overflow-x-auto">{recent.map((item) => <button key={item} onClick={() => applyChip(item)} className="shrink-0 rounded-full bg-white/[0.06] px-4 py-2 text-xs text-white/58">{item}</button>)}</div>
        </section>

        {status === 'error' && <p className="mt-6 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}
        <div className="mt-7 space-y-3">
          <h2 className="text-lg font-semibold">{query ? 'Resultados' : 'Recomendados'}</h2>
          {results.map((item) => <ResultCard key={item.id} item={item} onSave={saveExperience} />)}
        </div>
        {status === 'ready' && results.length === 0 && <p className="mt-8 text-sm text-white/50">No encontramos experiencias con esos filtros.</p>}
      </section>
      <FilterSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} />
    </main>
  );
}
