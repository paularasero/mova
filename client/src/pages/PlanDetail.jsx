import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiClock, FiHeart, FiMapPin, FiSend, FiShare2, FiStar } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

export default function PlanDetail() {
  const { id } = useParams();
  const user = getCurrentUser();
  const [experience, setExperience] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [comment, setComment] = useState('');
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

  const save = async () => {
    const data = await apiRequest(`/experiences/${id}/save`, {
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
      body: JSON.stringify({ userId: user?.id, userName: user?.nombre, text: comment }),
    });
    setExperience(data);
    setComment('');
    setMessage('Comentario publicado.');
  };

  if (!experience) {
    return <main className="mova-screen p-6 mova-muted">Cargando experiencia...</main>;
  }

  const saved = experience.savedBy?.includes(user?.id);
  const chips = ['Popular', '2 km', experience.category, experience.company, ...(experience.tags || []).slice(0, 2)];

  return (
    <main className="mova-screen">
      <section className="mova-mobile pb-28">
        <div className="relative h-[24rem] overflow-hidden rounded-b-[2.2rem]">
          <motion.div className="flex h-full" animate={{ x: `-${activeImage * 100}%` }} transition={{ type: 'spring', damping: 28, stiffness: 220 }}>
            {gallery.map((image) => (
              <img key={image} src={image} alt="" className="h-full w-full shrink-0 object-cover" />
            ))}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-black/8 to-black/42" />
          <div className="absolute left-5 right-5 top-7 flex items-center justify-between">
            <Link to="/home" className="grid h-11 w-11 place-items-center rounded-full bg-black/38 text-xl backdrop-blur-xl"><IoArrowBack /></Link>
            <div className="flex gap-2">
              <button className="grid h-11 w-11 place-items-center rounded-full bg-black/38 backdrop-blur-xl"><FiShare2 /></button>
              <button onClick={save} className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-black backdrop-blur-xl"><FiHeart fill={saved ? 'currentColor' : 'none'} /></button>
            </div>
          </div>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
            {gallery.map((image, index) => (
              <button key={image} onClick={() => setActiveImage(index)} className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-9 bg-white' : 'w-6 bg-white/42'}`} aria-label={`Foto ${index + 1}`} />
            ))}
          </div>
        </div>

        <div className="px-5 pt-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {chips.filter(Boolean).map((item) => (
              <span key={item} className="shrink-0 rounded-2xl bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/74">{item}</span>
            ))}
          </div>

          <section className="mt-5 rounded-[1.55rem] border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-[2rem] font-semibold leading-[1.04] tracking-[0.005em]">{experience.title}</h1>
              <p className="shrink-0 text-xl font-semibold text-[#C8FF3D]">{experience.price}</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-white/62">
              <p className="flex items-center gap-2"><FiClock className="text-[#C8FF3D]" /> {experience.date} · {experience.time}</p>
              <p className="flex items-center gap-2"><FiMapPin className="text-[#C8FF3D]" /> {experience.location || experience.neighborhood}, {experience.city}</p>
              <p className="flex items-center gap-2"><FiStar className="text-[#C8FF3D]" /> Ideal para {experience.company}</p>
            </div>
          </section>

          {message && <p className="mt-4 rounded-2xl bg-[#C8FF3D]/10 px-4 py-3 text-sm font-semibold text-[#D9FF73]">{message}</p>}

          <section className="mt-7">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/68">{experience.description}</p>
            <p className="mt-4 text-sm text-white/42">Publicado por <span className="text-white/80">{experience.author}</span></p>
          </section>

          <div className="mt-6 flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={save} className="h-14 flex-1 rounded-full bg-[#C8FF3D] text-sm font-bold text-black">
              {saved ? 'Quitar de guardadas' : 'Guardar experiencia'}
            </motion.button>
            <button onClick={like} className="flex h-14 items-center gap-2 rounded-full bg-white/[0.08] px-4 text-sm font-semibold text-white"><FiHeart /> {experience.likes}</button>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Fotos</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button key={image} onClick={() => setActiveImage(index)} className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Comentarios</h2>
            <form onSubmit={sendComment} className="mt-3 flex gap-2">
              <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Sumá tu comentario..." className="h-12 flex-1 rounded-full bg-white/[0.07] px-4 text-sm text-white outline-none placeholder:text-white/35" />
              <button className="grid h-12 w-12 place-items-center rounded-full bg-[#C8FF3D] text-black"><FiSend /></button>
            </form>
            <div className="mt-4 space-y-3">
              {(experience.comments || []).map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/[0.055] p-3">
                  <p className="text-sm font-semibold">{item.userName}</p>
                  <p className="mt-1 text-sm text-white/62">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Experiencias similares</h2>
              <span className="text-xs text-white/42">Ver todo</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {similar.map((item) => (
                <Link key={item.id} to={`/plan/${item.id}`} className="relative h-40 w-44 shrink-0 overflow-hidden rounded-2xl">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
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
