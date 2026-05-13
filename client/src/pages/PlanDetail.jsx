import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { FiBookmark, FiCalendar, FiCloud, FiHeart, FiMapPin, FiSend, FiShare2, FiStar, FiUsers } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const MONTEVIDEO = [-34.9011, -56.1645];
const fallbackAvatar = 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MOVAHost&backgroundColor=ff74c8,67c8ff,ffd84d';
const fallbackReviewPhoto = 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80';

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="width:28px;height:28px;border-radius:13px 13px 13px 5px;background:#ff74c8;transform:rotate(-10deg);display:grid;place-items:center;border:1.5px solid rgba(255,255,255,.86);box-shadow:0 0 0 8px rgba(255,116,200,.14),0 14px 30px rgba(0,0,0,.3)"><span style="width:11px;height:8px;border-radius:999px;background:#0b0b0f;display:block;transform:rotate(25deg)"></span></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function coordsOf(experience) {
  const lat = Number(experience?.lat);
  const lng = Number(experience?.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : MONTEVIDEO;
}

function imageOf(item) {
  return item?.image || item?.imagen || item?.images?.[0] || fallbackReviewPhoto;
}

function interestedOf(item) {
  return item?.interestedCount ?? item?.joinedUsers?.length ?? item?.saves ?? 0;
}

function MiniMap({ experience }) {
  const center = coordsOf(experience);
  return (
    <div className="mt-4 h-44 overflow-hidden rounded-[1rem] border border-white/10">
      <MapContainer center={center} zoom={14} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} className="h-full w-full">
        <TileLayer attribution="" url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Marker position={center} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}

function Stars({ value = 5, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange?.(star)} className={onChange ? 'text-lg' : 'pointer-events-none text-sm'}>
          <FiStar fill={star <= value ? 'currentColor' : 'none'} className={star <= value ? 'text-[#D8C98F]' : 'text-white/24'} />
        </button>
      ))}
    </div>
  );
}

export default function PlanDetail() {
  const { id } = useParams();
  const user = getCurrentUser();
  const [experience, setExperience] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiRequest(`/experiences/${id}`)
      .then((data) => {
        setExperience(data);
        setActiveImage(0);
        return apiRequest('/experiences');
      })
      .then((items) => setSimilar(items.filter((item) => item.id !== id).slice(0, 4)))
      .catch(() => setMessage('No se pudo cargar la experiencia.'));
  }, [id]);

  const gallery = useMemo(() => {
    if (!experience) return [];
    return experience.images?.length ? experience.images : [experience.image].filter(Boolean);
  }, [experience]);

  if (!experience) {
    return <main className="mova-screen p-6 mova-muted">Cargando experiencia...</main>;
  }

  const saved = experience.savedBy?.includes(user?.id);
  const joined = experience.joinedUsers?.includes(user?.id);
  const comments = experience.comments || [];
  const hostSeed = encodeURIComponent(experience.author || 'MOVA host');
  const hostAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${hostSeed}&backgroundColor=ff74c8,67c8ff,ffd84d`;

  const save = async () => {
    const data = await apiRequest(`/experiences/${id}/save`, {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id }),
    });
    setExperience(data.experience);
    setMessage(data.message);
  };

  const join = async () => {
    const data = await apiRequest(`/experiences/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id }),
    });
    setExperience(data.experience);
    setMessage(data.message);
  };

  const like = async () => {
    const data = await apiRequest(`/experiences/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id }),
    });
    setExperience(data);
  };

  const sendComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    const data = await apiRequest(`/experiences/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({
        userId: user?.id,
        userName: user?.nombre || user?.name,
        text: comment,
        rating,
        photos: photoUrl.trim() ? [photoUrl.trim()] : [],
        avatar: user?.avatar,
      }),
    });
    setExperience(data);
    setComment('');
    setPhotoUrl('');
    setRating(5);
    setMessage('Comentario publicado.');
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile pb-32">
        <div className="relative mx-3 mt-3 h-[26rem] overflow-hidden rounded-[1.25rem]">
          <motion.div className="flex h-full" animate={{ x: `-${activeImage * 100}%` }} transition={{ type: 'spring', damping: 28, stiffness: 220 }}>
            {gallery.map((image) => (
              <img key={image} src={image} alt="" className="h-full w-full shrink-0 object-cover" />
            ))}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/82" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <Link to="/home" className="grid h-10 w-10 place-items-center rounded-[0.7rem] bg-black/42 text-xl backdrop-blur-xl"><IoArrowBack /></Link>
            <div className="flex gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-[0.7rem] bg-black/42 backdrop-blur-xl"><FiShare2 /></button>
              <button onClick={save} className="grid h-10 w-10 place-items-center rounded-[0.7rem] bg-white/92 text-black backdrop-blur-xl"><FiBookmark fill={saved ? 'currentColor' : 'none'} /></button>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9eb8a0]">{experience.neighborhood} · {experience.category}</p>
            <h1 className="max-w-[19rem] text-[2.35rem] font-semibold leading-[1.02] tracking-[0.005em] text-white">{experience.title}</h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-[0.55rem] bg-white px-3 py-1.5 text-xs font-black text-[#0B0B0F]">★ {experience.rating || 4.8}</span>
              <span className="rounded-[0.55rem] bg-black/42 px-3 py-1.5 text-xs font-semibold text-white/78 backdrop-blur-md">{interestedOf(experience)} personas</span>
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="absolute bottom-5 right-5 flex gap-2">
              {gallery.map((image, index) => (
                <button key={image} onClick={() => setActiveImage(index)} className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-8 bg-white' : 'w-4 bg-white/38'}`} aria-label={`Foto ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        <div className="px-5 pt-6">
          <section className="grid gap-3 rounded-[1rem] bg-white/[0.045] p-4 ring-1 ring-white/10">
            <div className="grid grid-cols-2 gap-3 text-sm text-white/68">
              <p className="flex items-center gap-2"><FiCalendar className="text-white/38" /> {experience.date}</p>
              <p className="flex items-center gap-2"><FiCloud className="text-white/38" /> Noche fresca</p>
              <p className="flex items-center gap-2"><FiMapPin className="text-white/38" /> {experience.location || experience.neighborhood}</p>
              <p className="flex items-center gap-2"><FiUsers className="text-white/38" /> {experience.company}</p>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm text-white/48">{experience.time} · {experience.price || '$'}</span>
              <button onClick={like} className="inline-flex items-center gap-2 rounded-[0.65rem] bg-white/[0.07] px-3 py-2 text-sm font-semibold text-white/78"><FiHeart /> {experience.likes}</button>
            </div>
          </section>

          {message && <p className="mt-4 rounded-[0.85rem] bg-white/[0.06] px-4 py-3 text-sm font-semibold text-[#D8C98F]">{message}</p>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={join}
            style={{ backgroundColor: joined ? '#F5F5F5' : '#D97BAD', color: '#0B0B0F' }}
            className="mt-5 block h-14 w-full rounded-[0.95rem] text-base font-black shadow-[0_16px_38px_rgba(0,0,0,.22)] transition"
          >
            {joined ? 'Te sumaste' : 'Me sumo'}
          </motion.button>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">El plan</h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-white/66">{experience.description}</p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-white/54">
              La idea es caer sin presión, compartir mesa o ronda, sacar alguna foto, conocer gente con la misma energía y dejar que el plan vaya encontrando su ritmo.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-white/62">
              <span className="rounded-[0.65rem] bg-white/[0.055] px-2 py-3">Llevá abrigo</span>
              <span className="rounded-[0.65rem] bg-white/[0.055] px-2 py-3">Grupo abierto</span>
              <span className="rounded-[0.65rem] bg-white/[0.055] px-2 py-3">Fotos con flash</span>
            </div>
          </section>

          <section className="mt-8 rounded-[1rem] bg-white/[0.045] p-4 ring-1 ring-white/10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/38">Organiza</p>
            <div className="mt-4 flex items-center gap-3">
              <img src={hostAvatar || fallbackAvatar} alt="" className="h-14 w-14 rounded-[0.95rem] bg-white/[0.06] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{experience.author || 'MOVA host'}</p>
                <p className="mt-1 text-sm text-white/50">Jazz, cine y rooftops</p>
              </div>
              <button className="rounded-[0.65rem] border border-white/10 px-3 py-2 text-xs font-black text-white/70">Seguir</button>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Ubicación</h2>
            <p className="mt-2 text-sm text-white/50">{experience.location || experience.neighborhood}, {experience.city}</p>
            <MiniMap experience={experience} />
          </section>

          <section className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold">La gente comentó</h2>
                <p className="mt-1 text-sm text-white/42">{comments.length || experience.commentCount || 0} experiencias compartidas</p>
              </div>
              <Stars value={Math.round(experience.rating || 5)} />
            </div>

            <form onSubmit={sendComment} className="mt-5 rounded-[1rem] bg-white/[0.045] p-4 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Tu experiencia</p>
                <Stars value={rating} onChange={setRating} />
              </div>
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Contá cómo estuvo, con quién fuiste o qué llevar..." rows="3" className="mt-3 w-full resize-none rounded-[0.8rem] bg-white/[0.06] px-4 py-3 text-sm outline-none placeholder:text-white/34" />
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setPhotoUrl(fallbackReviewPhoto)} className="h-11 rounded-[0.75rem] bg-white/[0.07] px-4 text-sm font-semibold text-white/68">Subir foto</button>
                <button type="button" onClick={() => setPhotoUrl(fallbackReviewPhoto)} className="h-11 rounded-[0.75rem] bg-white/[0.07] px-4 text-sm font-semibold text-white/68">Galería</button>
                <button className="ml-auto inline-flex h-11 items-center gap-2 rounded-[0.75rem] bg-white px-4 text-sm font-black text-[#0B0B0F]"><FiSend /> Publicar</button>
              </div>
              {photoUrl && <p className="mt-2 text-xs font-semibold text-[#9BC27B]">Foto seleccionada</p>}
            </form>

            <div className="mt-5 space-y-4">
              {comments.map((item) => (
                <article key={item.id} className="rounded-[1rem] bg-white/[0.045] p-4 ring-1 ring-white/10">
                  <div className="flex items-start gap-3">
                    <img src={item.avatar || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(item.userName)}&backgroundColor=ff74c8`} alt="" className="h-11 w-11 rounded-[0.75rem] object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.userName}</p>
                          <p className="text-[11px] text-white/34">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-UY') : 'Hoy'}</p>
                        </div>
                        <Stars value={Number(item.rating) || 5} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-white/62">{item.text}</p>
                    </div>
                  </div>
                  {!!item.photos?.length && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 mova-scrollbar-none">
                      {item.photos.map((photo) => <img key={photo} src={photo} alt="" className="h-20 w-24 shrink-0 rounded-[0.75rem] object-cover" />)}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Planes similares</h2>
              <span className="text-xs text-white/42">Ver todo</span>
            </div>
            <div className="mova-scrollbar-none flex gap-3 overflow-x-auto pb-2">
              {similar.map((item) => (
                <Link key={item.id} to={`/plan/${item.id}`} className="relative h-40 w-44 shrink-0 overflow-hidden rounded-[1rem]">
                  <img src={imageOf(item)} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/78" />
                  <p className="absolute bottom-3 left-3 right-3 text-sm font-semibold leading-tight">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
