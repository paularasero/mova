import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiBell, FiBookmark, FiChevronDown, FiMapPin, FiSearch, FiSliders, FiUser, FiUsers, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['para hoy', 'gratis', 'cafés', 'arte', 'música', 'citas', 'outdoor', 'night', 'con amigos'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Rooftops', 'Outdoor'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const budgets = ['$', '$$', '$$$'];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia', 'Roma', 'Berlín', 'Lisboa', 'Tokio', 'Ciudad de México', 'Bogotá', 'Lima'];

function matchesTab(item, tab, user) {
  const text = `${item.title} ${item.category} ${item.tags?.join(' ') || ''} ${item.company} ${item.price}`.toLowerCase();
  if (tab === 'para hoy') return true;
  if (tab === 'gratis') return item.price === '$' || text.includes('gratis');
  if (tab === 'cafés') return text.includes('café') || text.includes('cafe') || text.includes('food');
  if (tab === 'arte') return text.includes('art') || text.includes('culture');
  if (tab === 'música') return text.includes('música') || text.includes('musica') || text.includes('jazz');
  if (tab === 'citas') return String(item.company || '').toLowerCase().includes('pareja');
  if (tab === 'con amigos') return String(item.company || '').toLowerCase().includes('amigos');
  return text.includes(tab.toLowerCase());
}

function ExperienceCard({ item }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <Link to={`/plan/${item.id}`} className="photo-card group relative block h-[22rem] overflow-hidden rounded-[2rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
        <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/18 to-black/88" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur-xl">{item.price}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--mova-accent)] backdrop-blur-xl"><FiBookmark /></span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">{item.neighborhood}</p>
          <h2 className="max-w-[15rem] text-[2.1rem] font-semibold leading-[1.02] tracking-[0.005em] text-white">{item.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/68">{item.time} · {item.company} · {item.category}</p>
          <span className="absolute bottom-0 right-0 grid h-14 w-14 place-items-center rounded-full bg-[var(--mova-accent)] text-2xl text-white shadow-[0_16px_34px_rgba(123,97,255,0.32)]"><FiArrowUpRight /></span>
        </div>
      </Link>
    </motion.div>
  );
}

function MiniCard({ item, onSave }) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className="h-60 w-44 shrink-0">
      <Link to={`/plan/${item.id}`} className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
        <div className="relative h-32 shrink-0">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/55" />
          <button onClick={(event) => { event.preventDefault(); onSave(item.id); }} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[var(--mova-accent)] backdrop-blur-xl"><FiBookmark /></button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-3">
          <h3 className="line-clamp-2 min-h-[2.1rem] text-sm font-semibold leading-tight">{item.title}</h3>
          <p className="mt-1 truncate text-xs text-[var(--mova-muted)]">{item.neighborhood}, {item.city}</p>
          <div className="mt-auto flex items-center justify-between gap-2 text-[11px] text-[var(--mova-muted)]">
            <span>{item.category}</span>
            <span className="inline-flex items-center gap-1 text-[var(--mova-accent)]"><FiUsers /> {item.saves || item.guardados || 0}</span>
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
        <Link to="/explore" className="text-xs font-semibold text-[var(--mova-muted)]">Ver todo</Link>
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
              <label className="block text-sm font-semibold text-[var(--mova-muted)]">Fecha<input type="date" value={filters.date} onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[var(--mova-border)] bg-[var(--mova-card)] px-3 py-3 text-sm text-[var(--mova-text)] outline-none" /></label>
              <label className="block text-sm font-semibold text-[var(--mova-muted)]">Horario<input type="time" value={filters.time} onChange={(event) => setFilters((prev) => ({ ...prev, time: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[var(--mova-border)] bg-[var(--mova-card)] px-3 py-3 text-sm text-[var(--mova-text)] outline-none" /></label>
            </div>
            {[
              ['Categoría', 'category', categories],
              ['Compañía ideal', 'company', companies],
              ['Presupuesto', 'budget', budgets],
            ].map(([title, key, options]) => (
              <div key={title} className="mt-5">
                <p className="mb-2 text-sm font-semibold text-[var(--mova-muted)]">{title}</p>
                <div className="flex flex-wrap gap-2">{options.map((option) => <button key={option} onClick={() => toggle(key, option)} className={`rounded-full px-4 py-2 text-xs font-semibold ${filters[key] === option ? 'bg-[var(--mova-accent)] text-white' : 'bg-[var(--mova-card)] text-[var(--mova-muted)]'}`}>{option}</button>)}</div>
              </div>
            ))}
            <label className="mt-5 block text-sm font-semibold text-[var(--mova-muted)]">Distancia: {filters.distance} km</label>
            <input type="range" min="1" max="20" value={filters.distance} onChange={(event) => setFilters((prev) => ({ ...prev, distance: event.target.value }))} className="mt-3 w-full accent-[var(--mova-accent)]" />
            <button onClick={onClose} className="mt-6 h-14 w-full rounded-full bg-[var(--mova-accent)] py-4 text-sm font-bold text-white">Aplicar filtros</button>
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
            <label className="mt-5 flex h-14 items-center gap-3 rounded-full bg-[var(--mova-card)] px-4"><FiSearch className="text-[var(--mova-muted)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ciudad" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--mova-muted)]" /></label>
            <button onClick={() => selectCity(currentCity)} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-[var(--mova-accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--mova-accent)]"><FiMapPin /> Usar ubicación actual</button>
            <div className="mt-4 max-h-[48vh] space-y-2 overflow-y-auto pb-3">
              {filtered.map((city) => <button key={city} onClick={() => selectCity(city)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${city === currentCity ? 'bg-[var(--mova-accent)] text-white' : 'bg-[var(--mova-card)] text-[var(--mova-muted)]'}`}>{city}</button>)}
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
              Te encontrás en <span className="text-[var(--mova-text)]">{filters.city}</span><FiChevronDown className="text-[var(--mova-accent)]" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/community" className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08] text-xl"><FiBell /></Link>
            <Link to="/profile" className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white/[0.08] ring-1 ring-white/10">
              {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <FiUser />}
            </Link>
          </div>
        </header>

        <div className="mt-8">
          <h1 className="mt-1 text-[2.15rem] font-semibold leading-[1.04] tracking-[0.005em]">Descubrí planes con gente cerca.</h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[var(--mova-muted)]">Cafés, música, atardeceres y juntadas espontáneas en clave MOVA.</p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={() => navigate('/explore')} className="flex h-14 flex-1 items-center gap-3 rounded-full border border-[var(--mova-border)] bg-[var(--mova-surface)] px-4 text-left text-sm text-[var(--mova-muted)] shadow-[0_10px_30px_rgba(17,17,17,0.04)]"><FiSearch className="text-lg" /> Buscar experiencias</button>
          <button onClick={() => setFiltersOpen(true)} className="grid h-14 w-14 place-items-center rounded-full border border-[var(--mova-border)] bg-[var(--mova-surface)] text-xl text-[var(--mova-accent)]"><FiSliders /></button>
        </div>

        <div className="mova-scrollbar-none mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-[var(--mova-accent)] text-white' : 'bg-[var(--mova-surface)] text-[var(--mova-muted)]'}`}>{tab}</button>)}
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
