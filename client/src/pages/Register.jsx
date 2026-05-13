import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaApple, FaGoogle, FaInstagram } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { registerUser } from '../lib/auth';

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
  const bars = Array.from({ length: 13 }, (_, index) => index);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#111215]">
      <motion.div
        className="absolute left-0 right-0 top-[4.5rem] h-[31rem] overflow-visible"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="absolute -bottom-10 -left-14 top-[-2rem] w-[58%] rounded-full" style={{ background: 'linear-gradient(180deg, #FD7407, #FB97B3 44%, #0869D0)' }} animate={{ y: [0, 7, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute -bottom-10 -right-14 top-5 w-[58%] overflow-hidden rounded-full bg-[#04533E]">
          <motion.div className="absolute left-8 right-8 top-10 aspect-square rounded-full" style={{ background: 'linear-gradient(180deg, #FD7407, #F9A809)' }} animate={{ y: [0, 8, 0], scale: [1, 1.04, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="absolute bottom-0 left-3 right-3 top-[11rem] flex justify-between overflow-hidden">
            {bars.map((bar) => (
              <motion.span key={bar} className="h-full w-[5px] bg-gradient-to-b from-[#FB97B3] via-[#FD7407] to-[#0869D0]" animate={{ opacity: [0.46, 0.9, 0.46], scaleY: [0.92, 1, 0.92] }} transition={{ duration: 6 + bar * 0.06, repeat: Infinity, ease: 'easeInOut' }} />
            ))}
          </div>
        </div>
        <div className="mova-print-texture absolute inset-0" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,18,21,.08),rgba(17,18,21,.48)_42%,#111215_82%)] backdrop-blur-[1px]" />
    </div>
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
  const [submitSuccess, setSubmitSuccess] = useState('');
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
    setSubmitSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isValid) {
      setSubmitError('Completá todos los campos correctamente.');
      return;
    }

    setIsSubmitting(true);
    const result = await registerUser({
      name: form.name,
      email: form.email,
      city: form.city,
      password: form.password,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error || 'No pudimos crear tu cuenta. Intentá nuevamente.');
      return;
    }

    setSubmitSuccess('Usuario creado correctamente.');
    window.setTimeout(() => navigate('/setup'), 450);
  };

  return (
    <main className="min-h-screen bg-[#111215] text-[#F2EDEA]">
      <section className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#111215] px-5 pb-5 pt-7">
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

        <div className="relative z-10 mt-10 pb-1">
          <motion.div
            initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="p-4"
          >
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--mova-accent)]">Nueva cuenta</p>
              <h1 className="text-[2.28rem] font-bold leading-[1.05] tracking-[-0.018em] text-[#F2EDEA]">
                Creá tu cuenta
              </h1>
              <p className="mt-3 text-sm font-medium leading-relaxed text-[#F2EDEA]/68">Entrá a la red de planes que se sienten reales.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Nombre completo</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="Tu nombre"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full border border-[#F2EDEA]/10 bg-[#111215]/86 px-4 py-3.5 text-base text-[#F2EDEA] outline-none transition placeholder:text-[#F2EDEA]/38 focus:border-[var(--mova-accent)] focus:bg-[#111215] focus:shadow-[0_0_0_4px_rgba(253,116,7,0.10)]"
                  />
                  {touched.name && errors.name && <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{errors.name}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="vos@email.com"
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
                    placeholder="Mínimo 6 caracteres"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full border border-[#F2EDEA]/10 bg-[#111215]/86 px-4 py-3.5 text-base text-[#F2EDEA] outline-none transition placeholder:text-[#F2EDEA]/38 focus:border-[var(--mova-accent)] focus:bg-[#111215] focus:shadow-[0_0_0_4px_rgba(253,116,7,0.10)]"
                  />
                  {touched.password && errors.password && (
                    <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{errors.password}</p>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Confirmar contraseña</span>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    placeholder="Repetí tu contraseña"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full border border-[#F2EDEA]/10 bg-[#111215]/86 px-4 py-3.5 text-base text-[#F2EDEA] outline-none transition placeholder:text-[#F2EDEA]/38 focus:border-[var(--mova-accent)] focus:bg-[#111215] focus:shadow-[0_0_0_4px_rgba(253,116,7,0.10)]"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{errors.confirmPassword}</p>
                  )}
                </label>
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
                {isSubmitting ? 'Creando...' : 'Crear cuenta'}
              </motion.button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#F2EDEA]/34">
              <span className="h-px flex-1 bg-[#F2EDEA]/10" />
              o creá con
              <span className="h-px flex-1 bg-[#F2EDEA]/10" />
            </div>

            <div className="flex justify-center gap-3">
              <SocialButton label="Google" icon={FaGoogle} />
              <SocialButton label="Apple" icon={FaApple} />
              <SocialButton label="Instagram" icon={FaInstagram} />
            </div>

            <p className="mt-5 text-center text-sm font-semibold text-[#F2EDEA]/58">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-[var(--mova-accent)] transition hover:text-[#F2EDEA]">
                Iniciar sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
