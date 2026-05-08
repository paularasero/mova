import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { clearCurrentUser, getCurrentUser } from '../lib/auth';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-md px-4 pb-28 pt-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink">Perfil</h2>
        <div className="mt-4 rounded-4xl bg-white p-5 shadow-soft">
          <p className="text-sm text-black/65">No hay una sesión activa.</p>
          <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-black">
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 pb-28 pt-6">
      <h2 className="text-2xl font-bold tracking-tight text-ink">Perfil</h2>
      <div className="mt-4 rounded-4xl bg-white p-5 shadow-soft">
        <p className="text-xl font-bold">{user.nombre}</p>
        <p className="text-sm text-black/60">@{user.username}</p>
        <p className="text-sm text-black/60">{user.email}</p>
        <p className="mt-2 text-sm text-black/60">{user.ciudad}</p>
        <p className="mt-3 text-sm font-medium">Puntos: {user.puntos ?? 0}</p>
        <p className="mt-1 text-sm text-black/60">
          Seguidores: {user.seguidores ?? 0} · Siguiendo: {user.siguiendo ?? 0}
        </p>
        <div className="mt-5">
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </section>
  );
}
