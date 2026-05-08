import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { registerUser } from '../lib/auth';

const cityOptions = ['Montevideo', 'Buenos Aires', 'Santiago', 'CDMX', 'Madrid'];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    <main className="mx-auto min-h-screen w-full max-w-md bg-surface px-5 pb-8 pt-10">
      <header>
        <Link to="/" className="text-sm font-semibold text-black/60">
          Volver
        </Link>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.03em] text-ink">Unite a MOVA</h1>
        <p className="mt-2 text-sm text-black/65">Creá tu cuenta y empezá a recomendar planes increíbles.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 rounded-5xl bg-white p-5 shadow-soft">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Nombre</span>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              placeholder="Tu nombre"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-black/25"
            />
            {touched.name && errors.name && <p className="mt-2 text-xs font-medium text-red-500">{errors.name}</p>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="vos@email.com"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-black/25"
            />
            {touched.email && errors.email && <p className="mt-2 text-xs font-medium text-red-500">{errors.email}</p>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Ciudad</span>
            <select
              value={form.city}
              onChange={handleChange('city')}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-black/25"
            >
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Contraseña</span>
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-black/25"
            />
            {touched.password && errors.password && (
              <p className="mt-2 text-xs font-medium text-red-500">{errors.password}</p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink">Repetir contraseña</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
              placeholder="Repetí tu contraseña"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-black/25"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-2 text-xs font-medium text-red-500">{errors.confirmPassword}</p>
            )}
          </label>
        </div>

        {submitError && <p className="mt-4 text-sm font-medium text-red-500">{submitError}</p>}

        <div className="mt-6 space-y-3">
          <Button type="submit" className={!isValid || isSubmitting ? 'opacity-70' : ''}>
            {isSubmitting ? 'Creando...' : 'Crear cuenta'}
          </Button>
          <Link to="/login" className="block text-center text-sm font-semibold text-black/65 transition hover:text-black">
            ¿Ya tenés cuenta? Iniciar sesión
          </Link>
        </div>
      </form>
    </main>
  );
}
