import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiBookmark, FiHome, FiSearch, FiUser } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Home', icon: FiHome },
  { to: '/explore', label: 'Search', icon: FiSearch },
  { to: '/create', label: 'Crear', icon: IoAdd, featured: true },
  { to: '/saved', label: 'Guardados', icon: FiBookmark },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[92%] max-w-[398px] -translate-x-1/2 rounded-full border border-white/12 bg-[#101010]/92 px-2 py-2 shadow-[0_22px_70px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
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
                      : `grid h-11 w-11 place-items-center rounded-full text-[1.35rem] transition ${isActive ? 'bg-[#C8FF3D]/12 text-[#C8FF3D]' : 'text-white/72'}`
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
