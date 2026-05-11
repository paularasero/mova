import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const types = ['Night', 'Food', 'Chill', 'Adventure', 'Culture', 'Art', 'Aire libre', 'Hidden'];
const fallbackImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85';

export default function CreatePlan() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    category: 'Night',
    image: fallbackImage,
    title: '',
    description: '',
    city: 'Montevideo',
    neighborhood: '',
    date: '',
    time: '',
    company: 'Amigos',
    price: '$$',
  });

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  const next = () => setStep((value) => Math.min(value + 1, 4));
  const prev = () => setStep((value) => Math.max(value - 1, 1));

  const publish = async () => {
    const required = ['title', 'description', 'neighborhood', 'date', 'time', 'image'];
    if (required.some((field) => !form[field].trim())) {
      setMessage('Completá los campos obligatorios.');
      return;
    }
    const created = await apiRequest('/experiences', {
      method: 'POST',
      body: JSON.stringify({ ...form, authorId: user?.id, author: user?.nombre }),
    });
    setMessage('Experiencia publicada correctamente.');
    window.setTimeout(() => navigate(`/plan/${created.id}`), 500);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <button onClick={prev} className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07]"><IoArrowBack /></button>
          <p className="text-sm text-white/45">Paso {step} de 4</p>
        </header>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold tracking-[-0.01em]">¿Qué tipo de experiencia querés compartir?</h1>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {types.map((type) => (
                  <button key={type} onClick={() => setForm((prev) => ({ ...prev, category: type }))} className={`relative h-24 overflow-hidden rounded-2xl border ${form.category === type ? 'border-[#C8FF3D]' : 'border-white/10'} bg-white/[0.06] p-4 text-left font-semibold`}>
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold">Agregá fotos</h1>
              <p className="mt-2 text-sm text-white/55">Pegá una URL de imagen por ahora.</p>
              <input value={form.image} onChange={update('image')} className="mt-5 w-full rounded-2xl bg-white/[0.07] px-4 py-4 text-sm outline-none" />
              <img src={form.image || fallbackImage} alt="" className="mt-4 h-56 w-full rounded-[1.5rem] object-cover" />
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-3xl font-bold">Contanos más</h1>
              <div className="mt-5 space-y-3">
                {[
                  ['title', 'Título'],
                  ['description', 'Descripción'],
                  ['city', 'Ciudad'],
                  ['neighborhood', 'Barrio / ubicación'],
                  ['date', 'Fecha'],
                  ['time', 'Hora'],
                  ['company', 'Compañía recomendada'],
                  ['price', 'Precio aproximado'],
                ].map(([field, label]) => (
                  <input key={field} value={form[field]} onChange={update(field)} placeholder={label} className="w-full rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none placeholder:text-white/35" />
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-3xl font-bold">Preview</h1>
              <div className="mt-5 overflow-hidden rounded-[1.5rem] bg-white/[0.07]">
                <img src={form.image || fallbackImage} alt="" className="h-56 w-full object-cover" />
                <div className="p-4">
                  <h2 className="text-2xl font-bold">{form.title || 'Título de la experiencia'}</h2>
                  <p className="mt-2 text-sm text-white/60">{form.neighborhood || 'Montevideo'} · {form.time || '21:00'}</p>
                  <p className="mt-3 text-sm text-white/70">{form.description || 'Descripción de la experiencia.'}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {message && <p className="mt-5 rounded-2xl bg-[#C8FF3D]/10 px-4 py-3 text-sm font-semibold text-[#D9FF73]">{message}</p>}
        <button onClick={step === 4 ? publish : next} className="mt-6 h-14 w-full rounded-full bg-[#C8FF3D] font-bold text-black">
          {step === 4 ? 'Publicar experiencia' : 'Siguiente'}
        </button>
      </section>
    </main>
  );
}
