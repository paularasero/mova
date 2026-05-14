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
    <p className="text-[1.75rem] font-bold tracking-[-0.01em] text-[#F2EDEA]">
      MOVA<span className="text-[var(--mova-accent)]">.</span>
    </p>
  );
}

function SocialButton({ label, icon: Icon }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-12 w-12 place-items-center border border-[#F2EDEA]/12 bg-[#F2EDEA]/[0.075] text-xl text-[#F2EDEA]/88 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:bg-[#F2EDEA]/[0.13]"
    >
      <Icon />
    </button>
  );
}

function AbstractAuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111215]">
      <motion.div className="absolute left-0 right-0 top-16 h-[30rem] overflow-visible" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}>
        <motion.div className="absolute -left-4 -right-4 -top-10 h-72 rounded-full" style={{ background: 'radial-gradient(circle at 50% 24%, #F9A809, #FD7407 48%, #FB97B3 82%)' }} animate={{ y: [0, 8, 0], scale: [1, 1.03, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute -left-14 -right-14 top-[14rem] h-[22rem] rounded-t-full bg-[#04533E]" animate={{ y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute -left-8 -right-8 top-[21rem] h-[17rem] rounded-t-full bg-[#0869D0]" animate={{ y: [0, -5, 0], opacity: [0.78, 0.94, 0.78] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="mova-print-texture absolute inset-0" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,18,21,.08),rgba(17,18,21,.44)_42%,#111215_78%)] backdrop-blur-[1px]" />
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
    <main className="min-h-screen bg-[#111215] text-[#F2EDEA]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#111215] px-5 pb-6 pt-7">
        <AbstractAuthBackground />

        <header className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Volver"
            className="grid h-11 w-11 place-items-center border border-[#F2EDEA]/12 bg-[#F2EDEA]/[0.08] text-2xl text-[#F2EDEA]/86 backdrop-blur-xl transition hover:bg-[#F2EDEA]/10"
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
            className="p-4"
          >
            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--mova-accent)]">Acceso MOVA</p>
              <h1 className="text-[2.28rem] font-bold leading-[1.05] tracking-[-0.018em] text-[#F2EDEA]">
                Bienvenido a MOVA<span className="text-[var(--mova-accent)]">.</span>
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#F2EDEA]/68">Iniciá sesión para continuar</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="tu@email.com"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full border border-[#F2EDEA]/10 bg-[#111215]/86 px-4 py-3.5 text-base text-[#F2EDEA] outline-none transition placeholder:text-[#F2EDEA]/38 focus:border-[var(--mova-accent)] focus:bg-[#111215] focus:shadow-[0_0_0_4px_rgba(253,116,7,0.10)]"
                  />
                  {touched.email && errors.email && <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{errors.email}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Contraseña</span>
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Tu contraseña"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full border border-[#F2EDEA]/10 bg-[#111215]/86 px-4 py-3.5 text-base text-[#F2EDEA] outline-none transition placeholder:text-[#F2EDEA]/38 focus:border-[var(--mova-accent)] focus:bg-[#111215] focus:shadow-[0_0_0_4px_rgba(253,116,7,0.10)]"
                  />
                  {touched.password && errors.password && (
                    <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{errors.password}</p>
                  )}
                </label>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                <button type="button" className="text-[#F2EDEA]/50 transition hover:text-[#F2EDEA]/75">
                  ¿Olvidaste tu contraseña?
                </button>
                <Link to="/register" className="text-[var(--mova-accent)] transition hover:text-[#F2EDEA]">
                  Registrate
                </Link>
              </div>

              {submitError && (
                <p className="mt-4 rounded-[0.85rem] border border-red-400/15 bg-red-500/10 px-4 py-3 text-sm font-semibold text-[#FB97B3]">
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
                className={`mt-6 h-14 w-full bg-[var(--mova-accent)] text-base font-bold text-[#111215] shadow-[0_18px_44px_rgba(253,116,7,0.20)] transition hover:bg-[#F9A809] disabled:cursor-wait ${
                  !isValid || isSubmitting ? 'opacity-70' : ''
                }`}
              >
                {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
              </motion.button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#F2EDEA]/34">
              <span className="h-px flex-1 bg-[#F2EDEA]/10" />
              o seguí con
              <span className="h-px flex-1 bg-[#F2EDEA]/10" />
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
