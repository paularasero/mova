import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiBell, FiBookmark, FiChevronDown, FiMap, FiMapPin, FiSearch, FiSliders, FiUser, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['All', 'Popular', 'Recomendados', 'Cerca tuyo', 'Night', 'Chill', 'Food', 'Outdoor'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Rooftops', 'Outdoor'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const budgets = ['$', '$$', '$$$'];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia', 'Roma', 'Berlín', 'Lisboa', 'Tokio', 'Ciudad de México', 'Bogotá', 'Lima'];

function matchesTab(item, tab, user) {
  if (tab === 'All') return true;
  if (tab === 'Popular') return (item.likes || 0) > 180 || (item.saves || item.guardados || 0) > 90;
  if (tab === 'Recomendados') {
    const prefs = user?.preferences?.favoriteCategories || [];
    return prefs.length ? prefs.some((pref) => String(item.category).toLowerCase().includes(pref.toLowerCase())) : true;
  }
  if (tab === 'Cerca tuyo') return item.city === (user?.city || user?.ciudad || 'Montevideo');
  return String(item.category || '').toLowerCase().includes(tab.toLowerCase());
}

function ExperienceCard({ item }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <Link to={`/plan/${item.id}`} className="photo-card group relative block h-[23rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/18 to-black/88" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur-xl">{item.price}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-black/35 text-[#C8FF3D] backdrop-blur-xl"><FiBookmark /></span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8FF3D]">{item.neighborhood}</p>
          <h2 className="max-w-[15rem] text-[2.1rem] font-semibold leading-[1.02] tracking-[0.005em] text-white">{item.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/68">{item.time} · {item.company} · {item.category}</p>
          <span className="absolute bottom-0 right-0 grid h-14 w-14 place-items-center rounded-full bg-[#C8FF3D] text-2xl text-black shadow-[0_16px_38px_rgba(200,255,61,0.28)]"><FiArrowUpRight /></span>
        </div>
      </Link>
    </motion.div>
  );
}

function MiniCard({ item, onSave }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className="h-60 w-44 shrink-0">
      <Link to={`/plan/${item.id}`} className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.06]">
        <div className="relative h-32 shrink-0">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/55" />
          <button onClick={(event) => { event.preventDefault(); onSave(item.id); }} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-[#C8FF3D] backdrop-blur-xl"><FiBookmark /></button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-3">
          <h3 className="line-clamp-2 min-h-[2.1rem] text-sm font-semibold leading-tight">{item.title}</h3>
          <p className="mt-1 truncate text-xs text-white/46">{item.neighborhood}, {item.city}</p>
          <div className="mt-auto flex items-center justify-between gap-2 text-[11px] text-white/50">
            <span>{item.category}</span>
            <span className="text-[#D9FF73]">★ {item.rating || 4.8}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Rail({ title, items, onSave }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Link to="/explore" className="text-xs font-semibold text-white/42">Ver todo</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => <MiniCard key={`${title}-${item.id}`} item={item} onSave={onSave} />)}
      </div>
    </section>
  );
}

function FilterSheet({ open, onClose, filters, setFilters }) {
  const toggle = (key, value) => setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="mova-overlay" aria-label="Cerrar filtros" />
          <div className="mova-sheet-wrap">
          <motion.div initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} transition={{ type: 'spring', damping: 30, stiffness: 280 }} className="mova-sheet p-5 pb-8">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/18" />
            <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Filtros</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button></div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold text-white/70">Fecha<input type="date" value={filters.date} onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 text-sm text-white outline-none" /></label>
              <label className="block text-sm font-semibold text-white/70">Horario<input type="time" value={filters.time} onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-3 text-sm text-white outline-none" /></label>
            </div>
            {[
              ['Categoría', 'category', categories],
              ['Compañía ideal', 'company', companies],
              ['Presupuesto', 'budget', budgets],
            ].map(([title, key, options]) => (
              <div key={title} className="mt-5">
                <p className="mb-2 text-sm font-semibold text-white/70">{title}</p>
                <div className="flex flex-wrap gap-2">{options.map((option) => <button key={option} onClick={() => toggle(key, option)} className={`rounded-full px-4 py-2 text-xs font-semibold ${filters[key] === option ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/68'}`}>{option}</button>)}</div>
              </div>
            ))}
            <label className="mt-5 block text-sm font-semibold text-white/70">Distancia: {filters.distance} km</label>
            <input type="range" min="1" max="20" value={filters.distance} onChange={(event) => setFilters((prev) => ({ ...prev, distance: event.target.value }))} className="mt-3 w-full accent-[#C8FF3D]" />
            <button onClick={onClose} className="mt-6 h-14 w-full rounded-full bg-[#C8FF3D] py-4 text-sm font-bold text-black">Aplicar filtros</button>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function CitySheet({ open, onClose, currentUser, currentCity, onSave }) {
  const [query, setQuery] = useState('');
  const filtered = cities.filter((city) => city.toLowerCase().includes(query.toLowerCase()));
  const selectCity = async (city) => {
    const updated = await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ userId: currentUser?.id, city, preferences: currentUser?.preferences }),
    });
    setCurrentUser(updated);
    onSave(city);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="mova-overlay" aria-label="Cerrar ciudades" />
          <div className="mova-sheet-wrap">
          <motion.div initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} className="mova-sheet p-5">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/18" />
            <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Elegí ciudad</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button></div>
            <label className="mt-5 flex h-14 items-center gap-3 rounded-full bg-white/[0.07] px-4"><FiSearch className="text-white/45" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ciudad" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" /></label>
            <button onClick={() => selectCity(currentCity)} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-[#C8FF3D]/12 px-4 py-3 text-sm font-semibold text-[#D9FF73]"><FiMapPin /> Usar ubicación actual</button>
            <div className="mt-4 max-h-[48vh] space-y-2 overflow-y-auto pb-3">
              {filtered.map((city) => <button key={city} onClick={() => selectCity(city)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${city === currentCity ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.06] text-white/72'}`}>{city}</button>)}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [cityOpen, setCityOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [filters, setFilters] = useState({ city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', time: '', distance: 8 });

  useEffect(() => {
    apiRequest('/experiences').then((data) => { setExperiences(data); setStatus('ready'); }).catch(() => setStatus('error'));
  }, []);

  const cityExperiences = experiences.filter((item) => !filters.city || item.city === filters.city);
  const filtered = useMemo(() => experiences.filter((item) => matchesTab(item, activeTab, user)
    && (!filters.city || item.city === filters.city)
    && (!filters.category || String(item.category).toLowerCase().includes(filters.category.toLowerCase()))
    && (!filters.company || item.company === filters.company)
    && (!filters.budget || item.price === filters.budget)
    && (!filters.date || item.date === filters.date)), [experiences, activeTab, filters, user]);
  const featured = filtered[0] || experiences[0];
  const recommended = cityExperiences.filter((item) => matchesTab(item, 'Recomendados', user)).slice(0, 6);
  const popular = [...cityExperiences].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 6);
  const friends = cityExperiences.filter((item) => item.company === 'Amigos').slice(0, 6);

  const saveExperience = async (id) => {
    if (!user?.id) return;
    await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">Hola, {user?.nombre?.split(' ')[0] || 'Paula'} 👋</p>
            <button onClick={() => setCityOpen(true)} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--mova-muted)]">
              Te encontrás en <span className="text-[var(--mova-text)]">{filters.city}</span><FiChevronDown className="text-[#8ab500]" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/community" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08] text-xl"><FiBell /></Link>
            <Link to="/profile" className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-white/10">
              {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <FiUser />}
            </Link>
          </div>
        </header>

        <div className="mt-6">
          <h1 className="mt-1 text-[2rem] font-semibold leading-tight tracking-[0.005em]">Descubrí tu próximo plan.</h1>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={() => navigate('/explore')} className="flex h-14 flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-4 text-left text-sm text-white/40"><FiSearch className="text-lg" /> Buscar experiencias</button>
          <button onClick={() => setFiltersOpen(true)} className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-xl"><FiSliders /></button>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/66'}`}>{tab}</button>)}
        </div>

        {status === 'loading' && <div className="mt-8 h-[23rem] animate-pulse rounded-[2rem] bg-white/[0.06]" />}
        {status === 'error' && <p className="mt-8 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}
        {featured && <div className="mt-4"><ExperienceCard item={featured} /></div>}
        <Rail title="Recomendados para vos" items={recommended} onSave={saveExperience} />
        <Rail title="Planes cerca" items={cityExperiences.slice(1, 7)} onSave={saveExperience} />
        <Rail title="Populares esta semana" items={popular} onSave={saveExperience} />
        <Rail title="Para ir con amigos" items={friends} onSave={saveExperience} />
      </section>
      <FilterSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} />
      <CitySheet open={cityOpen} onClose={() => setCityOpen(false)} currentUser={user} currentCity={filters.city} onSave={(city) => setFilters((prev) => ({ ...prev, city }))} />
    </main>
  );
}
