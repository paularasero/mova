import { Link } from 'react-router-dom';
import Button from '../components/Button';

const heroImage =
  'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1500&q=80';

export default function Onboarding() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-surface">
      <section className="relative flex min-h-screen flex-col overflow-hidden rounded-none bg-white sm:rounded-[2.75rem] sm:shadow-soft">
        <img
          src={heroImage}
          alt="Personas disfrutando la ciudad"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-white/86 via-white/24 to-transparent" />

        <header className="relative z-10 px-7 pt-10">
          <p className="text-[2rem] font-black tracking-[-0.03em] text-black">MOVA.</p>
        </header>

        <div className="relative z-10 mt-auto px-7 pb-8">
          <div className="max-w-[18rem] animate-[fadeIn_700ms_ease-out]">
            <h1 className="text-[2.75rem] font-extrabold leading-[0.94] tracking-[-0.03em] text-black">
              Descubrí lugares que te mueven.
            </h1>
            <p className="mt-4 text-[1.05rem] font-medium leading-snug text-black/70">
              Compartí, explorá y creá planes con tu gente.
            </p>
          </div>

          <div className="mt-8 rounded-5xl bg-white p-5 shadow-soft backdrop-blur-sm">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/10" />
            <div className="space-y-3">
              <Link to="/register">
                <Button variant="primary">Crear cuenta</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Iniciar sesión</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
