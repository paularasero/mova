import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiBookmark, FiCompass, FiUsers, FiUser } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Explore', icon: FiCompass },
  { to: '/community', label: 'Community', icon: FiUsers },
  { to: '/create', label: 'Crear', icon: IoAdd, featured: true },
  { to: '/saved', label: 'Guardados', icon: FiBookmark },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-[398px] -translate-x-1/2 rounded-full border border-[var(--mova-border)] bg-[var(--mova-surface)]/95 px-2 py-2 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <ul className="grid grid-cols-5 items-center text-center">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} aria-label={link.label} className="relative mx-auto grid h-12 place-items-center">
              {({ isActive }) => (
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={
                    link.featured
                      ? 'grid h-14 w-14 -translate-y-3 place-items-center rounded-full bg-[#C8FF3D] text-[2rem] text-black shadow-[0_0_32px_rgba(200,255,61,0.42)]'
                      : `grid h-11 w-11 place-items-center rounded-full text-[1.35rem] transition ${isActive ? 'bg-[#C8FF3D]/18 text-[#5f7f00]' : 'text-[var(--mova-muted)]'}`
                  }
                >
                  <link.icon />
                  {isActive && !link.featured && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-1 h-1 w-1 rounded-full bg-[#C8FF3D]" />
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
