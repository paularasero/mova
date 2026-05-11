import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCamera, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const cities = ['Montevideo', 'Punta del Este', 'Buenos Aires'];
const categories = ['Night', 'Food', 'Chill', 'Art', 'Música', 'Rooftops', 'Outdoor', 'Hidden spots'];
const companies = ['Amigos', 'Pareja', 'Solo', 'Familia'];

export default function SetupOnboarding() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    city: user?.city || user?.ciudad || 'Montevideo',
    favoriteCategories: [],
    company: [],
    birthday: '',
    avatar: user?.avatar || '',
  });

  const toggle = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }));
  };

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
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden px-5 pb-8 pt-8">
        <header>
          <p className="text-2xl font-bold">MOVA<span className="text-[#C8FF3D]">.</span></p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div animate={{ width: `${step * 20}%` }} className="h-full rounded-full bg-[#C8FF3D]" />
          </div>
        </header>

        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="mt-10 flex-1">
          {step === 1 && (
            <>
              <h1 className="text-[2.15rem] font-semibold leading-tight">Elegí tu ciudad base.</h1>
              <div className="mt-8 space-y-3">{cities.map((city) => <button key={city} onClick={() => setForm((prev) => ({ ...prev, city }))} className={`flex w-full items-center justify-between rounded-3xl px-5 py-5 text-left font-semibold ${form.city === city ? 'bg-[#C8FF3D] text-black' : 'bg-white/[0.07] text-white'}`}>{city}{form.city === city && <FiCheck />}</button>)}</div>
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
              <h1 className="text-[2.15rem] font-semibold leading-tight">Sumá una foto.</h1>
              <p className="mt-3 text-sm text-white/52">Opcional. Podés pegar una URL por ahora.</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-white/[0.07] text-2xl text-white/42">{form.avatar ? <img src={form.avatar} alt="" className="h-full w-full object-cover" /> : <FiCamera />}</div>
                <input value={form.avatar} onChange={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))} placeholder="URL de foto" className="h-14 flex-1 rounded-2xl bg-white/[0.07] px-4 text-sm outline-none placeholder:text-white/35" />
              </div>
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
    </main>
  );
}
