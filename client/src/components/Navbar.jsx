import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiHome, FiMap, FiUser, FiUsers } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Home', icon: FiHome },
  { to: '/map', label: 'Mapa', icon: FiMap },
  { to: '/create', label: 'Crear', icon: IoAdd, featured: true },
  { to: '/community', label: 'Comunidad', icon: FiUsers },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[90%] max-w-[382px] -translate-x-1/2 rounded-[0.45rem] border border-white/10 bg-[#111215]/88 px-2 py-2 shadow-[0_16px_38px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
      <ul className="grid grid-cols-5 items-center text-center">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} aria-label={link.label} className="relative mx-auto grid h-12 place-items-center">
              {({ isActive }) => (
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  className={
                    link.featured
                      ? 'grid h-[3.15rem] w-[3.15rem] -translate-y-3 place-items-center rounded-[0.2rem] bg-[#FD7407] text-[1.9rem] text-[#111215] shadow-[0_12px_26px_rgba(253,116,7,.22)]'
                      : `grid h-10 w-10 place-items-center rounded-[0.18rem] text-[1.2rem] transition ${isActive ? 'bg-[#F2EDEA] text-[#111215]' : 'text-[#F2EDEA]/62 hover:text-[#F2EDEA]'}`
                  }
                >
                  <link.icon />
                </motion.span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
