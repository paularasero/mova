import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { FiBookmark, FiCamera, FiEdit3, FiGrid, FiSettings, FiStar, FiUpload, FiUsers, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PlanCard from '../components/PlanCard';
import { apiRequest } from '../lib/api';
import { getCurrentUser, setCurrentUser } from '../lib/auth';

const tabs = ['Creados', 'Guardados', 'Asistidos'];
const fallbackVibes = ['jazz', 'sunsets', 'cafeterías', 'cine', 'outdoor'];
const palette = ['#FD7407', '#F9A809', '#FB97B3', '#0869D0', '#04533E'];
const officialAvatar = (seed = 'MOVA') => `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=fd7407,f9a809,fb97b3,0869d0,04533e`;

function GraphicAvatar({ user }) {
  const name = user?.nombre || user?.name || 'Paula';
  const customPhoto = user?.avatar && !String(user.avatar).includes('dicebear.com');

  return (
    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-[0.35rem] border border-[#F2EDEA]/14 bg-[#111215] shadow-[0_18px_52px_rgba(0,0,0,.34)]">
      <div className="absolute -left-8 -right-8 -top-10 h-28 rounded-full bg-[linear-gradient(180deg,#FD7407,#F9A809)] opacity-66" />
      <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-t-full bg-[#04533E]/48" />
      <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-t-full bg-[#0869D0]/34" />
      <div className="mova-print-texture absolute inset-0 opacity-36" />
      {customPhoto ? (
        <img src={user.avatar} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity" />
      ) : (
        <img src={officialAvatar(name)} alt="" className="absolute bottom-1 left-1/2 h-28 w-28 -translate-x-1/2 object-contain" />
      )}
    </div>
  );
}

function StatBlock({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[0.35rem] border border-white/10 bg-white/[0.055] p-3">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[0.12rem] bg-[#F2EDEA] text-[#111215]">
        <Icon />
      </div>
      <p className="text-2xl font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/42">{label}</p>
    </div>
  );
}

function PosterHighlight({ label, value, color, index }) {
  return (
    <motion.article whileTap={{ scale: 0.98 }} className="relative h-28 min-w-32 overflow-hidden rounded-[0.35rem] border border-white/10 bg-white/[0.045] p-3">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-14" style={{ backgroundColor: color }} />
      <div className="absolute -bottom-8 left-2 h-24 w-24 rounded-t-full opacity-10" style={{ backgroundColor: palette[(index + 2) % palette.length] }} />
      <div className="mova-print-texture absolute inset-0 opacity-16" />
      <p className="relative text-2xl font-semibold text-[#F2EDEA]">{value}</p>
      <p className="relative mt-6 text-xs font-black uppercase tracking-[0.12em] text-white/58">{label}</p>
    </motion.article>
  );
}

function EditProfileModal({ open, onClose, value, onChangeName, onOpenGallery, onOpenCamera, onSelectAvatar, onSave, saving }) {
  if (!open) return null;
  return (
    <div className="mova-modal-wrap">
      <button className="mova-overlay" onClick={onClose} aria-label="Cerrar edición de perfil" />
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mova-modal relative z-10 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Editar perfil</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-[0.16rem] bg-white/[0.08] text-white/78"><FiX /></button>
        </div>
        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/42">Nombre</label>
        <input value={value.name} onChange={(event) => onChangeName(event.target.value)} placeholder="Paula Rasero" className="mt-2 h-12 w-full rounded-[0.16rem] border border-white/10 bg-white/[0.06] px-4 text-sm outline-none placeholder:text-white/30" />

        <div className="mt-5 flex gap-2">
          <button onClick={onOpenGallery} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[0.16rem] border border-white/10 bg-white/[0.06] text-sm font-semibold text-white/82"><FiUpload /> Galería</button>
          <button onClick={onOpenCamera} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[0.16rem] border border-white/10 bg-white/[0.06] text-sm font-semibold text-white/82"><FiCamera /> Cámara</button>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/42">Avatar</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {['MovaSun', 'MovaBlue', 'MovaNight', 'MovaCity', 'MovaJazz', 'MovaCafe', 'MovaPark', 'MovaGlow'].map((seed) => (
              <button key={seed} onClick={() => onSelectAvatar(officialAvatar(seed))} className="overflow-hidden rounded-[0.16rem] border border-white/10 bg-white/[0.04] p-1">
                <img src={officialAvatar(seed)} alt="" className="h-14 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <button onClick={onSave} disabled={saving} className="mt-6 h-12 w-full rounded-[0.16rem] bg-[#F2EDEA] text-sm font-black text-[#111215] disabled:opacity-60">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </motion.div>
    </div>
  );
}

export default function Profile() {
  const current = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('Creados');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftAvatar, setDraftAvatar] = useState('');

  useEffect(() => {
    apiRequest(`/users/me/profile?userId=${current?.id}`).then(setProfile).catch(() => setProfile(null));
  }, [current?.id]);

  const user = profile?.user || current;
  const created = profile?.created || [];
  const saved = profile?.saved || [];
  const stats = profile?.stats || {};
  const list = tab === 'Creados' ? created : tab === 'Guardados' ? saved : [];
  const points = stats.points || user?.puntos || 0;
  const name = user?.nombre || user?.name || 'Paula';
  const username = user?.username || name.toLowerCase().split(' ')[0] || 'mova';
  const vibes = useMemo(() => (user?.preferences?.favoriteCategories?.length ? user.preferences.favoriteCategories : fallbackVibes).slice(0, 6), [user]);

  useEffect(() => {
    setDraftName(name);
    setDraftAvatar(user?.avatar || officialAvatar(name));
  }, [name, user?.avatar]);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraftAvatar(String(reader.result || ''));
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const saveProfile = async () => {
    if (!current?.id) return;
    setSaving(true);
    try {
      const updated = await apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          userId: current.id,
          name: draftName.trim() || name,
          avatar: draftAvatar || user?.avatar,
          preferences: user?.preferences,
        }),
      });
      setCurrentUser(updated);
      setProfile((prev) => prev ? { ...prev, user: { ...prev.user, ...updated } } : { user: updated, created: [], saved: [], stats: {} });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mova-screen">
      <section className="mova-mobile relative overflow-hidden px-5 pb-32 pt-7">
        <div className="pointer-events-none absolute -right-24 top-28 h-64 w-64 rounded-full bg-[#FD7407]/4 blur-2xl" />
        <div className="pointer-events-none absolute -left-20 top-80 h-56 w-56 rounded-t-full bg-[#0869D0]/4 blur-xl" />

        <header className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Perfil MOVA</p>
            <h1 className="mt-1 text-2xl font-semibold">Tu espacio</h1>
          </div>
          <Link to="/settings" className="grid h-11 w-11 place-items-center rounded-[0.16rem] border border-white/10 bg-white/[0.06] text-white/78">
            <FiSettings />
          </Link>
        </header>

        <motion.section initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} className="relative z-10 mt-7 text-center">
          <GraphicAvatar user={user} />
          <h2 className="mt-5 text-[2.15rem] font-semibold leading-none">{name}</h2>
          <p className="mt-2 text-sm font-semibold text-white/48">@{username}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-[0.16rem] border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-white/76">
            <FiStar /> Urban Explorer · Nivel {Math.max(1, Math.floor(points / 500) + 1)}
          </div>
          <button onClick={() => setEditing(true)} className="ml-2 inline-flex items-center gap-2 rounded-[0.16rem] border border-white/12 bg-white/[0.07] px-3 py-2 text-xs font-black text-white/72">
            <FiEdit3 /> Editar
          </button>
        </motion.section>

        <section className="relative z-10 mt-7 grid grid-cols-3 gap-2">
          <StatBlock label="Posts" value={created.length} icon={FiGrid} />
          <StatBlock label="Seguidores" value={stats.followers || user?.followersCount || user?.seguidores || 0} icon={FiUsers} />
          <StatBlock label="Guardados" value={saved.length} icon={FiBookmark} />
        </section>

        <section className="relative z-10 mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Vibes</h3>
            <span className="text-xs font-semibold text-white/38">{points} pts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe, index) => (
              <span key={vibe} className="rounded-[0.16rem] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black uppercase tracking-[0.06em] text-white/70">
                {vibe}
              </span>
            ))}
          </div>
        </section>

        <section className="mova-scrollbar-none relative z-10 mt-7 flex gap-3 overflow-x-auto pb-1">
          {[
            ['Puntos', points, '#FD7407'],
            ['Creadas', created.length, '#0869D0'],
            ['Guardadas', saved.length, '#FB97B3'],
            ['Asistidos', 0, '#04533E'],
          ].map(([label, value, color], index) => <PosterHighlight key={label} label={label} value={value} color={color} index={index} />)}
        </section>

        <section className="relative z-10 mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Destacados</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(saved.slice(0, 3).length ? saved.slice(0, 3) : created.slice(0, 3)).map((item) => (
              <article key={item.id} className="h-24 overflow-hidden rounded-[0.35rem] border border-white/10 bg-white/[0.06]">
                <img src={item.image || item.imagen} alt="" className="h-full w-full object-cover" />
              </article>
            ))}
            {saved.length + created.length === 0 && ['Música', 'Sunset', 'Café'].map((item, index) => (
              <article key={item} className="relative grid h-24 place-items-center overflow-hidden rounded-[0.35rem] border border-white/10 text-xs font-black text-white">
                <span className="absolute inset-0 opacity-36" style={{ backgroundColor: palette[index] }} />
                <span className="mova-print-texture absolute inset-0" />
                <span className="relative">{item}</span>
              </article>
            ))}
          </div>
        </section>

        <div className="relative z-10 mt-7 flex gap-2">
          {tabs.map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-[0.16rem] px-4 py-2 text-xs font-black ${tab === item ? 'bg-[#F2EDEA] text-[#111215]' : 'bg-white/[0.07] text-[var(--mova-muted)]'}`}>{item}</button>
          ))}
        </div>

        <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
          {list.map((experience) => <PlanCard key={experience.id} plan={experience} compact />)}
        </div>
        {tab === 'Asistidos' && <p className="relative z-10 mt-6 rounded-[0.35rem] bg-white/[0.06] px-4 py-4 text-sm text-[var(--mova-muted)]">Tus planes asistidos van a aparecer acá.</p>}
        {tab !== 'Asistidos' && list.length === 0 && <p className="relative z-10 mt-6 rounded-[0.35rem] bg-white/[0.06] px-4 py-4 text-sm text-[var(--mova-muted)]">No hay contenido para mostrar.</p>}

        <input id="profile-gallery-upload" type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <input id="profile-camera-upload" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

        <AnimatePresence>
          <EditProfileModal
            open={editing}
            onClose={() => setEditing(false)}
            value={{ name: draftName, avatar: draftAvatar }}
            onChangeName={setDraftName}
            onOpenGallery={() => document.getElementById('profile-gallery-upload')?.click()}
            onOpenCamera={() => document.getElementById('profile-camera-upload')?.click()}
            onSelectAvatar={setDraftAvatar}
            onSave={saveProfile}
            saving={saving}
          />
        </AnimatePresence>
      </section>
    </main>
  );
}
