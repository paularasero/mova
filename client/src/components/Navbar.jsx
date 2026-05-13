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
    <nav className="fixed bottom-4 left-1/2 z-40 w-[90%] max-w-[382px] -translate-x-1/2 rounded-[1.15rem] border border-white/10 bg-[#f5f5f0]/92 px-2 py-2 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
      <ul className="grid grid-cols-5 items-center text-center">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} aria-label={link.label} className="relative mx-auto grid h-12 place-items-center">
              {({ isActive }) => (
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={
                    link.featured
                      ? 'grid h-13 w-13 h-[3.25rem] w-[3.25rem] -translate-y-3 place-items-center rounded-[0.9rem] bg-[#FF8A3D] text-[1.9rem] text-[#0B0B0F] shadow-[0_14px_30px_rgba(255,138,61,.26)]'
                      : `grid h-10 w-10 place-items-center rounded-[0.8rem] text-[1.22rem] transition ${isActive ? 'bg-[#0B0B0F] text-white shadow-[0_8px_18px_rgba(0,0,0,.18)]' : 'text-[#0B0B0F]/55'}`
                  }
                >
                  <link.icon />
                  {isActive && !link.featured && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-[#FF8A3D]" />
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
