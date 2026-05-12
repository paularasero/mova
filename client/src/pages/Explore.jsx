import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiCheck, FiSearch, FiSliders, FiUsers, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const popular = ['bar', 'amigos', 'cena', 'playa', 'música', 'gratis', 'noche', 'arte', 'chill', 'pareja', 'café', 'aire libre'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Rooftops', 'Outdoor'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia'];
const budgets = ['$', '$$', '$$$'];

function SearchCard({ item, saved, onSave, tall = false }) {
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }} className={`overflow-hidden rounded-[1.55rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_12px_30px_rgba(17,17,17,0.05)] ${tall ? 'row-span-2' : ''}`}>
      <div className={`photo-card relative overflow-hidden ${tall ? 'aspect-[0.78]' : 'aspect-[1.02]'}`}>
        <Link to={`/plan/${item.id}`} className="block h-full">
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/70" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white">{item.title}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-white/72">{item.neighborhood}</p>
          </div>
        </Link>
        <button onClick={() => onSave(item.id)} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur-xl ${saved ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/90 text-[var(--mova-accent)]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--mova-muted)]">
          <span className="truncate">{item.category}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[var(--mova-accent)]"><FiUsers /> {item.saves || item.guardados || 0}</span>
        </div>
        <button className="h-9 w-full rounded-full bg-[var(--mova-accent)] text-xs font-bold text-white">Me sumo</button>
      </div>
    </motion.article>
  );
}

function FilterModal({ open, onClose, filters, setFilters }) {
  const set = (field, value) => setFilters((prev) => ({ ...prev, [field]: prev[field] === value ? '' : value }));
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="mova-overlay" aria-label="Cerrar filtros" />
          <div className="mova-modal-wrap">
            <motion.div initial={{ scale: 0.94, y: 18, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 16, opacity: 0 }} className="mova-modal p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold">Filtros</h2>
                <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-[var(--mova-card)] text-xl"><FiX /></button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold text-[var(--mova-muted)]">Fecha<input type="date" value={filters.date} onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[var(--mova-border)] bg-[var(--mova-card)] px-3 py-3 text-sm text-[var(--mova-text)] outline-none" /></label>
                <label className="block text-sm font-semibold text-[var(--mova-muted)]">Horario<input type="time" value={filters.time} onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[var(--mova-border)] bg-[var(--mova-card)] px-3 py-3 text-sm text-[var(--mova-text)] outline-none" /></label>
              </div>
              <label className="mt-5 block text-sm font-semibold text-[var(--mova-muted)]">Ciudad</label>
              <select value={filters.city} onChange={(event) => setFilters((prev) => ({ ...prev, city: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[var(--mova-border)] bg-[var(--mova-card)] px-4 py-3 text-sm outline-none">{cities.map((city) => <option key={city}>{city}</option>)}</select>
              {[
                ['Categoría', 'category', categories],
                ['Compañía ideal', 'company', companies],
                ['Presupuesto', 'budget', budgets],
              ].map(([title, field, items]) => (
                <div key={title} className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-[var(--mova-muted)]">{title}</p>
                  <div className="flex flex-wrap gap-2">{items.map((item) => <button key={item} onClick={() => set(field, item)} className={`rounded-full px-4 py-2 text-xs font-semibold ${filters[field] === item ? 'bg-[var(--mova-accent)] text-white' : 'bg-[var(--mova-card)] text-[var(--mova-muted)]'}`}>{item}</button>)}</div>
                </div>
              ))}
              <label className="mt-6 block text-sm font-semibold text-[var(--mova-muted)]">Distancia: {filters.distance} km</label>
              <input type="range" min="1" max="20" value={filters.distance} onChange={(event) => setFilters((prev) => ({ ...prev, distance: event.target.value }))} className="mt-3 w-full accent-[var(--mova-accent)]" />
              <button onClick={onClose} className="mt-7 h-14 w-full rounded-full bg-[var(--mova-accent)] font-bold text-white">Aplicar filtros</button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Explore() {
  const user = getCurrentUser();
  const [experiences, setExperiences] = useState([]);
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [savedIds, setSavedIds] = useState(new Set(user?.savedExperiences || []));
  const [filters, setFilters] = useState({ city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', time: '', distance: 8 });

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
      && (!filters.date || item.date === filters.date)
      && (!filters.time || item.time === filters.time);
  }), [experiences, query, filters]);

  const saveExperience = async (id) => {
    if (!user?.id) return;
    const data = await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
    const savedExperiences = data.saved
      ? Array.from(new Set([...(user.savedExperiences || []), id]))
      : (user.savedExperiences || []).filter((item) => item !== id);
    setCurrentUser({ ...user, savedExperiences });
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (data.saved) next.add(id);
      else next.delete(id);
      return next;
    });
    setExperiences((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.experience } : item)));
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-7">
        <header className="text-center">
          <p className="text-sm text-[var(--mova-muted)]">Explore</p>
          <h1 className="text-2xl font-semibold tracking-[0.005em]">Buscar experiencias</h1>
        </header>
        <label className="mt-6 flex h-14 items-center gap-3 rounded-[1.25rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] px-4 shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
          <FiSearch className="text-[var(--mova-muted)]" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar experiencias" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--mova-muted)]" />
          <button type="button" onClick={() => setFiltersOpen(true)} className="grid h-9 w-9 place-items-center rounded-full bg-[var(--mova-card)] text-[var(--mova-accent)]"><FiSliders /></button>
        </label>

        <section className="mt-5">
          <div className="mova-scrollbar-none flex gap-2 overflow-x-auto pb-2">{popular.map((chip) => <button key={chip} onClick={() => setQuery(chip)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${query === chip ? 'bg-[var(--mova-accent)] text-white' : 'bg-[var(--mova-surface)] text-[var(--mova-muted)]'}`}>{chip}</button>)}</div>
        </section>

        {status === 'error' && <p className="mt-6 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}
        <section className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {results.map((item, index) => <SearchCard key={item.id} item={item} saved={savedIds.has(item.id)} onSave={saveExperience} tall={index % 4 === 1 || index % 4 === 2} />)}
          </div>
        </section>
        {status === 'ready' && results.length === 0 && <p className="mt-8 text-sm text-[var(--mova-muted)]">No encontramos experiencias con esos filtros.</p>}
      </section>
      <FilterModal open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} />
    </main>
  );
}
