import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiBell, FiCompass, FiMap, FiUser } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Home', icon: FiCompass },
  { to: '/map', label: 'Mapa', icon: FiMap },
  { to: '/create', label: 'Crear', icon: IoAdd, featured: true },
  { to: '/community', label: 'Actividad', icon: FiBell },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-[398px] -translate-x-1/2 rounded-[2rem] border border-[var(--mova-border)] bg-[var(--mova-surface)]/92 px-2 py-2 shadow-[0_18px_55px_rgba(17,17,17,0.12)] backdrop-blur-2xl">
      <ul className="grid grid-cols-5 items-center text-center">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} aria-label={link.label} className="relative mx-auto grid h-12 place-items-center">
              {({ isActive }) => (
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={
                    link.featured
                      ? 'grid h-14 w-14 -translate-y-4 place-items-center rounded-full bg-[var(--mova-accent)] text-[2rem] text-white shadow-[0_16px_34px_rgba(123,97,255,0.34)]'
                      : `grid h-11 w-11 place-items-center rounded-full text-[1.3rem] transition ${isActive ? 'bg-[var(--mova-accent-soft)] text-[var(--mova-accent)]' : 'text-[var(--mova-muted)]'}`
                  }
                >
                  <link.icon />
                  {isActive && !link.featured && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--mova-accent)]" />
                  )}
                </motion.span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
