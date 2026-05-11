import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FiCamera, FiCheck, FiMapPin, FiSearch, FiUpload, FiUser, FiX } from 'react-icons/fi';
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
  const [custom, setCustom] = useState('');
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="mova-overlay" aria-label="Cerrar avatares" />
          <div className="mova-sheet-wrap">
          <motion.div initial={{ y: 420 }} animate={{ y: 0 }} exit={{ y: 420 }} className="mova-sheet p-5 pb-8">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/18" />
            <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Tu avatar</h2><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08]"><FiX /></button></div>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {avatars.map((avatar) => <button key={avatar} onClick={() => onSelect(avatar)} className={`grid h-16 place-items-center overflow-hidden rounded-2xl border ${value === avatar ? 'border-[#C8FF3D]' : 'border-white/10'} bg-white/[0.06]`}><img src={avatar} alt="" className="h-full w-full object-cover" /></button>)}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.07] px-3 py-4 text-sm font-semibold text-white/70"><FiCamera /> Tomar foto</button>
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.07] px-3 py-4 text-sm font-semibold text-white/70"><FiUpload /> Galería</button>
            </div>
            <div className="mt-4 flex gap-2">
              <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="O pegá URL de foto" className="h-12 flex-1 rounded-2xl bg-white/[0.07] px-4 text-sm outline-none placeholder:text-white/35" />
              <button onClick={() => custom && onSelect(custom)} className="rounded-2xl bg-[#C8FF3D] px-4 text-sm font-bold text-black">Usar</button>
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
      <section className="mova-mobile flex flex-col px-5 pb-8 pt-8">
        <header>
          <p className="text-2xl font-bold">MOVA<span className="text-[#C8FF3D]">.</span></p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${step * 20}%` }} className="h-full rounded-full bg-[#C8FF3D]" /></div>
        </header>

        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="mt-10 flex-1">
          {step === 1 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Elegí tu ciudad base.</h1>
              <p className="mt-3 text-sm text-white/52">Podés buscar cualquier ciudad. La usamos para recomendar planes cerca.</p>
              <label className="mt-6 flex h-14 items-center gap-3 rounded-full bg-white/[0.07] px-4"><FiSearch className="text-white/45" /><input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder="Buscar ciudad" className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" /></label>
              <button onClick={() => setForm((prev) => ({ ...prev, city: 'Montevideo' }))} className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-[#C8FF3D]/12 px-4 py-3 text-sm font-semibold text-[#D9FF73]"><FiMapPin /> Usar ubicación actual</button>
              <div className="mt-4 max-h-[44vh] space-y-2 overflow-y-auto pb-2">{filteredCities.map((city) => <button key={city} onClick={() => setForm((prev) => ({ ...prev, city }))} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold ${form.city === city ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white'}`}>{city}{form.city === city && <FiCheck />}</button>)}</div>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">¿Qué planes te gustan?</h1>
              <div className="mt-8 grid grid-cols-2 gap-3">{categories.map((item) => <button key={item} onClick={() => toggle('favoriteCategories', item)} className={`h-24 rounded-3xl border text-sm font-semibold ${form.favoriteCategories.includes(item) ? 'border-[#C8FF3D] bg-[#C8FF3D]/12 text-[#D9FF73]' : 'border-white/10 bg-white/[0.07] text-white/70'}`}>{item}</button>)}</div>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">¿Con quién solés salir?</h1>
              <div className="mt-8 space-y-3">{companies.map((item) => <button key={item} onClick={() => toggle('company', item)} className={`flex w-full items-center justify-between rounded-3xl px-5 py-5 text-left font-semibold ${form.company.includes(item) ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white'}`}>{item}{form.company.includes(item) && <FiCheck />}</button>)}</div>
            </>
          )}
          {step === 4 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Tu cumpleaños.</h1>
              <p className="mt-3 text-sm text-white/52">Lo usamos para recomendaciones y momentos especiales.</p>
              <input type="date" value={form.birthday} onChange={(event) => setForm((prev) => ({ ...prev, birthday: event.target.value }))} className="mt-8 h-14 w-full rounded-2xl bg-white/[0.07] px-4 text-sm outline-none" />
            </>
          )}
          {step === 5 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Elegí tu foto.</h1>
              <p className="mt-3 text-sm text-white/52">Podés elegir un avatar, pegar una URL o dejar uno por defecto.</p>
              <button onClick={() => setAvatarOpen(true)} className="mt-8 flex w-full items-center gap-4 rounded-[1.6rem] bg-white/[0.07] p-4 text-left">
                <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-white/[0.07] text-2xl text-white/42">{form.avatar ? <img src={form.avatar} alt="" className="h-full w-full object-cover" /> : <FiUser />}</div>
                <div><p className="font-semibold">Cambiar avatar</p><p className="mt-1 text-sm text-white/45">Tomar foto, galería o avatar MOVA</p></div>
              </button>
            </>
          )}
        </motion.div>

        <div className="mt-8 flex gap-3">
          {step > 1 && <button onClick={() => setStep((value) => value - 1)} className="h-14 w-24 rounded-full bg-white/[0.08] font-semibold text-white/72">Atrás</button>}
          <motion.button whileTap={{ scale: 0.98 }} onClick={step === 5 ? finish : () => setStep((value) => value + 1)} disabled={saving} className="h-14 flex-1 rounded-full bg-[#C8FF3D] font-bold text-black">
            {step === 5 ? (saving ? 'Guardando...' : 'Entrar a MOVA') : 'Continuar'}
          </motion.button>
        </div>
      </section>
      <AvatarPicker open={avatarOpen} onClose={() => setAvatarOpen(false)} value={form.avatar} onSelect={(avatar) => { setForm((prev) => ({ ...prev, avatar })); setAvatarOpen(false); }} />
    </main>
  );
}
