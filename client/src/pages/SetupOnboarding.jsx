import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FiCheck, FiMapPin, FiSearch, FiUpload, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const cities = ['Montevideo', 'Buenos Aires', 'Madrid', 'Barcelona', 'París', 'Londres', 'Nueva York', 'São Paulo', 'Santiago', 'Punta del Este', 'Colonia', 'Roma', 'Berlín', 'Lisboa', 'Tokio', 'Ciudad de México', 'Bogotá', 'Lima'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Rooftops', 'Outdoor', 'Hidden spots'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];
const avatars = [
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaLime&backgroundColor=c8ff3d',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaNight&backgroundColor=191919',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaSunset&backgroundColor=f97316',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaSky&backgroundColor=38bdf8',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaRose&backgroundColor=fb7185',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaViolet&backgroundColor=a78bfa',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaMint&backgroundColor=34d399',
  'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=MovaGold&backgroundColor=facc15',
];

function AvatarPicker({ open, onClose, value, onSelect }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="mova-overlay" aria-label="Cerrar avatares" />
          <div className="mova-modal-wrap">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 18 }} className="mova-modal relative z-10 overflow-hidden p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-[2rem] bg-[#FF74C8]/20 blur-xl" />
            <div className="pointer-events-none absolute -bottom-8 left-8 h-24 w-32 rotate-[-14deg] rounded-[1rem] bg-[#85B96B]/16 blur-lg" />
            <div className="relative flex items-center justify-between"><h2 className="text-2xl font-semibold">Tu avatar</h2><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-[0.55rem] bg-white/[0.08]"><FiX /></button></div>
            <p className="relative mt-2 text-sm text-white/52">Elegí un avatar gráfico o subí una imagen desde tu galería.</p>
            <div className="relative mt-5 grid grid-cols-4 gap-3">
              {avatars.map((avatar) => <button key={avatar} onClick={() => onSelect(avatar)} className={`grid h-16 place-items-center overflow-hidden rounded-[0.9rem] border ${value === avatar ? 'border-[#85B96B]' : 'border-white/10'} bg-white/[0.06]`}><img src={avatar} alt="" className="h-full w-full object-cover" /></button>)}
            </div>
            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-[0.85rem] bg-white/[0.07] px-3 py-4 text-sm font-semibold text-white/70"><FiUpload /> Galería</button>
              <button onClick={() => onSelect(avatars[0])} className="flex items-center justify-center gap-2 rounded-[0.85rem] bg-[#85B96B] px-3 py-4 text-sm font-black text-[#0B0B0F]"><FiUser /> Elegir avatar</button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function SetupOnboarding() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(1);
  const [cityQuery, setCityQuery] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    city: user?.city || user?.ciudad || 'Montevideo',
    favoriteCategories: [],
    company: [],
    birthday: '',
    avatar: user?.avatar || avatars[0],
  });

  const filteredCities = useMemo(() => cities.filter((city) => city.toLowerCase().includes(cityQuery.toLowerCase())), [cityQuery]);
  const toggle = (field, value) => setForm((prev) => ({ ...prev, [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value] }));

  const finish = async () => {
    setSaving(true);
    const updated = await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify({
        userId: user?.id,
        city: form.city,
        avatar: form.avatar,
        preferences: {
          favoriteCategories: form.favoriteCategories,
          company: form.company,
          birthday: form.birthday,
          setupComplete: true,
        },
      }),
    });
    setCurrentUser(updated);
    setSaving(false);
    navigate('/home');
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile relative flex flex-col overflow-hidden px-5 pb-8 pt-8">
        <div className="pointer-events-none absolute -right-16 top-24 h-48 w-48 rounded-[3rem] bg-[#9D7BFF]/12 blur-2xl" />
        <div className="pointer-events-none absolute -left-14 bottom-28 h-40 w-56 rotate-[-18deg] rounded-[1.5rem] bg-[#FF7A2F]/10 blur-xl" />
        <motion.div aria-hidden initial={false} animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute right-7 top-40 h-12 w-28 rounded-[0.75rem] bg-gradient-to-r from-[#67C8FF]/24 to-[#FF74C8]/24" />
        <header className="relative z-10">
          <p className="text-2xl font-bold">MOVA<span className="text-[var(--mova-accent)]">.</span></p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${step * 20}%` }} className="h-full rounded-full bg-[var(--mova-accent)]" /></div>
        </header>

        <motion.div key={step} initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} className="relative z-10 mt-10 flex-1">
          {step === 1 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Elegí tu ciudad base.</h1>
              <p className="mt-3 text-sm text-white/52">Podés buscar cualquier ciudad. La usamos para recomendar planes cerca.</p>
              <label className="mt-6 flex h-14 items-center gap-3 rounded-[0.9rem] bg-white/[0.07] px-4"><FiSearch className="text-white/45" /><input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Buscar ciudad" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" /></label>
              <button onClick={() => setForm((prev) => ({ ...prev, city: 'Montevideo' }))} className="mt-4 flex w-full items-center gap-3 rounded-[0.85rem] bg-[var(--mova-accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--mova-accent)]"><FiMapPin /> Usar ubicación actual</button>
              <div className="mt-4 max-h-[44vh] space-y-2 overflow-y-auto pb-2">{filteredCities.map((city) => <button key={city} onClick={() => setForm((prev) => ({ ...prev, city }))} className={`flex w-full items-center justify-between rounded-[0.85rem] px-4 py-3 text-left font-semibold ${form.city === city ? 'bg-[var(--mova-accent)] text-[#0B0B0F]' : 'bg-white/[0.07] text-white'}`}>{city}{form.city === city && <FiCheck />}</button>)}</div>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">¿Qué planes te gustan?</h1>
              <div className="mt-8 grid grid-cols-2 gap-3">{categories.map((item, index) => <button key={item} onClick={() => toggle('favoriteCategories', item)} className={`relative h-24 overflow-hidden rounded-[1rem] border text-sm font-semibold ${form.favoriteCategories.includes(item) ? 'border-[#85B96B] bg-[var(--mova-accent-soft)] text-[#9BC27B]' : 'border-white/10 bg-white/[0.07] text-white/70'}`}><span className={`absolute -right-3 -top-3 h-12 w-12 rounded-[0.75rem] ${index % 3 === 0 ? 'bg-[#FF8A3D]/20' : index % 3 === 1 ? 'bg-[#67C8FF]/18' : 'bg-[#FFD84D]/18'}`} />{item}</button>)}</div>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">¿Con quién solés salir?</h1>
              <div className="mt-8 space-y-3">{companies.map((item) => <button key={item} onClick={() => toggle('company', item)} className={`flex w-full items-center justify-between rounded-[1rem] px-5 py-5 text-left font-semibold ${form.company.includes(item) ? 'bg-[var(--mova-accent)] text-[#0B0B0F]' : 'bg-white/[0.07] text-white'}`}>{item}{form.company.includes(item) && <FiCheck />}</button>)}</div>
            </>
          )}
          {step === 4 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Tu cumpleaños.</h1>
              <p className="mt-3 text-sm text-white/52">Lo usamos para recomendaciones y momentos especiales.</p>
              <input type="date" value={form.birthday} onChange={(event) => setForm((prev) => ({ ...prev, birthday: event.target.value }))} className="mt-8 h-14 w-full rounded-[0.9rem] bg-white/[0.07] px-4 text-sm outline-none" />
            </>
          )}
          {step === 5 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Elegí tu foto.</h1>
              <p className="mt-3 text-sm text-white/52">Podés elegir un avatar gráfico o subir una imagen desde galería.</p>
              <button onClick={() => setAvatarOpen(true)} className="mt-8 flex w-full items-center gap-4 rounded-[1rem] bg-white/[0.07] p-4 text-left">
                <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-white/[0.07] text-2xl text-white/42">{form.avatar ? <img src={form.avatar} alt="" className="h-full w-full object-cover" /> : <FiUser />}</div>
                <div><p className="font-semibold">Cambiar avatar</p><p className="mt-1 text-sm text-white/45">Galería o avatar MOVA</p></div>
              </button>
            </>
          )}
        </motion.div>

        <div className="relative z-10 mt-8 flex gap-3">
          {step > 1 && <button onClick={() => setStep((value) => value - 1)} className="h-14 w-24 rounded-[0.85rem] bg-white/[0.08] font-semibold text-white/72">Atrás</button>}
          <motion.button whileTap={{ scale: 0.98 }} onClick={step === 5 ? finish : () => setStep((value) => value + 1)} disabled={saving} className="h-14 flex-1 rounded-[0.95rem] bg-[var(--mova-accent)] font-bold text-[#0B0B0F]">
            {step === 5 ? (saving ? 'Guardando...' : 'Entrar a MOVA') : 'Continuar'}
          </motion.button>
        </div>
      </section>
      <AvatarPicker open={avatarOpen} onClose={() => setAvatarOpen(false)} value={form.avatar} onSelect={(avatar) => { setForm((prev) => ({ ...prev, avatar })); setAvatarOpen(false); }} />
    </main>
  );
}
