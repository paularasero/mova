import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiCheck, FiChevronDown, FiMapPin, FiSearch, FiUser, FiUsers, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['para hoy', 'gratis', 'cafés', 'arte', 'música', 'citas', 'outdoor', 'night', 'con amigos'];
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

function FeaturedCard({ item, saved, onSave }) {
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.99 }} className="photo-card relative h-[21rem] overflow-hidden rounded-[2rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
      <Link to={`/plan/${item.id}`} className="block h-full">
        <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/18 to-black/88" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72">{item.neighborhood}</p>
          <h2 className="max-w-[16rem] text-[2rem] font-semibold leading-[1.02] tracking-[0.005em] text-white">{item.title}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm leading-relaxed text-white/74">
            <span>{item.location || item.neighborhood}</span>
            <span>★ {item.rating || 4.8}</span>
            <span className="inline-flex items-center gap-1"><FiUsers /> {item.saves || item.guardados || 0}</span>
          </div>
        </div>
      </Link>
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
        <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur-xl">Popular hoy</span>
        <button onClick={() => onSave(item.id)} className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur-xl ${saved ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/90 text-[var(--mova-accent)]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
      </div>
      <button className="absolute bottom-5 right-5 rounded-full bg-[var(--mova-accent)] px-4 py-2 text-xs font-bold text-white shadow-[0_16px_34px_rgba(123,97,255,0.32)]">Me sumo</button>
    </motion.article>
  );
}

function SmallCard({ item, saved, onSave }) {
  return (
    <motion.article whileTap={{ scale: 0.98 }} className="h-[16.5rem] w-44 shrink-0 overflow-hidden rounded-[1.55rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
      <div className="photo-card relative h-36 overflow-hidden">
        <Link to={`/plan/${item.id}`} className="block h-full">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/4 via-black/10 to-black/58" />
        </Link>
        <button onClick={() => onSave(item.id)} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur-xl ${saved ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/90 text-[var(--mova-accent)]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-white">{item.title}</h3>
          <p className="mt-1 line-clamp-1 text-xs text-white/72">{item.neighborhood}</p>
        </div>
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

function Rail({ title, items, savedIds, onSave }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-[0.005em]">{title}</h2>
        <Link to="/explore" className="text-xs font-semibold text-[var(--mova-muted)]">Ver todo</Link>
      </div>
      <div className="mova-scrollbar-none flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <SmallCard key={`${title}-${item.id}`} item={item} saved={savedIds.has(item.id)} onSave={onSave} />
        ))}
      </div>
    </section>
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
  const [activeTab, setActiveTab] = useState('para hoy');
  const [heroId, setHeroId] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [filters, setFilters] = useState({ city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', time: '', distance: 8 });
  const [savedIds, setSavedIds] = useState(new Set(user?.savedExperiences || []));

  useEffect(() => {
    apiRequest('/experiences').then((data) => {
      setExperiences(data);
      const candidates = [...data]
        .sort((a, b) => ((b.saves || b.guardados || 0) + (b.likes || 0)) - ((a.saves || a.guardados || 0) + (a.likes || 0)))
        .slice(0, 6);
      setHeroId(candidates[Math.floor(Math.random() * Math.max(candidates.length, 1))]?.id || data[0]?.id || null);
      setStatus('ready');
    }).catch(() => setStatus('error'));
  }, []);

  const cityMatches = experiences.filter((item) => !filters.city || item.city === filters.city);
  const cityExperiences = cityMatches.length ? cityMatches : experiences;
  const filtered = useMemo(() => experiences.filter((item) => matchesTab(item, activeTab, user)
    && (!filters.city || item.city === filters.city)
    && (!filters.category || String(item.category).toLowerCase().includes(filters.category.toLowerCase()))
    && (!filters.company || item.company === filters.company)
    && (!filters.budget || item.price === filters.budget)
    && (!filters.date || item.date === filters.date)), [experiences, activeTab, filters, user]);
  const featured = filtered.find((item) => item.id === heroId) || filtered[0] || experiences[0];
  const withoutFeatured = cityExperiences.filter((item) => item.id !== featured?.id);
  const popularNear = [...withoutFeatured].sort((a, b) => ((b.saves || b.guardados || 0) + (b.likes || 0)) - ((a.saves || a.guardados || 0) + (a.likes || 0))).slice(0, 8);
  const today = withoutFeatured.slice(0, 8);
  const friends = withoutFeatured.filter((item) => String(item.company || '').toLowerCase().includes('amigos')).slice(0, 8);
  const cafes = withoutFeatured.filter((item) => `${item.title} ${item.category} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('café') || `${item.title} ${item.category}`.toLowerCase().includes('food')).slice(0, 8);
  const outdoor = withoutFeatured.filter((item) => `${item.category} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('outdoor') || `${item.title} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('playa')).slice(0, 8);
  const night = withoutFeatured.filter((item) => `${item.category} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('night') || `${item.title}`.toLowerCase().includes('bar')).slice(0, 8);
  const free = withoutFeatured.filter((item) => item.price === '$' || `${item.tags?.join(' ') || ''}`.toLowerCase().includes('gratis')).slice(0, 8);

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
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">Hola, {user?.nombre?.split(' ')[0] || 'Paula'} 👋</p>
            <button onClick={() => setCityOpen(true)} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--mova-muted)]">
              Te encontrás en <span className="text-[var(--mova-text)]">{filters.city}</span><FiChevronDown className="text-[var(--mova-accent)]" />
            </button>
          </div>
          <Link to="/profile" className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-[var(--mova-surface)] ring-1 ring-[var(--mova-border)]">
            {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <FiUser />}
          </Link>
        </header>

        <div className="mt-8">
          <h1 className="mt-1 text-[2.2rem] font-semibold leading-[1.04] tracking-[0.005em]">Descubrí tu próximo plan</h1>
        </div>

        <div className="mt-5">
          <button onClick={() => navigate('/explore')} className="box-border flex h-14 w-full max-w-full items-center gap-3 rounded-full border border-[var(--mova-border)] bg-[var(--mova-surface)] px-4 text-left text-sm text-[var(--mova-muted)] shadow-[0_10px_30px_rgba(17,17,17,0.04)]"><FiSearch className="text-lg" /> Buscar experiencias</button>
        </div>

        <div className="mova-scrollbar-none mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-[var(--mova-accent)] text-white' : 'bg-[var(--mova-surface)] text-[var(--mova-muted)]'}`}>{tab}</button>)}
        </div>

        {status === 'loading' && <div className="mt-8 h-[23rem] animate-pulse rounded-[2rem] bg-white/[0.06]" />}
        {status === 'error' && <p className="mt-8 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-[#ff8f8f]">No se pudieron cargar las experiencias.</p>}
        {featured && <div className="mt-4"><FeaturedCard item={featured} saved={savedIds.has(featured.id)} onSave={saveExperience} /></div>}
        <Rail title="Populares cerca" items={popularNear} savedIds={savedIds} onSave={saveExperience} />
        <Rail title="Para hoy" items={today} savedIds={savedIds} onSave={saveExperience} />
        <Rail title="Con amigos" items={friends} savedIds={savedIds} onSave={saveExperience} />
        <Rail title="Cafés" items={cafes} savedIds={savedIds} onSave={saveExperience} />
        <Rail title="Outdoor" items={outdoor} savedIds={savedIds} onSave={saveExperience} />
        <Rail title="Night" items={night} savedIds={savedIds} onSave={saveExperience} />
        <Rail title="Gratis" items={free} savedIds={savedIds} onSave={saveExperience} />
      </section>
      <CitySheet open={cityOpen} onClose={() => setCityOpen(false)} currentUser={user} currentCity={filters.city} onSave={(city) => setFilters((prev) => ({ ...prev, city }))} />
    </main>
  );
}
