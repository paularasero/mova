import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaApple, FaGoogle, FaInstagram } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { registerUser } from '../lib/auth';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const passwordRules = [
  { label: '8 caracteres como mínimo', test: (value) => value.length >= 8 },
  { label: 'una mayúscula', test: (value) => /[A-ZÁÉÍÓÚÑ]/.test(value) },
  { label: 'una minúscula', test: (value) => /[a-záéíóúñ]/.test(value) },
  { label: 'un número', test: (value) => /\d/.test(value) },
];

function validatePassword(value) {
  const missing = passwordRules.filter((rule) => !rule.test(value)).map((rule) => rule.label);
  if (!missing.length) return '';
  const formatted = missing.length === 1 ? missing[0] : `${missing.slice(0, -1).join(', ')} y ${missing.at(-1)}`;
  return `La contraseña debe tener ${formatted}.`;
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
  const [serverErrors, setServerErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const errors = useMemo(
    () => ({
      name: !form.name.trim() ? 'Contanos cómo te llamás.' : '',
      email: !form.email ? 'Ingresá tu email.' : !isValidEmail(form.email) ? 'Usá un email válido.' : '',
      password:
        !form.password ? 'Creá una contraseña.' : validatePassword(form.password),
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
  const fieldError = (field) => (touched[field] ? errors[field] || serverErrors[field] || '' : '');
  const inputClass = (field, extra = '') => {
    const hasError = fieldError(field);
    return `w-full border bg-[#111215]/86 px-4 py-3.5 text-base text-[#F2EDEA] outline-none transition placeholder:text-[#F2EDEA]/38 focus:bg-[#111215] ${extra} ${
      hasError
        ? 'border-[#FB97B3] focus:border-[#FB97B3] focus:shadow-[0_0_0_4px_rgba(251,151,179,0.14)]'
        : 'border-[#F2EDEA]/10 focus:border-[var(--mova-accent)] focus:shadow-[0_0_0_4px_rgba(253,116,7,0.10)]'
    }`;
  };

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setServerErrors((prev) => ({ ...prev, [field]: '' }));
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
    setServerErrors({});

    if (!isValid) {
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
      const message = result.error || 'No pudimos crear tu cuenta. Intentá nuevamente.';
      if (/email|registrado/i.test(message)) setServerErrors({ email: message });
      else if (/contraseña/i.test(message)) setServerErrors({ password: message });
      else if (/nombre/i.test(message)) setServerErrors({ name: message });
      else setSubmitError(message);
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
                    placeholder="Paula Rasero"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className={inputClass('name')}
                  />
                  {fieldError('name') && <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{fieldError('name')}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="paula@email.com"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className={inputClass('email')}
                  />
                  {fieldError('email') && <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{fieldError('email')}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Contraseña</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange('password')}
                      onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                      placeholder="Ej: Mova2026"
                      style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                      className={inputClass('password', 'pr-12')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-lg text-[#F2EDEA]/58 transition hover:text-[#F2EDEA]"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {fieldError('password') && (
                    <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{fieldError('password')}</p>
                  )}
                  <div className="mt-3 grid grid-cols-1 gap-1.5">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(form.password);
                      return (
                        <span key={rule.label} className={`text-xs font-semibold ${passed ? 'text-[#F9A809]' : 'text-[#F2EDEA]/42'}`}>
                          {passed ? '✓' : '·'} {rule.label}
                        </span>
                      );
                    })}
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#F2EDEA]/74">Confirmar contraseña</span>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                      placeholder="Repetí tu contraseña"
                      style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                      className={inputClass('confirmPassword', 'pr-12')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                      className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-lg text-[#F2EDEA]/58 transition hover:text-[#F2EDEA]"
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {fieldError('confirmPassword') && (
                    <p className="mt-2 text-xs font-semibold text-[#FB97B3]">{fieldError('confirmPassword')}</p>
                  )}
                </label>
              </div>

              {submitError && (
                <p className="mt-4 rounded-[0.45rem] border border-[#FB97B3]/18 bg-[#FB97B3]/10 px-4 py-3 text-sm font-semibold text-[#FB97B3]">
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
