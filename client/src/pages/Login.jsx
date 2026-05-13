import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaApple, FaGoogle, FaInstagram } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { loginUser } from '../lib/auth';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Logo() {
  return (
    <p className="text-[1.75rem] font-bold tracking-[-0.01em] text-white">
      MOVA<span className="text-[var(--mova-accent)]">.</span>
    </p>
  );
}

function SocialButton({ label, icon: Icon }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-[0.75rem] border border-white/10 bg-white/[0.075] text-xl text-white/88 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:bg-white/[0.13]"
    >
      <Icon />
    </button>
  );
}

function AbstractAuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0B0F]">
      <motion.div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-[#FF74C8]/55" animate={{ x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute right-[-4rem] top-12 h-80 w-28 rounded-full bg-[#67C8FF]/70" animate={{ rotate: [32, 46, 32], y: [0, 18, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="mova-ribbon absolute left-12 top-[17rem] h-11 w-80 bg-[linear-gradient(90deg,#FFD84D,rgba(255,255,255,.2))]" animate={{ rotate: [-18, -13, -18], x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="mova-ribbon absolute -left-8 top-[23rem] h-10 w-72 bg-[linear-gradient(90deg,#0A7D44,rgba(103,200,255,.38))]" animate={{ rotate: [16, 10, 16], x: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute left-7 top-28 h-[28rem] w-px bg-white/10" />
      <div className="absolute right-9 top-40 h-[24rem] w-px bg-white/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent,rgba(11,11,15,.18)_44%,#0B0B0F_82%)]" />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = {
    email: !form.email
      ? 'Ingresá tu email.'
      : !isValidEmail(form.email)
        ? 'Usá un email válido.'
        : '',
    password: !form.password
      ? 'Ingresá tu contraseña.'
      : form.password.length < 6
        ? 'Debe tener al menos 6 caracteres.'
        : '',
  };

  const isValid = !errors.email && !errors.password;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) {
      setSubmitError('Completá todos los campos correctamente.');
      return;
    }

    setIsSubmitting(true);
    const result = await loginUser({ email: form.email, password: form.password });
    setIsSubmitting(false);

    if (result.ok) {
      setSubmitSuccess('Sesión iniciada correctamente.');
      window.setTimeout(() => navigate('/home'), 350);
      return;
    }

    setSubmitError(result.error || 'No pudimos iniciar sesión. Intentá nuevamente.');
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <section className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#0B0B0F] px-5 pb-6 pt-7">
        <AbstractAuthBackground />

        <header className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Volver"
            className="grid h-11 w-11 place-items-center rounded-[0.75rem] bg-white/[0.08] text-2xl text-white/86 backdrop-blur-xl transition hover:bg-white/10"
          >
            <IoArrowBack />
          </Link>
          <Logo />
          <span className="h-11 w-11" />
        </header>

        <div className="relative z-10 mt-auto pb-2">
          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[1.2rem] border border-white/10 bg-[#111117]/82 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-md"
          >
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--mova-accent)]">Acceso MOVA</p>
              <h1 className="text-[2.28rem] font-bold leading-[1.05] tracking-[-0.018em] text-white">
                Bienvenido a MOVA<span className="text-[var(--mova-accent)]">.</span>
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/68">Iniciá sesión para continuar</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/74">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="vos@email.com"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full rounded-[0.85rem] border border-white/10 bg-[#0d0d0d]/86 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/38 focus:border-[var(--mova-accent)] focus:bg-[#161616] focus:shadow-[0_0_0_4px_rgba(255,116,200,0.08)]"
                  />
                  {touched.email && errors.email && <p className="mt-2 text-xs font-semibold text-[#ff7474]">{errors.email}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/74">Contraseña</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Mínimo 6 caracteres"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full rounded-[0.85rem] border border-white/10 bg-[#0d0d0d]/86 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/38 focus:border-[var(--mova-accent)] focus:bg-[#161616] focus:shadow-[0_0_0_4px_rgba(255,116,200,0.08)]"
                  />
                  {touched.password && errors.password && (
                    <p className="mt-2 text-xs font-semibold text-[#ff7474]">{errors.password}</p>
                  )}
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                <button type="button" className="text-white/50 transition hover:text-white/75">
                  ¿Olvidaste tu contraseña?
                </button>
                <Link to="/register" className="text-[var(--mova-accent)] transition hover:text-white">
                  Registrate
                </Link>
              </div>

              {submitError && (
                <p className="mt-4 rounded-[0.85rem] border border-red-400/15 bg-red-500/10 px-4 py-3 text-sm font-semibold text-[#ff8585]">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="mt-4 rounded-[0.85rem] border border-[var(--mova-accent)] bg-[var(--mova-accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--mova-accent)]">
                  {submitSuccess}
                </p>
              )}

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`mt-6 h-14 w-full rounded-[0.95rem] bg-[var(--mova-accent)] text-base font-bold text-[#0B0B0F] shadow-[0_18px_44px_rgba(255,116,200,0.22)] transition hover:brightness-105 disabled:cursor-wait ${
                  !isValid || isSubmitting ? 'opacity-70' : ''
                }`}
              >
                {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
              </motion.button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/34">
              <span className="h-px flex-1 bg-white/10" />
              o seguí con
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex justify-center gap-3">
              <SocialButton label="Google" icon={FaGoogle} />
              <SocialButton label="Apple" icon={FaApple} />
              <SocialButton label="Instagram" icon={FaInstagram} />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
