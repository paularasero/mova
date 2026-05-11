import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/auth';

const registerImage =
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1600&q=85';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Logo() {
  return (
    <p className="text-[1.75rem] font-black tracking-[-0.04em] text-white">
      MOVA<span className="text-[#C8FF3D]">.</span>
    </p>
  );
}

function SocialButton({ label }) {
  return (
    <button
      type="button"
      className="grid h-12 flex-1 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-bold text-white/88 backdrop-blur-xl transition hover:bg-white/[0.12]"
    >
      {label}
    </button>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: 'Montevideo',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(
    () => ({
      name: !form.name.trim() ? 'Contanos cómo te llamás.' : '',
      email: !form.email ? 'Ingresá tu email.' : !isValidEmail(form.email) ? 'Usá un email válido.' : '',
      password:
        !form.password ? 'Creá una contraseña.' : form.password.length < 6 ? 'Debe tener al menos 6 caracteres.' : '',
      confirmPassword:
        !form.confirmPassword
          ? 'Repetí la contraseña.'
          : form.confirmPassword !== form.password
            ? 'Las contraseñas no coinciden.'
            : '',
    }),
    [form]
  );

  const isValid = !errors.name && !errors.email && !errors.password && !errors.confirmPassword;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isValid) return;

    setIsSubmitting(true);
    const result = await registerUser({
      name: form.name,
      email: form.email,
      city: form.city,
      password: form.password,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error || 'No pudimos crear la cuenta.');
      return;
    }

    navigate('/home');
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <img src={registerImage} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/82 via-black/42 to-black/96" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-6 pt-8">
        <header className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 backdrop-blur-xl transition hover:bg-white/15"
          >
            Volver
          </Link>
        </header>

        <div className="mt-auto pb-3">
          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[2rem] border border-white/12 bg-white/[0.095] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#C8FF3D]">Nueva cuenta</p>
              <h1 className="text-[2.8rem] font-black leading-[0.95] tracking-[-0.055em] text-white">
                Creá tu cuenta
              </h1>
              <p className="mt-3 text-sm font-medium text-white/62">Entrá a la red de planes que se sienten reales.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3.5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/72">Nombre completo</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="Tu nombre"
                    className="h-14 w-full rounded-[1.35rem] border border-white/10 bg-[#111111] px-4 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#C8FF3D]/70 focus:bg-[#181818] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]"
                  />
                  {touched.name && errors.name && <p className="mt-2 text-xs font-semibold text-[#ff7474]">{errors.name}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/72">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="vos@email.com"
                    className="h-14 w-full rounded-[1.35rem] border border-white/10 bg-[#111111] px-4 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#C8FF3D]/70 focus:bg-[#181818] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]"
                  />
                  {touched.email && errors.email && <p className="mt-2 text-xs font-semibold text-[#ff7474]">{errors.email}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/72">Contraseña</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Mínimo 6 caracteres"
                    className="h-14 w-full rounded-[1.35rem] border border-white/10 bg-[#111111] px-4 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#C8FF3D]/70 focus:bg-[#181818] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]"
                  />
                  {touched.password && errors.password && (
                    <p className="mt-2 text-xs font-semibold text-[#ff7474]">{errors.password}</p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/72">Confirmar contraseña</span>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    placeholder="Repetí tu contraseña"
                    className="h-14 w-full rounded-[1.35rem] border border-white/10 bg-[#111111] px-4 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#C8FF3D]/70 focus:bg-[#181818] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="mt-2 text-xs font-semibold text-[#ff7474]">{errors.confirmPassword}</p>
                  )}
                </label>
              </div>

              {submitError && (
                <p className="mt-4 rounded-2xl border border-red-400/15 bg-red-500/10 px-4 py-3 text-sm font-semibold text-[#ff8585]">
                  {submitError}
                </p>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className={`mt-6 h-14 w-full rounded-full bg-[#C8FF3D] text-base font-black text-black shadow-[0_18px_44px_rgba(200,255,61,0.28)] transition hover:brightness-105 ${
                  !isValid || isSubmitting ? 'opacity-70' : ''
                }`}
              >
                {isSubmitting ? 'Creando...' : 'Crear cuenta'}
              </motion.button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/34">
              <span className="h-px flex-1 bg-white/10" />
              o creá con
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex gap-3">
              <SocialButton label="Google" />
              <SocialButton label="Apple" />
              <SocialButton label="Instagram" />
            </div>

            <p className="mt-5 text-center text-sm font-semibold text-white/58">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-[#C8FF3D] transition hover:text-white">
                Iniciar sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
