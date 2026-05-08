import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { loginUser } from '../lib/auth';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    <main className="mx-auto min-h-screen w-full max-w-md bg-surface px-5 pb-8 pt-10">
      <header>
        <Link to="/" className="text-sm font-semibold text-black/60">
          Volver
        </Link>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.03em] text-ink">Bienvenido de nuevo</h1>
        <p className="mt-2 text-sm text-black/65">Entrá para seguir descubriendo planes en tu ciudad.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8 rounded-5xl bg-white p-5 shadow-soft">
        <div className="space-y-4">
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
        </div>

        {submitError && <p className="mt-4 text-sm font-medium text-red-500">{submitError}</p>}

        <div className="mt-6 space-y-3">
          <Button type="submit" className={!isValid || isSubmitting ? 'opacity-70' : ''}>
            {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
          <Link
            to="/register"
            className="block text-center text-sm font-semibold text-black/65 transition hover:text-black"
          >
            ¿No tenés cuenta? Crear cuenta
          </Link>
        </div>
      </form>

      <p className="mt-5 text-center text-xs text-black/45">
        Usá el email y contraseña que creaste al registrarte.
      </p>
    </main>
  );
}
