import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBell, FiBookmark, FiCheck, FiChevronDown, FiMapPin, FiSearch, FiUsers, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['para hoy', 'gratis', 'cafés', 'arte', 'música', 'citas', 'outdoor', 'night', 'con amigos'];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia', 'Roma', 'Berlín', 'Lisboa', 'Tokio', 'Ciudad de México', 'Bogotá', 'Lima'];
const fallbackImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0869D0"/>
        <stop offset=".48" stop-color="#111215"/>
        <stop offset="1" stop-color="#F9A809"/>
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

function idOf(item) {
  return item?.id || item?._id;
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
  return item?.interestedCount ?? item?.joinedUsers?.length ?? 0;
}

function userJoined(item, userId) {
  return Boolean(userId && item?.joinedUsers?.includes(userId));
}

function userActionPayload(user, userId) {
  return {
    userId,
    userName: user?.nombre || user?.name || 'Usuario MOVA',
    name: user?.nombre || user?.name || 'Usuario MOVA',
    email: user?.email,
    city: user?.city || user?.ciudad || 'Montevideo',
    avatar: user?.avatar,
  };
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
  const planId = idOf(item);
  return (
    <motion.article initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative overflow-hidden rounded-[0.45rem] bg-[#111215] shadow-[0_24px_70px_rgba(0,0,0,.36)]">
      <div className="pointer-events-none absolute -right-12 -top-10 z-10 h-36 w-36 rounded-[0.45rem] bg-[#FB97B3]/18 blur-xl" />
      <div className="photo-card relative h-[20rem] overflow-hidden">
        <Link to={`/plan/${planId}`} className="block h-full">
          <img src={imageOf(item)} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={titleOf(item)} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-transparent to-black/86" />
        <span className="absolute left-4 top-4 rounded-[0.35rem] border border-white/20 bg-black/38 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82 backdrop-blur-md">Plan del día</span>
        <span className="absolute right-16 top-4 rounded-[0.45rem] bg-white px-3 py-1.5 text-xs font-black text-[#111215]">★ {item.rating || 4.8}</span>
        <button onClick={() => onSave(planId)} className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[0.16rem] backdrop-blur-xl ${saved ? 'bg-[#FB97B3] text-[#111215]' : 'bg-white/90 text-[#111215]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Link to={`/plan/${planId}`} className="block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#F2EDEA]">{neighborhoodOf(item)} · {categoryOf(item)}</p>
            <h2 className="max-w-[17rem] text-[2rem] font-semibold leading-[1.02] tracking-[0.005em] text-white">{titleOf(item)}</h2>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 bg-[rgba(242,237,234,0.045)] p-4">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--mova-muted)]"><FiUsers /> {interestedOf(item)} personas interesadas</span>
        <button onClick={() => onJoin(planId)} className={`h-10 shrink-0 rounded-[0.16rem] px-4 text-sm font-bold transition ${joined ? 'bg-white text-[#111215]' : 'bg-[#FD7407] text-[#111215] shadow-[0_14px_32px_rgba(253,116,7,.22)] hover:bg-[#F9A809]'}`}>{joined ? 'Te sumaste' : 'Me sumo'}</button>
      </div>
    </motion.article>
  );
}

function SmallCard({ item, saved, joined, onSave, onJoin }) {
  const planId = idOf(item);
  return (
    <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileTap={{ scale: 0.985 }} className="mova-playful-card h-[20rem] w-44 shrink-0 overflow-hidden rounded-[0.45rem]">
      <div className="photo-card relative h-36 overflow-hidden">
        <Link to={`/plan/${planId}`} className="block h-full">
          <img src={imageOf(item)} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={titleOf(item)} className="h-full w-full object-cover" loading="lazy" />
        </Link>
        <button onClick={() => onSave(planId)} className={`absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-[0.16rem] backdrop-blur-xl ${saved ? 'bg-[#FB97B3] text-[#111215]' : 'bg-white/90 text-[#111215]'}`}>{saved ? <FiCheck /> : <FiBookmark />}</button>
      </div>
      <div className="flex h-[11rem] flex-col justify-between p-3 text-left">
        <Link to={`/plan/${planId}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-left text-base font-semibold leading-tight">{titleOf(item)}</h3>
          <div className="mt-2 grid justify-items-start gap-1 text-left text-[11px] leading-snug text-[var(--mova-muted)]">
            <span className="truncate">{neighborhoodOf(item)}</span>
            <span className="truncate text-[#F2EDEA]/66">{categoryOf(item)}</span>
            <span className="inline-flex items-center gap-1 text-[#F9A809]"><FiUsers /> {interestedOf(item)} personas</span>
          </div>
        </Link>
        <button onClick={() => onJoin(planId)} className={`h-9 w-full rounded-[0.16rem] text-xs font-bold transition ${joined ? 'bg-white text-[#111215]' : 'bg-[#FD7407] text-[#111215] hover:bg-[#F9A809]'}`}>{joined ? 'Te sumaste' : 'Me sumo'}</button>
        </div>
    </motion.article>
  );
}

function EditorialBanner() {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="relative mt-9 overflow-hidden rounded-[0.45rem] border border-[#F2EDEA]/10 bg-[#111215] p-5 shadow-[0_18px_52px_rgba(0,0,0,.28)]">
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[48%] bg-[#04533E]">
        <div className="absolute left-5 right-5 top-6 aspect-square rounded-full bg-[linear-gradient(180deg,#FD7407,#F9A809)]" />
        <div className="absolute bottom-0 left-3 right-3 top-28 flex justify-between overflow-hidden">
          {Array.from({ length: 8 }, (_, index) => <span key={index} className="h-full w-[4px] bg-gradient-to-b from-[#FB97B3] via-[#FD7407] to-[#0869D0]" />)}
        </div>
      </div>
      <div className="pointer-events-none absolute -left-16 bottom-[-7rem] h-72 w-72 rounded-t-full bg-[linear-gradient(180deg,#FD7407,#FB97B3_44%,#0869D0)] opacity-74" />
      <div className="mova-print-texture pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#111215_0%,rgba(17,18,21,.86)_58%,rgba(17,18,21,.28))]" />
      <span className="relative rounded-[0.12rem] border border-white/14 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">MOVA Studio</span>
      <h2 className="relative mt-5 max-w-[14rem] text-[1.85rem] font-semibold leading-[1.03]">Creá tu propio plan</h2>
      <p className="relative mt-2 max-w-[15rem] text-sm leading-relaxed text-white/52">Armá una salida, invitá gente y mové tu ciudad desde una idea simple.</p>
      <Link to="/create" className="relative mt-5 inline-flex rounded-[0.16rem] bg-white px-4 py-2 text-sm font-black text-[#111215]">Crear ahora</Link>
    </motion.section>
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
          <SmallCard key={`${title}-${idOf(item)}`} item={item} saved={savedIds.has(idOf(item))} joined={joinedIds.has(idOf(item)) || userJoined(item, userId)} onSave={onSave} onJoin={onJoin} />
        ))}
      </div>
    </section>
  );
}

function CitySheet({ open, onClose, currentUser, currentCity, onSave }) {
  const [query, setQuery] = useState('');
  const filtered = cities.filter((city) => city.toLowerCase().includes(query.toLowerCase()));
  const currentUserId = currentUser?.id || currentUser?._id;
  const selectCity = async (city) => {
    const updated = await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ userId: currentUserId, city, preferences: currentUser?.preferences }),
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
            <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Elegí ciudad</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[0.65rem] bg-white/[0.08]"><FiX /></button></div>
            <label className="mt-5 flex h-14 items-center gap-3 rounded-[0.9rem] bg-[var(--mova-card)] px-4"><FiSearch className="text-[var(--mova-muted)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ciudad" className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--mova-muted)]" /></label>
            <button onClick={() => selectCity(currentCity)} className="mt-4 flex w-full items-center gap-3 rounded-[0.85rem] bg-[var(--mova-accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--mova-accent)]"><FiMapPin /> Usar ubicación actual</button>
            <div className="mt-4 max-h-[48vh] space-y-2 overflow-y-auto pb-3">
              {filtered.map((city) => <button key={city} onClick={() => selectCity(city)} className={`w-full rounded-[0.8rem] px-4 py-3 text-left text-sm font-semibold ${city === currentCity ? 'bg-[var(--mova-accent)] text-[#111215]' : 'bg-[var(--mova-card)] text-[var(--mova-muted)]'}`}>{city}</button>)}
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
  const userId = user?.id || user?._id;
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState('para hoy');
  const [heroId, setHeroId] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [status, setStatus] = useState('loading');
  const [filters, setFilters] = useState({ city: user?.city || user?.ciudad || 'Montevideo', category: '', company: '', budget: '', date: '', time: '', distance: 8 });
  const [savedIds, setSavedIds] = useState(new Set(user?.savedExperiences || []));
  const [joinedIds, setJoinedIds] = useState(new Set());

  useEffect(() => {
    setStatus('loading');
    apiRequest(`/experiences?city=${encodeURIComponent(filters.city || '')}`).then((data) => {
      setExperiences(data);
      setJoinedIds(new Set(data.filter((item) => userJoined(item, userId)).map((item) => idOf(item))));
      const candidates = [...data]
        .sort((a, b) => ((interestedOf(b) || 0) + (b.likes || 0)) - ((interestedOf(a) || 0) + (a.likes || 0)))
        .slice(0, 6);
      setHeroId(idOf(candidates[Math.floor(Math.random() * Math.max(candidates.length, 1))]) || idOf(data[0]) || null);
      setStatus('ready');
    }).catch(() => setStatus('error'));
  }, [userId, filters.city]);

  const cityExperiences = experiences.filter((item) => !filters.city || cityOf(item) === filters.city);
  const filteredByTab = useMemo(() => cityExperiences.filter((item) => matchesTab(item, activeTab, user)
    && (!filters.category || String(categoryOf(item)).toLowerCase().includes(filters.category.toLowerCase()))
    && (!filters.company || companyOf(item) === filters.company)
    && (!filters.budget || priceOf(item) === filters.budget)
    && (!filters.date || item.date === filters.date || item.fecha === filters.date)), [cityExperiences, activeTab, filters, user]);
  const filtered = filteredByTab.length || !cityExperiences.length ? filteredByTab : cityExperiences;
  const featured = filtered.find((item) => idOf(item) === heroId) || filtered[0] || null;
  const withoutFeatured = filtered.filter((item) => idOf(item) !== idOf(featured));
  const fillRail = (items) => items.slice(0, 8);
  const popularNear = fillRail([...withoutFeatured].sort((a, b) => ((interestedOf(b) || 0) + (b.likes || 0)) - ((interestedOf(a) || 0) + (a.likes || 0))));
  const today = fillRail(withoutFeatured);
  const friends = fillRail(withoutFeatured.filter((item) => String(companyOf(item)).toLowerCase().includes('amigos')));
  const cafes = fillRail(withoutFeatured.filter((item) => `${titleOf(item)} ${categoryOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('café') || `${titleOf(item)} ${categoryOf(item)}`.toLowerCase().includes('food')));
  const outdoor = fillRail(withoutFeatured.filter((item) => `${categoryOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('outdoor') || `${titleOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('playa')));
  const night = fillRail(withoutFeatured.filter((item) => `${categoryOf(item)} ${item.tags?.join(' ') || ''}`.toLowerCase().includes('night') || `${titleOf(item)}`.toLowerCase().includes('bar')));
  const free = fillRail(withoutFeatured.filter((item) => priceOf(item) === '$' || `${item.tags?.join(' ') || ''}`.toLowerCase().includes('gratis')));

  const saveExperience = async (id) => {
    if (!userId || !id) return;
    const previousExperiences = experiences;
    const previousSavedIds = new Set(savedIds);
    const wasSaved = savedIds.has(id);
    const optimisticSavedIds = new Set(previousSavedIds);
    if (wasSaved) optimisticSavedIds.delete(id);
    else optimisticSavedIds.add(id);
    setSavedIds(optimisticSavedIds);
    setCurrentUser({ ...getCurrentUser(), id: userId, savedExperiences: Array.from(optimisticSavedIds) });
    setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, guardados: Math.max(0, savesOf(item) + (wasSaved ? -1 : 1)), saves: Math.max(0, savesOf(item) + (wasSaved ? -1 : 1)), savedBy: wasSaved ? (item.savedBy || []).filter((value) => value !== userId) : [...new Set([...(item.savedBy || []), userId])] } : item)));
    try {
      const data = await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify(userActionPayload(user, userId)) });
      const confirmedSavedIds = new Set(previousSavedIds);
      if (data.saved) confirmedSavedIds.add(id);
      else confirmedSavedIds.delete(id);
      setCurrentUser({ ...getCurrentUser(), id: userId, savedExperiences: Array.from(confirmedSavedIds) });
      setSavedIds(confirmedSavedIds);
      setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, ...data.experience } : item)));
    } catch (error) {
      if (String(error.message || '').includes('No encontramos ese plan')) {
        setSavedIds(previousSavedIds);
        setCurrentUser({ ...getCurrentUser(), id: userId, savedExperiences: Array.from(previousSavedIds) });
        setExperiences(previousExperiences);
      }
    }
  };

  const joinExperience = async (id) => {
    if (!userId || !id) return;
    const previousExperiences = experiences;
    const previousJoinedIds = new Set(joinedIds);
    const wasJoined = joinedIds.has(id);
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (wasJoined) next.delete(id);
      else next.add(id);
      return next;
    });
    setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, interestedCount: Math.max(0, interestedOf(item) + (wasJoined ? -1 : 1)), joinedUsers: wasJoined ? (item.joinedUsers || []).filter((value) => value !== userId) : [...new Set([...(item.joinedUsers || []), userId])] } : item)));
    try {
      const data = await apiRequest(`/experiences/${id}/join`, { method: 'POST', body: JSON.stringify(userActionPayload(user, userId)) });
      setJoinedIds((prev) => {
        const next = new Set(prev);
        if (data.joined) next.add(id);
        else next.delete(id);
        return next;
      });
      setExperiences((prev) => prev.map((item) => (idOf(item) === id ? { ...item, ...data.experience } : item)));
    } catch (error) {
      if (String(error.message || '').includes('No encontramos ese plan')) {
        setJoinedIds(previousJoinedIds);
        setExperiences(previousExperiences);
      }
    }
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile relative px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">Hola, {user?.nombre?.split(' ')[0] || 'Paula'} 👋</p>
            <button onClick={() => setCityOpen(true)} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[var(--mova-muted)]">
              Te encontrás en <span className="text-[var(--mova-text)]">{filters.city}</span><FiChevronDown className="text-[var(--mova-accent)]" />
            </button>
          </div>
          <div className="flex gap-2">
            <Link to="/notifications" aria-label="Notificaciones" className="grid h-11 w-11 place-items-center rounded-[0.16rem] border border-white/10 bg-white/[0.06] text-lg text-white/82"><FiBell /></Link>
            <Link to="/saved" aria-label="Guardados" className="grid h-11 w-11 place-items-center rounded-[0.16rem] border border-white/10 bg-white/[0.06] text-lg text-white/82"><FiBookmark /></Link>
          </div>
        </header>

        <div className="mt-8">
          <h1 className="mt-1 whitespace-nowrap text-[1.85rem] font-semibold leading-[1.04] tracking-[0.005em]">Descubrí tu próximo plan</h1>
        </div>

        <div className="mt-5">
          <button onClick={() => navigate('/explore')} className="box-border flex h-14 w-full max-w-full items-center gap-3 rounded-[0.16rem] border border-[var(--mova-border)] bg-[var(--mova-surface)] px-4 text-left text-sm text-[var(--mova-muted)] shadow-[0_10px_30px_rgba(17,17,17,0.04)]"><FiSearch className="text-lg" /> Buscar experiencias</button>
        </div>

        <div className="mova-scrollbar-none mt-5 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-[0.16rem] border px-3 py-1.5 text-[12px] font-semibold capitalize transition ${activeTab === tab ? 'border-[#F2EDEA] bg-[#F2EDEA] text-[#111215]' : 'border-white/12 bg-white/[0.035] text-white/62'}`}>{tab}</button>
          ))}
        </div>
        {status === 'loading' && <div className="mt-8 h-[23rem] animate-pulse rounded-[0.45rem] bg-white/[0.06]" />}
        {status === 'error' && <p className="mt-8 rounded-[0.35rem] border border-[#FB97B3]/18 bg-[#FB97B3]/10 px-4 py-3 text-sm text-[#FB97B3]">No se pudieron cargar las experiencias.</p>}
        {status === 'ready' && cityExperiences.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8 overflow-hidden rounded-[0.45rem] border border-white/10 bg-white/[0.045] p-5">
            <div className="relative mb-5 h-32 overflow-hidden rounded-[0.35rem] bg-[#111215]">
              <div className="absolute -left-12 top-8 h-44 w-44 rounded-full bg-[#FD7407]/70 blur-sm" />
              <div className="absolute bottom-[-5rem] right-[-2rem] h-44 w-44 rounded-full bg-[#0869D0]/72 blur-sm" />
              <div className="absolute left-16 top-2 h-28 w-28 rounded-full bg-[#FB97B3]/58 blur-sm" />
              <div className="mova-print-texture absolute inset-0" />
            </div>
            <h2 className="text-2xl font-semibold leading-tight">Todavía no hay planes en esta ciudad</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--mova-muted)]">Sé la primera persona en crear uno para {filters.city}.</p>
            <Link to="/create" className="mt-5 inline-flex rounded-[0.16rem] bg-[#FD7407] px-4 py-2.5 text-sm font-black text-[#111215] hover:bg-[#F9A809]">Crear plan</Link>
          </motion.div>
        )}
        {featured && <div className="mt-7"><FeaturedCard item={featured} saved={savedIds.has(idOf(featured))} joined={joinedIds.has(idOf(featured)) || userJoined(featured, userId)} onSave={saveExperience} onJoin={joinExperience} /></div>}
        <Rail title="Populares cerca" items={popularNear} userId={userId} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <EditorialBanner />
        <Rail title="Para hoy" items={today} userId={userId} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
        <Rail title="Con amigos" items={friends} userId={userId} savedIds={savedIds} joinedIds={joinedIds} onSave={saveExperience} onJoin={joinExperience} />
      </section>
      <CitySheet open={cityOpen} onClose={() => setCityOpen(false)} currentUser={user} currentCity={filters.city} onSave={(city) => setFilters((prev) => ({ ...prev, city }))} />
    </main>
  );
}
