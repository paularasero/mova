import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiChevronDown, FiClock, FiHeart, FiMapPin, FiNavigation, FiSliders, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const MONTEVIDEO = [-34.9011, -56.1645];
const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia', 'Roma', 'Berlín', 'Lisboa', 'Tokio'];
const categories = ['Todos', 'Night', 'Food', 'Chill', 'Outdoor', 'Música', 'Arte'];
const categoryColors = {
  night: '#9D7BFF',
  food: '#FF7A2F',
  café: '#FFD84D',
  cafe: '#FFD84D',
  chill: '#67C8FF',
  outdoor: '#7DFF72',
  música: '#FF74C8',
  musica: '#FF74C8',
  arte: '#FFD84D',
  art: '#FFD84D',
};
const fallbackCoordinates = {
  rambla: [-34.9137, -56.1608],
  'parque rodó': [-34.9108, -56.1709],
  'parque rodo': [-34.9108, -56.1709],
  'ciudad vieja': [-34.9067, -56.2035],
  cordón: [-34.9027, -56.1786],
  cordon: [-34.9027, -56.1786],
  pocitos: [-34.9101, -56.1469],
  'punta carretas': [-34.9227, -56.1594],
  montevideo: MONTEVIDEO,
};

function categoryColor(category = '') {
  const normalized = String(category).toLowerCase();
  const match = Object.entries(categoryColors).find(([key]) => normalized.includes(key));
  return match?.[1] || '#7DFF72';
}

function makeIcon(category) {
  const color = categoryColor(category);
  return L.divIcon({
  className: '',
    html: `<div style="width:30px;height:30px;border-radius:13px 13px 13px 5px;background:${color};transform:rotate(-10deg);box-shadow:0 0 0 7px ${color}24,0 14px 30px rgba(0,0,0,.28);display:grid;place-items:center;border:1.5px solid rgba(245,245,245,.86)"><span style="width:12px;height:8px;border-radius:999px;background:#0B0B0F;display:block;transform:rotate(28deg) skewX(-12deg);opacity:.82"></span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function getCoords(experience, index = 0) {
  const lat = Number(experience.lat);
  const lng = Number(experience.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];

  const searchable = `${experience.location || ''} ${experience.neighborhood || experience.barrio || ''} ${experience.city || experience.ciudad || ''}`.toLowerCase();
  const match = Object.entries(fallbackCoordinates).find(([key]) => searchable.includes(key));
  if (match) return match[1];
  return [MONTEVIDEO[0] + index * 0.004, MONTEVIDEO[1] + index * 0.006];
}

function cityCenter(city = '') {
  const normalized = city.toLowerCase();
  if (normalized.includes('montevideo')) return MONTEVIDEO;
  if (normalized.includes('punta')) return [-34.936, -54.936];
  if (normalized.includes('buenos')) return [-34.6037, -58.3816];
  return MONTEVIDEO;
}

function distanceKm(from, to) {
  if (!from || !to) return null;
  const [lat1, lon1] = from.map(Number);
  const [lat2, lon2] = to.map(Number);
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;
  const radius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

function CityPicker({ open, value, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const filtered = cities.filter((city) => city.toLowerCase().includes(query.toLowerCase()));
  return (
    open && (
      <div className="mova-modal-wrap">
        <button className="mova-overlay" onClick={onClose} aria-label="Cerrar selector de ciudad" />
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.98 }} className="mova-modal relative z-10 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Ciudad</h2>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-[0.55rem] bg-white/[0.08]"><FiX /></button>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ciudad" className="mt-5 h-12 w-full rounded-[0.9rem] border border-white/10 bg-white/[0.06] px-4 text-sm outline-none placeholder:text-white/35" />
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto">
            {filtered.map((city) => (
              <button key={city} onClick={() => onSelect(city)} className={`flex w-full items-center justify-between rounded-[0.85rem] px-4 py-3 text-left text-sm font-semibold ${city === value ? 'bg-[#7DFF72] text-[#0B0B0F]' : 'bg-white/[0.06] text-white/78'}`}>
                {city}{city === value && <FiCheck />}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    )
  );
}

export default function Map() {
  const user = getCurrentUser();
  const initialCity = user?.city || user?.ciudad || 'Montevideo';
  const [city, setCity] = useState(initialCity);
  const [experiences, setExperiences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cityOpen, setCityOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [joinedIds, setJoinedIds] = useState(() => new Set());
  const [message, setMessage] = useState('');
  const fallbackCenter = cityCenter(city);
  const center = userLocation || fallbackCenter;

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setUserLocation([coords.latitude, coords.longitude]),
      () => setUserLocation(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    apiRequest(`/experiences?city=${encodeURIComponent(city)}`)
      .then((data) => {
        setExperiences(data);
        setSelected(data[0] || null);
        const joined = new Set(data.filter((item) => item.joinedUsers?.some((id) => String(id) === String(user?.id))).map((item) => item.id));
        setJoinedIds(joined);
      })
      .catch(() => setExperiences([]));
  }, [city, user?.id]);

  const filtered = useMemo(() => experiences
    .filter((experience) => activeCategory === 'Todos' || String(experience.category || '').toLowerCase().includes(activeCategory.toLowerCase()))
    .map((experience, index) => {
      const coords = getCoords(experience, index);
      return { ...experience, coords, distance: distanceKm(center, coords) };
    })
    .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999)), [experiences, activeCategory, center]);

  const save = async (id) => {
    if (!user?.id) return;
    const data = await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
    setMessage(data.message);
  };

  const join = async (id) => {
    if (!user?.id) return;
    const data = await apiRequest(`/experiences/${id}/join`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
    setExperiences((prev) => prev.map((item) => (item.id === id ? { ...item, ...data.experience } : item)));
    setSelected((prev) => (prev?.id === id ? { ...prev, ...data.experience } : prev));
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (data.joined) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <main className="mova-screen">
      <section className="relative mova-mobile h-screen overflow-hidden pb-24">
        <MapContainer center={center} zoom={13} zoomControl={false} scrollWheelZoom className="absolute inset-0 z-0 h-full w-full">
          <TileLayer attribution='&copy; OpenStreetMap &copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          <Recenter center={center} />
          {filtered.map((experience, index) => (
            <Marker key={experience.id} position={experience.coords || getCoords(experience, index)} icon={makeIcon(experience.category)} eventHandlers={{ click: () => setSelected(experience) }} />
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-black/68 to-transparent" />
        <header className="pointer-events-auto relative z-20 flex items-center justify-between px-5 pt-7 text-[var(--mova-text)]">
          <button onClick={() => setCityOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-[0.7rem] border border-white/10 bg-[#101015]/82 px-4 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(0,0,0,.24)] backdrop-blur-md">{city}<FiChevronDown className="text-[#7DFF72]" /></button>
          <div className="flex gap-2">
            <button onClick={requestLocation} className="grid h-10 w-10 place-items-center rounded-[0.7rem] border border-white/10 bg-white/90 text-lg text-[#0B0B0F] shadow-[0_12px_32px_rgba(0,0,0,.22)] backdrop-blur-md"><FiNavigation /></button>
            <button onClick={() => setFiltersOpen(true)} className="grid h-10 w-10 place-items-center rounded-[0.7rem] border border-white/10 bg-[#101015]/88 text-lg text-white/84 shadow-[0_12px_32px_rgba(0,0,0,.22)] backdrop-blur-md"><FiSliders /></button>
          </div>
        </header>

        {selected && (
          <motion.div key={selected.id} initial={{ y: -12, opacity: 0, filter: 'blur(8px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} className="absolute left-5 right-5 top-24 z-20 rounded-[1rem] border border-white/10 bg-[#111117]/92 p-2.5 text-[var(--mova-text)] shadow-[0_20px_55px_rgba(0,0,0,.32)] backdrop-blur-md">
            <div className="flex gap-3">
              <div className="flex min-w-0 flex-1 gap-3">
                <Link to={`/plan/${selected.id}`} className="shrink-0"><img src={selected.image} alt="" className="h-20 w-20 rounded-[0.85rem] object-cover" /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/plan/${selected.id}`}><h2 className="line-clamp-1 text-sm font-semibold leading-tight">{selected.title}</h2></Link>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-white/52"><FiMapPin /> {selected.neighborhood || selected.location}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-white/52"><FiClock /> {selected.date || selected.fecha || 'Hoy'} · {selected.time || selected.horario || '21:00'}</p>
                  <button type="button" onClick={() => join(selected.id)} className={`mt-2 rounded-[0.55rem] px-3 py-1.5 text-[11px] font-black ${joinedIds.has(selected.id) ? 'bg-[#67C8FF] text-[#0B0B0F]' : 'bg-[#7DFF72] text-[#0B0B0F]'}`}>{joinedIds.has(selected.id) ? 'Te sumaste' : 'Me sumo'}</button>
                </div>
              </div>
              <button onClick={() => save(selected.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.65rem] bg-[#FF74C8] text-[#0B0B0F]"><FiHeart /></button>
            </div>
            {message && <p className="mt-2 text-[11px] font-semibold text-[#7DFF72]">{message}</p>}
          </motion.div>
        )}

        <section className="absolute bottom-24 left-0 right-0 z-20 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white drop-shadow">Cerca tuyo</h3>
            <span className="rounded-[0.45rem] bg-[#FFD84D] px-2 py-1 text-[10px] font-black text-[#0B0B0F]">{filtered.length} planes</span>
          </div>
          <div className="mova-scrollbar-none flex gap-3 overflow-x-auto pb-1">
            {filtered.slice(0, 6).map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className={`photo-card relative h-24 w-40 shrink-0 overflow-hidden rounded-[1rem] border text-left ${selected?.id === item.id ? 'border-[#7DFF72]' : 'border-white/10'}`}>
                <img src={item.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/82" />
                <span className="absolute bottom-7 left-3 right-3 line-clamp-1 text-[12px] font-semibold text-white">{item.title}</span>
                <span className="absolute bottom-3 left-3 right-3 line-clamp-1 text-[10px] text-white/65">{item.distance ? `${item.distance.toFixed(1)} km · ` : ''}{item.category}</span>
              </button>
            ))}
          </div>
        </section>

        {filtersOpen && (
          <div className="mova-modal-wrap">
            <button className="mova-overlay" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros" />
            <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mova-modal relative z-10 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Filtros</h2>
                <button onClick={() => setFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-[0.55rem] bg-white/[0.08]"><FiX /></button>
              </div>
              <p className="mt-4 text-sm text-white/52">Categoría</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((chip) => (
                  <button key={chip} onClick={() => setActiveCategory(chip)} className={`rounded-[0.6rem] px-3 py-2 text-xs font-black ${activeCategory === chip ? 'bg-[#9D7BFF] text-white' : 'bg-white/[0.07] text-white/62'}`}>{chip}</button>
                ))}
              </div>
              <button onClick={() => setFiltersOpen(false)} className="mt-6 h-12 w-full rounded-[0.9rem] bg-[#7DFF72] text-sm font-black text-[#0B0B0F]">Aplicar filtros</button>
            </motion.div>
          </div>
        )}
        <CityPicker open={cityOpen} value={city} onClose={() => setCityOpen(false)} onSelect={(nextCity) => { setCity(nextCity); setCityOpen(false); setSelected(null); }} />
      </section>
    </main>
  );
}
