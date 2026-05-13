import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiHome, FiMap, FiUser, FiUsers } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Home', icon: FiHome },
  { to: '/map', label: 'Mapa', icon: FiMap },
  { to: '/create', label: 'Crear', icon: IoAdd, featured: true },
  { to: '/community', label: 'Social', icon: FiUsers },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-[398px] -translate-x-1/2 rounded-[1.35rem] border border-white/12 bg-[#15151d]/90 px-2 py-2 shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
      <ul className="grid grid-cols-5 items-center text-center">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} aria-label={link.label} className="relative mx-auto grid h-12 place-items-center">
              {({ isActive }) => (
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={
                    link.featured
                      ? 'grid h-14 w-14 -translate-y-4 place-items-center rounded-[1rem] bg-[#FF74C8] text-[2rem] text-[#0B0B0F] shadow-[0_16px_36px_rgba(255,116,200,.28)]'
                      : `grid h-11 w-11 place-items-center rounded-[0.9rem] text-[1.3rem] transition ${isActive ? 'bg-white text-[#0B0B0F]' : 'text-white/58'}`
                  }
                >
                  <link.icon />
                  {isActive && !link.featured && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[#FF74C8]" />
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
