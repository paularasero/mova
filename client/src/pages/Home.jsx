import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowUpRight, FiBookmark, FiMenu, FiSearch, FiSliders, FiUser, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { clearCurrentUser, getCurrentUser } from '../lib/auth';

const tabs = ['All', 'Popular', 'Recomendados', 'Cerca tuyo', 'Night', 'Chill', 'Food', 'Outdoor'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Rooftops', 'Outdoor'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const budgets = ['$', '$$', '$$$'];
const menuItems = [
  ['Mi perfil', '/profile'],
  ['Guardados', '/saved'],
  ['Actividad', '/activity'],
  ['Mis experiencias', '/profile'],
  ['Recompensas', '/rewards'],
  ['Configuración', '/settings'],
  ['Ayuda', '/messages'],
];

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

function ExperienceCard({ item, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link to={`/plan/${item.id}`} className="group relative block h-[23rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
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
          <span className="absolute bottom-0 right-0 grid h-14 w-14 place-items-center rounded-full bg-[#C8FF3D] text-2xl text-black shadow-[0_16px_38px_rgba(200,255,61,0.28)]">
            <FiArrowUpRight />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function FilterSheet({ open, onClose, filters, setFilters }) {
  const toggle = (key, value) => setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" aria-label="Cerrar filtros" />
          <motion.div initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} transition={{ type: 'spring', damping: 30, stiffness: 280 }} className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[2rem] border border-white/10 bg-[#0b0b0b] p-5 pb-8 text-white shadow-[0_-28px_80px_rgba(0,0,0,0.55)]">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/18" />
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Filtros</h2>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button>
            </div>
            <label className="mt-5 block text-sm font-semibold text-white/70">Ciudad</label>
            <select value={filters.city} onChange={(event) => setFilters((prev) => ({ ...prev, city: event.target.value }))} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm outline-none">
              <option>Montevideo</option>
              <option>Punta del Este</option>
              <option>Buenos Aires</option>
            </select>
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
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button key={option} onClick={() => toggle(key, option)} className={`rounded-full px-4 py-2 text-xs font-semibold ${filters[key] === option ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/68'}`}>{option}</button>
                  ))}
                </div>
              </div>
            ))}
            <label className="mt-5 block text-sm font-semibold text-white/70">Distancia: {filters.distance} km</label>
            <input type="range" min="1" max="20" value={filters.distance} onChange={(event) => setFilters((prev) => ({ ...prev, distance: event.target.value }))} className="mt-3 w-full accent-[#C8FF3D]" />
            <button onClick={onClose} className="mt-6 h-14 w-full rounded-full bg-[#C8FF3D] py-4 text-sm font-bold text-black">Aplicar filtros</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SideMenu({ open, onClose }) {
  const logout = () => {
    clearCurrentUser();
    window.location.href = '/login';
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/72 backdrop-blur-sm" aria-label="Cerrar menú" />
          <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: 'spring', damping: 30, stiffness: 260 }} className="fixed bottom-0 left-0 top-0 z-50 w-[82%] max-w-[340px] border-r border-white/10 bg-[#090909]/96 p-6 text-white shadow-[28px_0_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">MOVA<span className="text-[#C8FF3D]">.</span></p>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button>
            </div>
            <div className="mt-10 space-y-2">
              {menuItems.map(([label, to]) => <Link key={label} to={to} onClick={onClose} className="block rounded-2xl bg-white/[0.055] px-4 py-4 text-sm font-semibold text-white/78">{label}</Link>)}
              <button onClick={logout} className="block w-full rounded-2xl bg-red-500/10 px-4 py-4 text-left text-sm font-semibold text-[#ff7c7c]">Cerrar sesión</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const user = getCurrentUser();
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [filters, setFilters] = useState({ city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', time: '', distance: 8 });

  useEffect(() => {
    apiRequest('/experiences')
      .then((data) => { setExperiences(data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  const filtered = useMemo(() => {
    return experiences.filter((item) => {
      const text = `${item.title} ${item.description} ${item.neighborhood} ${item.category} ${(item.tags || []).join(' ')}`.toLowerCase();
      return (!query || text.includes(query.toLowerCase()))
        && matchesTab(item, activeTab, user)
        && (!filters.city || item.city === filters.city)
        && (!filters.category || String(item.category).toLowerCase().includes(filters.category.toLowerCase()))
        && (!filters.company || item.company === filters.company)
        && (!filters.budget || item.price === filters.budget)
        && (!filters.date || item.date === filters.date);
    });
  }, [experiences, query, activeTab, filters, user]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <button onClick={() => setMenuOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.08] text-xl"><FiMenu /></button>
          <div className="text-center">
            <p className="text-xs text-white/42">Ciudad actual</p>
            <p className="text-sm font-semibold">{filters.city}</p>
          </div>
          <Link to="/profile" className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white/[0.08]">
            {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <FiUser />}
          </Link>
        </header>

        <div className="mt-6">
          <p className="text-sm text-white/48">Buenas noches, {user?.nombre?.split(' ')[0] || 'Paula'}</p>
          <h1 className="mt-1 text-[2rem] font-semibold leading-tight tracking-[0.005em]">Descubrí tu próximo plan.</h1>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <label className="flex h-14 flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/[0.07] px-4 text-white/50">
            <FiSearch className="text-lg" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar experiencias" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/36" />
          </label>
          <button onClick={() => setFiltersOpen(true)} className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-xl"><FiSliders /></button>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/66'}`}>{tab}</button>
          ))}
        </div>

        {status === 'loading' && <div className="mt-8 h-[23rem] animate-pulse rounded-[2rem] bg-white/[0.06]" />}
        {status === 'error' && <p className="mt-8 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}

        <div className="mt-4 space-y-5">
          {filtered.map((experience, index) => <ExperienceCard key={experience.id} item={experience} index={index} />)}
        </div>
        {status === 'ready' && filtered.length === 0 && <p className="mt-8 text-sm text-white/50">No encontramos planes con esos filtros.</p>}
      </section>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <FilterSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} filters={filters} setFilters={setFilters} />
    </main>
  );
}
