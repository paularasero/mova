import { NavLink } from 'react-router-dom';

const links = [
  { to: '/home', label: 'Inicio' },
  { to: '/explore', label: 'Explorar' },
  { to: '/create', label: 'Crear' },
  { to: '/saved', label: 'Guardados' },
  { to: '/profile', label: 'Perfil' },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2 rounded-full border border-black/5 bg-white/95 px-2 py-2 shadow-soft backdrop-blur">
      <ul className="grid grid-cols-5 gap-1 text-center text-xs font-semibold">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `block rounded-full px-2 py-2 transition ${isActive ? 'bg-ink text-white' : 'text-black/60'}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
