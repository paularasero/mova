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
const cityCenters = {
  Montevideo: [-34.9011, -56.1645],
  'Buenos Aires': [-34.6037, -58.3816],
  Madrid: [40.4168, -3.7038],
  Barcelona: [41.3874, 2.1686],
  París: [48.8566, 2.3522],
  Londres: [51.5072, -0.1276],
  'Nueva York': [40.7128, -74.006],
  'São Paulo': [-23.5558, -46.6396],
  Santiago: [-33.4489, -70.6693],
  'Punta del Este': [-34.9368, -54.9346],
  Colonia: [-34.4626, -57.8398],
};

function titleOf(item) {
  return item?.title || item?.titulo || 'Plan MOVA';
}

function idOf(item) {
  return item?.id || item?._id;
}

function descriptionOf(item) {
  return item?.description || item?.descripcion || '';
}

function neighborhoodOf(item) {
  return item?.neighborhood || item?.barrio || item?.location || '';
}

function cityOf(item) {
  return item?.city || item?.ciudad || 'Montevideo';
}

function categoryOf(item) {
  return item?.category || item?.categoria || '';
}

function companyOf(item) {
  return item?.company || item?.compania || '';
}

function priceOf(item) {
  return item?.price || item?.precio || '';
}

function timeOf(item) {
  return item?.time || item?.horario || '';
}

function dateOf(item) {
  return item?.date || item?.fecha || '';
}

function interestedOf(item) {
  return item?.interestedCount ?? item?.joinedUsers?.length ?? 0;
}

function userJoined(item, userId) {
  return Boolean(userId && item?.joinedUsers?.includes(userId));
}

function userActionPayload(user) {
  return {
    userId: user?.id || user?._id,
    userName: user?.nombre || user?.name || 'Usuario MOVA',
    name: user?.nombre || user?.name || 'Usuario MOVA',
    email: user?.email,
    city: user?.city || user?.ciudad || 'Montevideo',
    avatar: user?.avatar,
  };
}

function distanceKm(item, city) {
  const center = cityCenters[city] || cityCenters.Montevideo;
  const lat = Number(item?.lat);
  const lng = Number(item?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return 0;
  const toRad = (value) => (value * Math.PI) / 180;
  const earthKm = 6371;
  const dLat = toRad(lat - center[0]);
  const dLng = toRad(lng - center[1]);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(center[0])) * Math.cos(toRad(lat)) * Math.sin(dLng / 2) ** 2;
  return earthKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function SearchCard({ item, saved, joined, onSave, onJoin, tall = false }) {
  const planId = idOf(item);
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.98 }} className={`overflow-hidden rounded-[0.45rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_12px_30px_rgba(17,17,17,0.05)] ${tall ? 'row-span-2' : ''}`}>
      <div className={`photo-card relative overflow-hidden ${tall ? 'aspect-[0.78]' : 'aspect-[1.02]'}`}>
        <Link to={`/plan/${planId}`} className="block h-full">
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/70" />
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white">{titleOf(item)}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-white/72">{neighborhoodOf(item)}</p>
          </div>
        </Link>
        <button onClick={() => onSave(planId)} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-[0.16rem] backdrop-blur-xl ${saved ? 'bg-[#F2EDEA] text-[#111215]' : 'bg-[#F2EDEA]/90 text-[#111215]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--mova-muted)]">
          <span className="truncate text-[#F2EDEA]/66">{categoryOf(item)}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[#F9A809]"><FiUsers /> {interestedOf(item)}</span>
        </div>
        <button onClick={() => onJoin(planId)} className={`h-9 w-full rounded-[0.16rem] text-xs font-bold transition ${joined ? 'bg-[#F2EDEA] text-[#111215]' : 'bg-[#FD7407] text-[#111215] hover:bg-[#F9A809]'}`}>{joined ? 'Te sumaste' : 'Me sumo'}</button>
      </div>
    </motion.article>
  );
}

function FilterModal({ open, onClose, filters, setFilters, onClear }) {
  const set = (field, value) => setFilters((prev) => ({ ...prev, [field]: prev[field] === value ? '' : value }));
  const clear = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClear();
  };
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
              <div className="mt-7 grid gap-3">
                <button type="button" onClick={onClose} className="h-14 w-full rounded-full bg-[var(--mova-accent)] font-bold text-white">Aplicar filtros</button>
                <button type="button" onPointerDown={clear} onClick={clear} className="h-12 w-full rounded-full border border-[var(--mova-border)] bg-[var(--mova-card)] text-sm font-bold text-[var(--mova-text)]">Restablecer</button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Explore() {
  const user = getCurrentUser();
  const defaultFilters = { city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', time: '', distance: 8 };
  const [experiences, setExperiences] = useState([]);
  const [query, setQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [savedIds, setSavedIds] = useState(new Set(user?.savedExperiences || []));
  const [joinedIds, setJoinedIds] = useState(new Set());
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    apiRequest('/experiences').then((data) => {
      setExperiences(data);
      setJoinedIds(new Set(data.filter((item) => userJoined(item, user?.id)).map((item) => idOf(item))));
      setStatus('ready');
    }).catch(() => setStatus('error'));
  }, [user?.id]);

  const results = useMemo(() => experiences.filter((item) => {
    const text = `${titleOf(item)} ${descriptionOf(item)} ${neighborhoodOf(item)} ${cityOf(item)} ${categoryOf(item)} ${companyOf(item)} ${(item.tags || []).join(' ')}`.toLowerCase();
    const itemDistance = distanceKm(item, filters.city);
    return (!query || text.includes(query.toLowerCase()))
      && (!filters.city || cityOf(item).toLowerCase() === filters.city.toLowerCase())
      && (!filters.category || String(categoryOf(item)).toLowerCase().includes(filters.category.toLowerCase()))
      && (!filters.company || companyOf(item) === filters.company)
      && (!filters.budget || priceOf(item) === filters.budget)
      && (!filters.date || dateOf(item) === filters.date)
      && (!filters.time || timeOf(item) === filters.time)
      && (!filters.distance || itemDistance <= Number(filters.distance));
  }), [experiences, query, filters]);
  const hasPlansInCity = useMemo(
    () => experiences.some((item) => !filters.city || cityOf(item).toLowerCase() === filters.city.toLowerCase()),
    [experiences, filters.city]
  );

  const activeFilters = useMemo(() => {
    const labels = [];
    if (query) labels.push(['query', query]);
    if (filters.city) labels.push(['city', filters.city]);
    if (filters.date) labels.push(['date', filters.date]);
    if (filters.time) labels.push(['time', filters.time]);
    if (filters.category) labels.push(['category', filters.category]);
    if (filters.company) labels.push(['company', filters.company]);
    if (filters.budget) labels.push(['budget', filters.budget]);
    if (Number(filters.distance) !== Number(defaultFilters.distance)) labels.push(['distance', `${filters.distance} km`]);
    return labels;
  }, [query, filters, defaultFilters.distance]);

  const saveExperience = async (id) => {
    if (!user?.id || !id) return;
    const wasSaved = savedIds.has(id);
    const previousSavedIds = new Set(savedIds);
    const optimisticSavedIds = new Set(previousSavedIds);
    if (wasSaved) optimisticSavedIds.delete(id);
    else optimisticSavedIds.add(id);
    setSavedIds(optimisticSavedIds);
    setCurrentUser({ ...user, savedExperiences: Array.from(optimisticSavedIds) });

    try {
      const data = await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify(userActionPayload(user)) });
      const confirmedSavedIds = new Set(previousSavedIds);
      if (data.saved) confirmedSavedIds.add(id);
      else confirmedSavedIds.delete(id);
      setSavedIds(confirmedSavedIds);
      setCurrentUser({ ...user, savedExperiences: Array.from(confirmedSavedIds) });
      setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, ...data.experience } : item)));
    } catch (error) {
      if (String(error.message || '').includes('No encontramos ese plan')) {
        setSavedIds(previousSavedIds);
        setCurrentUser({ ...user, savedExperiences: Array.from(previousSavedIds) });
      }
    }
  };

  const joinExperience = async (id) => {
    if (!user?.id || !id) return;
    const wasJoined = joinedIds.has(id);
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (wasJoined) next.delete(id);
      else next.add(id);
      return next;
    });
    setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, interestedCount: Math.max(0, interestedOf(item) + (wasJoined ? -1 : 1)), joinedUsers: wasJoined ? (item.joinedUsers || []).filter((value) => value !== user.id) : [...new Set([...(item.joinedUsers || []), user.id])] } : item)));

    try {
      const data = await apiRequest(`/experiences/${id}/join`, { method: 'POST', body: JSON.stringify(userActionPayload(user)) });
      setJoinedIds((prev) => {
        const next = new Set(prev);
        if (data.joined) next.add(id);
        else next.delete(id);
        return next;
      });
      setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, ...data.experience } : item)));
    } catch (error) {
      if (String(error.message || '').includes('No encontramos ese plan')) {
        setJoinedIds((prev) => {
          const next = new Set(prev);
          if (wasJoined) next.add(id);
          else next.delete(id);
          return next;
        });
      }
    }
  };

  const clearFilters = () => {
    setQuery('');
    setFilters(defaultFilters);
    setFiltersOpen(false);
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

        {activeFilters.length > 0 && (
          <div className="mova-scrollbar-none mt-3 flex gap-2 overflow-x-auto pb-1">
            {activeFilters.map(([key, value]) => (
              <span key={`${key}-${value}`} className="shrink-0 rounded-full bg-[var(--mova-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--mova-accent)]">{value}</span>
            ))}
          </div>
        )}

        {status === 'error' && <p className="mt-6 text-sm text-[#FB97B3]">No se pudieron cargar las experiencias.</p>}
        <section className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {results.map((item, index) => <SearchCard key={idOf(item)} item={item} saved={savedIds.has(idOf(item))} joined={joinedIds.has(idOf(item)) || userJoined(item, user?.id)} onSave={saveExperience} onJoin={joinExperience} tall={index % 4 === 1 || index % 4 === 2} />)}
          </div>
        </section>
        {status === 'ready' && results.length === 0 && (
          <div className="mt-8 overflow-hidden rounded-[0.45rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] p-5">
            <h2 className="text-xl font-semibold">
              {hasPlansInCity ? 'No encontramos planes con esos filtros' : 'Todavía no hay planes en esta ciudad'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--mova-muted)]">
              {hasPlansInCity ? 'Probá ajustar la búsqueda o restablecer los filtros.' : 'Sé la primera persona en crear uno.'}
            </p>
            {!hasPlansInCity && <Link to="/create" className="mt-5 inline-flex rounded-[0.16rem] bg-[#FD7407] px-4 py-2.5 text-sm font-black text-[#111215] hover:bg-[#F9A809]">Crear plan</Link>}
          </div>
        )}
      </section>
      <FilterModal open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} onClear={clearFilters} />
    </main>
  );
}
