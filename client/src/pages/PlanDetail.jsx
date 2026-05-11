import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiBookmark, FiHeart, FiMapPin, FiSend, FiShare2 } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

export default function PlanDetail() {
  const { id } = useParams();
  const user = getCurrentUser();
  const [experience, setExperience] = useState(null);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const load = () => apiRequest(`/experiences/${id}`).then(setExperience).catch(() => setMessage('No se pudo cargar la experiencia.'));

  useEffect(() => {
    load();
  }, [id]);

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
    return <main className="min-h-screen bg-[#050505] p-6 text-white/60">Cargando experiencia...</main>;
  }

  const saved = experience.savedBy?.includes(user?.id);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] pb-28">
        <div className="relative h-[27rem] overflow-hidden">
          <img src={experience.image} alt={experience.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-[#050505]" />
          <div className="absolute left-5 right-5 top-7 flex items-center justify-between">
            <Link to="/home" className="grid h-11 w-11 place-items-center rounded-full bg-black/35 backdrop-blur-xl"><IoArrowBack /></Link>
            <div className="flex gap-2">
              <button className="grid h-11 w-11 place-items-center rounded-full bg-black/35 backdrop-blur-xl"><FiShare2 /></button>
              <button onClick={save} className="grid h-11 w-11 place-items-center rounded-full bg-black/35 text-[#C8FF3D] backdrop-blur-xl"><FiBookmark fill={saved ? 'currentColor' : 'none'} /></button>
            </div>
          </div>
          <div className="absolute bottom-8 left-5 right-5">
            <h1 className="text-4xl font-bold leading-[1.02] tracking-[-0.02em]">{experience.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70"><FiMapPin /> {experience.neighborhood}, {experience.city}</p>
          </div>
        </div>

        <div className="px-5">
          <div className="flex flex-wrap gap-2">
            {[experience.date, experience.time, experience.category, experience.company].map((item) => (
              <span key={item} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white/72">{item}</span>
            ))}
          </div>

          <p className="mt-6 text-[0.95rem] leading-relaxed text-white/74">{experience.description}</p>
          <p className="mt-4 text-sm text-white/48">Publicado por <span className="text-white">{experience.author}</span></p>
          {message && <p className="mt-4 rounded-2xl bg-[#C8FF3D]/10 px-4 py-3 text-sm font-semibold text-[#D9FF73]">{message}</p>}

          <div className="mt-6 flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={save} className="h-14 flex-1 rounded-full bg-[#C8FF3D] text-sm font-bold text-black">
              {saved ? 'Quitar de guardadas' : 'Guardar experiencia'}
            </motion.button>
            <button onClick={like} className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.08] text-white"><FiHeart /> {experience.likes}</button>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Fotos de la comunidad</h2>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {[experience.image, experience.image, experience.image].map((image, index) => (
                <img key={index} src={image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold">Comentarios</h2>
            <form onSubmit={sendComment} className="mt-3 flex gap-2">
              <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Sumá tu comentario..." className="flex-1 rounded-full bg-white/[0.07] px-4 text-sm text-white outline-none placeholder:text-white/35" />
              <button className="grid h-11 w-11 place-items-center rounded-full bg-[#C8FF3D] text-black"><FiSend /></button>
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
        </div>
      </section>
    </main>
  );
}
