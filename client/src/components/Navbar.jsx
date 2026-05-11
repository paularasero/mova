import { NavLink } from 'react-router-dom';
import { FiBookmark, FiHome, FiSearch, FiUser } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Home', icon: FiHome },
  { to: '/explore', label: 'Buscar', icon: FiSearch },
  { to: '/create', label: 'Crear', icon: IoAdd, featured: true },
  { to: '/saved', label: 'Guardadas', icon: FiBookmark },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-[398px] -translate-x-1/2 rounded-full border border-white/10 bg-[#090909]/92 px-2 py-2 shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
      <ul className="grid grid-cols-5 items-center gap-1 text-center text-[0.68rem] font-semibold">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `mx-auto grid place-items-center transition ${
                  link.featured
                    ? 'h-11 w-11 rounded-full bg-[#C8FF3D] text-2xl text-black shadow-[0_0_24px_rgba(200,255,61,0.38)]'
                    : `h-11 rounded-full px-2 ${isActive ? 'text-white' : 'text-white/52'}`
                }`
              }
              aria-label={link.label}
            >
              <link.icon />
              {!link.featured && <span className="sr-only">{link.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
