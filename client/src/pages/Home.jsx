import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiCheck, FiChevronDown, FiMapPin, FiSearch, FiUser, FiUsers, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['para hoy', 'gratis', 'cafés', 'arte', 'música', 'citas', 'outdoor', 'night', 'con amigos'];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia', 'Roma', 'Berlín', 'Lisboa', 'Tokio', 'Ciudad de México', 'Bogotá', 'Lima'];
const fallbackImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#7B61FF"/>
        <stop offset=".48" stop-color="#202024"/>
        <stop offset="1" stop-color="#FF9F5A"/>
      </linearGradient>
    </defs>
    <rect width="900" height="1200" fill="url(#g)"/>
    <circle cx="720" cy="210" r="150" fill="rgba(255,255,255,.16)"/>
    <circle cx="160" cy="940" r="230" fill="rgba(255,255,255,.12)"/>
    <text x="70" y="1040" fill="white" font-family="Inter,Arial" font-size="88" font-weight="700">MOVA</text>
  </svg>
`)}`;

function imageOf(item) {
  return item?.image || item?.imagen || item?.images?.[0] || fallbackImage;
}

function titleOf(item) {
  return item?.title || item?.titulo || 'Plan MOVA';
}

function neighborhoodOf(item) {
  return item?.neighborhood || item?.barrio || item?.location || 'Montevideo';
}

function cityOf(item) {
  return item?.city || item?.ciudad || 'Montevideo';
}

function categoryOf(item) {
  return item?.category || item?.categoria || 'Plan';
}

function companyOf(item) {
  return item?.company || item?.compania || '';
}

function priceOf(item) {
  return item?.price || item?.precio || '$';
}

function savesOf(item) {
  return item?.saves ?? item?.guardados ?? 0;
}

function interestedOf(item) {
  return item?.interestedCount ?? item?.joinedUsers?.length ?? savesOf(item);
}

function userJoined(item, userId) {
  return Boolean(userId && item?.joinedUsers?.includes(userId));
}

function matchesTab(item, tab, user) {
  const text = `${titleOf(item)} ${categoryOf(item)} ${item.tags?.join(' ') || ''} ${companyOf(item)} ${priceOf(item)}`.toLowerCase();
  if (tab === 'para hoy') return true;
  if (tab === 'gratis') return priceOf(item) === '$' || text.includes('gratis');
  if (tab === 'cafés') return text.includes('café') || text.includes('cafe') || text.includes('food');
  if (tab === 'arte') return text.includes('art') || text.includes('culture');
  if (tab === 'música') return text.includes('música') || text.includes('musica') || text.includes('jazz');
  if (tab === 'citas') return String(companyOf(item)).toLowerCase().includes('pareja');
  if (tab === 'con amigos') return String(companyOf(item)).toLowerCase().includes('amigos');
  return text.includes(tab.toLowerCase());
}

function FeaturedCard({ item, saved, joined, onSave, onJoin }) {
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.99 }} className="overflow-hidden rounded-[2rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_18px_45px_rgba(17,17,17,0.08)]">
      <div className="photo-card relative h-[18.5rem] overflow-hidden">
        <Link to={`/plan/${item.id}`} className="block h-full">
          <img src={imageOf(item)} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={titleOf(item)} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        </Link>
        <button onClick={() => onSave(item.id)} className={`absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full backdrop-blur-xl ${saved ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/90 text-[var(--mova-accent)]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--mova-card)] px-3 py-1.5 text-xs font-semibold text-[var(--mova-muted)]">Popular hoy</span>
          <span className="text-sm font-semibold text-[var(--mova-accent)]">★ {item.rating || 4.8}</span>
        </div>
        <Link to={`/plan/${item.id}`} className="block">
          <h2 className="line-clamp-2 text-[1.65rem] font-semibold leading-[1.08] tracking-[0.005em]">{titleOf(item)}</h2>
          <div className="mt-3 grid gap-1 text-sm text-[var(--mova-muted)]">
            <span>{neighborhoodOf(item)}</span>
            <span>{categoryOf(item)}</span>
            <span className="inline-flex items-center gap-1 text-[var(--mova-accent)]"><FiUsers /> {interestedOf(item)} personas</span>
          </div>
        </Link>
        <button onClick={() => onJoin(item.id)} className={`h-11 w-full rounded-full text-sm font-bold transition ${joined ? 'bg-[var(--mova-card)] text-[var(--mova-accent)] ring-1 ring-[var(--mova-accent)]' : 'bg-[var(--mova-accent)] text-white shadow-[0_16px_34px_rgba(123,97,255,0.26)]'}`}>{joined ? 'Te sumaste' : 'Me sumo'}</button>
      </div>
    </motion.article>
  );
}

function SmallCard({ item, saved, joined, onSave, onJoin }) {
  return (
    <motion.article whileTap={{ scale: 0.98 }} className="h-[20rem] w-44 shrink-0 overflow-hidden rounded-[1.55rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
      <div className="photo-card relative h-36 overflow-hidden">
        <Link to={`/plan/${item.id}`} className="block h-full">
          <img src={imageOf(item)} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={titleOf(item)} className="h-full w-full object-cover" loading="lazy" />
        </Link>
        <button onClick={() => onSave(item.id)} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full backdrop-blur-xl ${saved ? 'bg-[var(--mova-accent)] text-white' : 'bg-white/90 text-[var(--mova-accent)]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
      </div>
      <div className="flex h-[11rem] flex-col justify-between p-3">
        <Link to={`/plan/${item.id}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-tight">{titleOf(item)}</h3>
          <div className="mt-2 grid gap-1 text-[11px] leading-snug text-[var(--mova-muted)]">
            <span className="truncate">{neighborhoodOf(item)}</span>
            <span className="truncate">{categoryOf(item)}</span>
            <span className="inline-flex items-center gap-1 text-[var(--mova-accent)]"><FiUsers /> {interestedOf(item)} personas</span>
          </div>
        </Link>
        <button onClick={() => onJoin(item.id)} className={`h-9 w-full rounded-full text-xs font-bold transition ${joined ? 'bg-[var(--mova-card)] text-[var(--mova-accent)] ring-1 ring-[var(--mova-accent)]' : 'bg-[var(--mova-accent)] text-white'}`}>{joined ? 'Te sumaste' : 'Me sumo'}</button>
        </div>
    </motion.article>
  );
}

function Rail({ title, items, userId, savedIds, joinedIds, onSave, onJoin }) {
  if (!items.length) return null;
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-[0.005em]">{title}</h2>
        <Link to="/explore" className="text-xs font-semibold text-[var(--mova-muted)]">Ver todo</Link>
      </div>
      <div className="mova-scrollbar-none flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <SmallCard key={`${title}-${item.id}`} item={item} saved={savedIds.has(item.id)} joined={joinedIds.has(item.id) || userJoined(item, userId)} onSave={onSave} onJoin={onJoin} />
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
  const [joinedIds, setJoinedIds] = useState(new Set());

  useEffect(() => {
    apiRequest('/experiences').then((data) => {
      setExperiences(data);
      setJoinedIds(new Set(data.filter((item) => userJoined(item, user?.id)).map((item) => item.id)));
      const candidates = [...data]
        .sort((a, b) => ((interestedOf(b) || 0) + (b.likes || 0)) - ((interestedOf(a) || 0) + (a.likes || 0)))
        .slice(0, 6);
      setHeroId(candidates[Math.floor(Math.random() * Math.max(candidates.length, 1))]?.id || data[0]?.id || null);
      setStatus('ready');
    }).catch(() => setStatus('error'));
  }, [user?.id]);

  const cityMatches = experiences.filter((item) => !filters.city || cityOf(item) === filters.city);
  const cityExperiences = cityMatches.length ? cityMatches : experiences;
  const filteredByTab = useMemo(() => cityExperiences.filter((item) => matchesTab(item, activeTab, user)
    && (!filters.category || String(categoryOf(item)).toLowerCase().includes(filters.category.toLowerCase()))
    && (!filters.company || companyOf(item) === filters.company)
    && (!filters.budget || priceOf(item) === filters.budget)
    && (!filters.date || item.date === filters.date || item.fecha === filters.date)), [cityExperiences, activeTab, filters, user]);
  const filtered = filteredByTab.length ? filteredByTab : cityExperiences;
  const featured = filtered.find((item) => item.id === heroId) || filtered[0] || experiences[0];
  const withoutFeatured = cityExperiences.filter((item) => item.id !== featured?.id);
  const fillRail = (items) => (items.length ? items : withoutFeatured).slice(0, 8);
  const popularNear = fillRail([...withoutFeatured].sort((a, b) => ((interestedOf(b) || 0) + (b.likes || 0)) - ((interestedOf(a) || 0) + (a.likes || 0))));
  const today = fillRail(withoutFeatured);
  const friends = fillRail(withoutFeatured.filter((item) => String(companyOf(item)).toLowerCase().includes('amigos')));
  const cafes = fillRail(withoutFeatured.filter((item) => `${titleOf(item)} ${categoryOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('café') || `${titleOf(item)} ${categoryOf(item)}`.toLowerCase().includes('food')));
  const outdoor = fillRail(withoutFeatured.filter((item) => `${categoryOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('outdoor') || `${titleOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('playa')));
  const night = fillRail(withoutFeatured.filter((item) => `${categoryOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('night') || `${titleOf(item)}`.toLowerCase().includes('bar')));
  const free = fillRail(withoutFeatured.filter((item) => priceOf(item) === '$' || `${item.tags?.join(' ') || ''}`.toLowerCase().includes('gratis')));

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

  const joinExperience = async (id) => {
    if (!user?.id) return;
    const data = await apiRequest(`/experiences/${id}/join`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (data.joined) next.add(id);
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
        {featured && <div className="mt-4"><FeaturedCard item={featured} saved={savedIds.has(featured.id)} joined={joinedIds.has(featured.id) || userJoined(featured, user?.id)} onSave={saveExperience} onJoin={joinExperience} /></div>}
        <Rail title="Populares cerca" items={popularNear} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Para hoy" items={today} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Con amigos" items={friends} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Cafés" items={cafes} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Outdoor" items={outdoor} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Night" items={night} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Gratis" items={free} userId={user?.id} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
      </section>
      <CitySheet open={cityOpen} onClose={() => setCityOpen(false)} currentUser={user} currentCity={filters.city} onSave={(city) => setFilters((prev) => ({ ...prev, city }))} />
    </main>
  );
}
