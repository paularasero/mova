import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaApple, FaGoogle, FaInstagram } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { loginUser } from '../lib/auth';

const loginImage =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85';

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

function SocialButton({ label, icon: Icon }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.075] text-xl text-white/88 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:bg-white/[0.13]"
    >
      <Icon />
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState('');
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) return;

    setIsSubmitting(true);
    const result = await loginUser({ email: form.email, password: form.password });
    setIsSubmitting(false);

    if (result.ok) {
      navigate('/home');
      return;
    }

    setSubmitError(result.error || 'No pudimos iniciar sesión. Probá nuevamente.');
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-[#050505] px-5 pb-6 pt-7">
        <img src={loginImage} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
        <div className="absolute inset-0 bg-black/68" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-black/48 to-black/96" />

        <header className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Volver"
            className="grid h-11 w-11 place-items-center rounded-full bg-black/24 text-2xl text-white/86 backdrop-blur-xl transition hover:bg-white/10"
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
            className="rounded-[1.75rem] bg-black/28 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            <div className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#C8FF3D]">Acceso MOVA</p>
              <h1 className="text-[2.45rem] font-black leading-[0.95] tracking-[-0.055em] text-white">
                Bienvenido a MOVA<span className="text-[#C8FF3D]">.</span>
              </h1>
              <p className="mt-3 text-sm font-medium text-white/62">Iniciá sesión para continuar</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-white/72">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="vos@email.com"
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full rounded-[1.35rem] border border-white/10 bg-[#0d0d0d]/86 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#C8FF3D]/70 focus:bg-[#161616] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]"
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
                    style={{ backgroundColor: 'rgba(13, 13, 13, 0.88)' }}
                    className="w-full rounded-[1.35rem] border border-white/10 bg-[#0d0d0d]/86 px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/28 focus:border-[#C8FF3D]/70 focus:bg-[#161616] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]"
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
                <Link to="/register" className="text-[#C8FF3D] transition hover:text-white">
                  Registrate
                </Link>
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
