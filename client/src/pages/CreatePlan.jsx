import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FiCamera, FiCheck, FiMapPin, FiPlus, FiX } from 'react-icons/fi';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser } from '../lib/auth';

const categories = ['Night', 'Food', 'Chill', 'Adventure', 'Culture', 'Art', 'Outdoor', 'Hidden'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const cities = ['Montevideo', 'Punta del Este', 'Buenos Aires'];
const barrios = ['Ciudad Vieja', 'Pocitos', 'Parque Rodó', 'Cordón', 'Carrasco', 'Centro'];
const fallback = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=85';

function MapPicker({ open, onClose, onSelect }) {
  const options = [
    { barrio: 'Ciudad Vieja', location: 'Plaza Zabala', lat: -34.9065, lng: -56.2049 },
    { barrio: 'Pocitos', location: 'Rambla de Pocitos', lat: -34.9169, lng: -56.1498 },
    { barrio: 'Parque Rodó', location: 'Lago del Parque Rodó', lat: -34.9129, lng: -56.1649 },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" aria-label="Cerrar mapa" />
          <motion.div initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 rounded-t-[2rem] border border-white/10 bg-[#0b0b0b] p-5 pb-8 text-white">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/18" />
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Elegí ubicación</h2>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button>
            </div>
            <div className="relative mt-5 h-64 overflow-hidden rounded-[1.6rem] bg-[#111]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(30deg,#222 12%,transparent 12.5%,transparent 87%,#222 87.5%,#222),linear-gradient(150deg,#222 12%,transparent 12.5%,transparent 87%,#222 87.5%,#222)', backgroundSize: '78px 132px' }} />
              {options.map((item, index) => (
                <button key={item.location} onClick={() => { onSelect(item); onClose(); }} className="absolute grid h-12 w-12 place-items-center rounded-full bg-[#C8FF3D]/20 text-[#C8FF3D]" style={{ left: `${24 + index * 22}%`, top: `${32 + index * 13}%` }}>
                  <FiMapPin fill="currentColor" />
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {options.map((item) => <button key={item.location} onClick={() => { onSelect(item); onClose(); }} className="w-full rounded-2xl bg-white/[0.06] px-4 py-3 text-left text-sm font-semibold">{item.location} · {item.barrio}</button>)}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CreatePlan() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(1);
  const [mapOpen, setMapOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [form, setForm] = useState({
    category: 'Night',
    images: [fallback],
    title: '',
    description: '',
    city: user?.city || user?.ciudad || 'Montevideo',
    neighborhood: '',
    location: '',
    date: '',
    time: '',
    company: 'Amigos',
    price: '$$',
    tags: ['popular', 'mova'],
    lat: null,
    lng: null,
  });

  const cover = form.images[0] || fallback;
  const progress = useMemo(() => `${step * 25}%`, [step]);
  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  const next = () => setStep((value) => Math.min(value + 1, 4));
  const prev = () => (step === 1 ? navigate('/home') : setStep((value) => Math.max(value - 1, 1)));
  const addImage = () => {
    if (!imageUrl.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl('');
  };
  const removeImage = (image) => setForm((prev) => ({ ...prev, images: prev.images.filter((item) => item !== image) }));

  const publish = async () => {
    const required = ['title', 'description', 'neighborhood', 'date', 'time'];
    if (required.some((field) => !String(form[field] || '').trim()) || form.images.length === 0) {
      setMessage('Completá los campos obligatorios.');
      return;
    }
    const created = await apiRequest('/experiences', {
      method: 'POST',
      body: JSON.stringify({ ...form, image: cover, authorId: user?.id, author: user?.nombre }),
    });
    setMessage('Experiencia publicada correctamente.');
    window.setTimeout(() => navigate(`/plan/${created.id}`), 450);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden px-5 pb-28 pt-7">
        <header className="flex items-center justify-between">
          <button onClick={prev} className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07] text-xl"><IoArrowBack /></button>
          <div className="text-right">
            <p className="text-xs text-white/38">Paso {step} de 4</p>
            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: progress }} className="h-full rounded-full bg-[#C8FF3D]" /></div>
          </div>
        </header>

        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
          {step === 1 && (
            <>
              <h1 className="text-[2rem] font-semibold leading-tight tracking-[0.005em]">¿Qué tipo de experiencia querés compartir?</h1>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {categories.map((type) => (
                  <motion.button whileTap={{ scale: 0.96 }} key={type} onClick={() => setForm((prev) => ({ ...prev, category: type, tags: Array.from(new Set([...prev.tags, type.toLowerCase()])) }))} className={`relative h-28 overflow-hidden rounded-[1.4rem] border p-4 text-left font-semibold ${form.category === type ? 'border-[#C8FF3D] bg-[#C8FF3D]/10 text-[#D9FF73]' : 'border-white/10 bg-white/[0.06] text-white'}`}>
                    <span className="absolute bottom-4 left-4">{type}</span>
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[2rem] font-semibold">Agregá fotos</h1>
              <p className="mt-2 text-sm text-white/52">Pegá varias URLs. Queda listo para reemplazar por Cloudinary más adelante.</p>
              <div className="mt-5 flex gap-2">
                <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="URL de imagen" className="h-12 flex-1 rounded-2xl bg-white/[0.07] px-4 text-sm outline-none placeholder:text-white/35" />
                <button onClick={addImage} className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C8FF3D] text-black"><FiPlus /></button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {form.images.map((image) => (
                  <div key={image} className="relative h-36 overflow-hidden rounded-2xl">
                    <img src={image} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removeImage(image)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55"><FiX /></button>
                  </div>
                ))}
                <button onClick={() => setImageUrl(fallback)} className="grid h-36 place-items-center rounded-2xl border border-dashed border-white/18 bg-white/[0.045] text-white/45"><FiCamera /></button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-[2rem] font-semibold">Contanos más</h1>
              <div className="mt-5 space-y-3">
                <input value={form.title} onChange={update('title')} placeholder="Título" className="w-full rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none placeholder:text-white/35" />
                <textarea value={form.description} onChange={update('description')} placeholder="Descripción editorial del plan" rows="4" className="w-full resize-none rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none placeholder:text-white/35" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={form.city} onChange={update('city')} className="rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none">{cities.map((city) => <option key={city}>{city}</option>)}</select>
                  <input list="barrios" value={form.neighborhood} onChange={update('neighborhood')} placeholder="Barrio" className="rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none placeholder:text-white/35" />
                  <datalist id="barrios">{barrios.map((item) => <option key={item} value={item} />)}</datalist>
                </div>
                <button onClick={() => setMapOpen(true)} className="flex w-full items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3.5 text-left text-sm text-white/74"><FiMapPin className="text-[#C8FF3D]" /> {form.location || 'Seleccionar ubicación en mapa'}</button>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={form.date} onChange={update('date')} className="rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none" />
                  <input type="time" value={form.time} onChange={update('time')} className="rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-white/62">Compañía ideal</p>
                  <div className="flex flex-wrap gap-2">{companies.map((item) => <button key={item} onClick={() => setForm((prev) => ({ ...prev, company: item }))} className={`rounded-full px-4 py-2 text-xs font-semibold ${form.company === item ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white/68'}`}>{item}</button>)}</div>
                </div>
                <select value={form.price} onChange={update('price')} className="w-full rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm outline-none"><option>$</option><option>$$</option><option>$$$</option></select>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="text-[2rem] font-semibold">Preview</h1>
              <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.06]">
                <img src={cover} alt="" className="h-64 w-full object-cover" />
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8FF3D]">{form.category}</p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight">{form.title || 'Título de la experiencia'}</h2>
                  <p className="mt-2 text-sm text-white/55">{form.neighborhood || 'Barrio'} · {form.time || '21:00'} · {form.company}</p>
                  <p className="mt-4 text-sm leading-relaxed text-white/68">{form.description || 'Descripción de la experiencia.'}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {message && <p className="mt-5 rounded-2xl bg-[#C8FF3D]/10 px-4 py-3 text-sm font-semibold text-[#D9FF73]">{message}</p>}
        <motion.button whileTap={{ scale: 0.98 }} onClick={step === 4 ? publish : next} className="mt-6 h-14 w-full rounded-full bg-[#C8FF3D] font-bold text-black">
          {step === 4 ? 'Publicar experiencia' : 'Siguiente'}
        </motion.button>
      </section>
      <MapPicker open={mapOpen} onClose={() => setMapOpen(false)} onSelect={(place) => setForm((prev) => ({ ...prev, ...place }))} />
    </main>
  );
}
