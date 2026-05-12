import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiArrowLeft, FiBookmark, FiChevronDown, FiClock, FiHeart, FiMapPin, FiNavigation, FiSearch, FiSliders } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const MONTEVIDEO = [-34.9011, -56.1645];
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

const limeIcon = L.divIcon({
  className: '',
  html: '<div style="width:34px;height:34px;border-radius:999px;background:#C8FF3D;box-shadow:0 0 0 8px rgba(200,255,61,.16),0 12px 30px rgba(0,0,0,.32);display:grid;place-items:center;color:#111;font-weight:900;border:2px solid rgba(0,0,0,.18)">•</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18],
});

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

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  return null;
}

function ExperiencePopup({ experience, onSave }) {
  return (
    <div className="w-56 overflow-hidden rounded-2xl bg-[var(--mova-surface)] text-[var(--mova-text)]">
      <img src={experience.image} alt="" className="h-28 w-full object-cover" />
      <div className="p-3">
        <h3 className="text-sm font-bold leading-tight">{experience.title}</h3>
        <p className="mt-1 text-xs opacity-60">{experience.neighborhood} · {experience.city}</p>
        <p className="mt-2 text-xs font-semibold text-[#78a000]">{experience.category}</p>
        <div className="mt-3 flex gap-2">
          <Link to={`/plan/${experience.id}`} className="flex-1 rounded-full bg-[#C8FF3D] px-3 py-2 text-center text-xs font-bold text-black">Ver plan</Link>
          <button onClick={() => onSave(experience.id)} className="grid h-8 w-8 place-items-center rounded-full bg-black/10 text-[#78a000]"><FiBookmark /></button>
        </div>
      </div>
    </div>
  );
}

export default function Map() {
  const user = getCurrentUser();
  const city = user?.city || user?.ciudad || 'Montevideo';
  const [experiences, setExperiences] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [message, setMessage] = useState('');
  const center = cityCenter(city);

  useEffect(() => {
    apiRequest(`/experiences?city=${encodeURIComponent(city)}`)
      .then((data) => {
        setExperiences(data);
        setSelected(data[0] || null);
      })
      .catch(() => setExperiences([]));
  }, [city]);

  const filtered = useMemo(() => experiences.filter((experience) => {
    const text = `${experience.title} ${experience.neighborhood} ${experience.location} ${experience.category} ${(experience.tags || []).join(' ')}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase()))
      && (activeCategory === 'Todos' || String(experience.category || '').toLowerCase().includes(activeCategory.toLowerCase()));
  }), [experiences, query, activeCategory]);

  const save = async (id) => {
    if (!user?.id) return;
    const data = await apiRequest(`/experiences/${id}/save`, { method: 'POST', body: JSON.stringify({ userId: user.id }) });
    setMessage(data.message);
  };

  return (
    <main className="mova-screen">
      <section className="relative mova-mobile h-screen overflow-hidden pb-24">
        <MapContainer center={center} zoom={13} scrollWheelZoom className="absolute inset-0 z-0 h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter center={center} />
          {filtered.map((experience, index) => (
            <Marker key={experience.id} position={getCoords(experience, index)} icon={limeIcon} eventHandlers={{ click: () => setSelected(experience) }}>
              <Popup closeButton={false} className="mova-leaflet-popup">
                <ExperiencePopup experience={experience} onSave={save} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-black/64 to-transparent" />
        <header className="pointer-events-auto relative z-20 flex items-center justify-between px-5 pt-7 text-white">
          <Link to="/home" className="grid h-11 w-11 place-items-center rounded-full bg-black/36 text-xl backdrop-blur-xl"><FiArrowLeft /></Link>
          <button className="inline-flex h-11 items-center gap-2 rounded-full bg-black/42 px-5 text-sm font-bold backdrop-blur-xl">{city}<FiChevronDown className="text-[#C8FF3D]" /></button>
          <div className="flex gap-2">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-black/36 text-xl backdrop-blur-xl"><FiNavigation /></button>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-black/36 text-xl backdrop-blur-xl"><FiSliders /></button>
          </div>
        </header>

        <div className="pointer-events-auto relative z-20 mx-5 mt-4 flex h-12 items-center gap-3 rounded-full bg-black/42 px-4 text-sm text-white backdrop-blur-xl">
          <FiSearch className="text-[#C8FF3D]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el mapa" className="w-full bg-transparent outline-none placeholder:text-white/60" />
        </div>
        <div className="pointer-events-auto relative z-20 mx-5 mt-3 flex gap-2 overflow-x-auto">
          {['Todos', 'Night', 'Food', 'Chill', 'Outdoor', 'Música'].map((chip) => (
            <button key={chip} onClick={() => setActiveCategory(chip)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-xl ${activeCategory === chip ? 'bg-[#C8FF3D] text-black' : 'bg-black/36 text-white'}`}>{chip}</button>
          ))}
        </div>

        {selected && (
          <motion.div key={selected.id} initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-56 left-4 right-4 z-20 rounded-[1.6rem] border border-white/10 bg-[var(--mova-surface)]/95 p-3 text-[var(--mova-text)] shadow-[0_22px_60px_rgba(0,0,0,.24)] backdrop-blur-2xl">
            <div className="flex gap-3">
              <Link to={`/plan/${selected.id}`} className="flex min-w-0 flex-1 gap-3">
                <img src={selected.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold leading-tight">{selected.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs opacity-55"><FiMapPin /> {selected.location || selected.neighborhood}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] opacity-65"><span className="flex items-center gap-1"><FiClock /> {selected.date || selected.fecha} · {selected.time || selected.horario}</span><span>{selected.category}</span></div>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs font-bold">Más tarde</button>
                    <button className="rounded-full bg-[#C8FF3D] px-3 py-1.5 text-xs font-bold text-black">Voy</button>
                  </div>
                </div>
              </Link>
              <button onClick={() => save(selected.id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#C8FF3D]/18 text-[#78a000]"><FiHeart /></button>
            </div>
            {message && <p className="mt-3 text-xs font-semibold text-[#78a000]">{message}</p>}
          </motion.div>
        )}

        <section className="absolute bottom-24 left-0 right-0 z-20 px-5">
          <h3 className="mb-3 text-sm font-semibold text-white drop-shadow">Planes cerca de ti</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {filtered.slice(0, 8).map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className={`photo-card relative h-28 w-44 shrink-0 overflow-hidden rounded-2xl border text-left ${selected?.id === item.id ? 'border-[#C8FF3D]' : 'border-white/10'}`}>
                <img src={item.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/82" />
                <span className="absolute bottom-7 left-3 right-3 line-clamp-1 text-xs font-semibold text-white">{item.title}</span>
                <span className="absolute bottom-3 left-3 right-3 line-clamp-1 text-[10px] text-white/65">{item.neighborhood} · {item.category}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="absolute left-5 top-40 z-20 rounded-full bg-black/42 px-3 py-2 text-xs text-white/80 backdrop-blur-xl">
          <FiMapPin className="mr-1 inline text-[#C8FF3D]" /> {filtered.length} planes
        </div>
      </section>
    </main>
  );
}
