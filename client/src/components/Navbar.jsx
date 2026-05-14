import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiHome, FiMap, FiUser, FiUsers } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';

const links = [
  { to: '/home', label: 'Home', icon: FiHome },
  { to: '/map', label: 'Mapa', icon: FiMap },
  { to: '/create', label: 'Crear', icon: IoAdd },
  { to: '/community', label: 'Social', icon: FiUsers },
  { to: '/profile', label: 'Perfil', icon: FiUser },
];

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[90%] max-w-[382px] -translate-x-1/2 rounded-[1rem] border border-[#F2EDEA]/10 bg-[#111215]/94 px-3 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-2xl">
      <ul className="flex h-14 items-center justify-between gap-1">
        {links.map((link) => (
          <li key={link.to} className="min-w-0">
            <NavLink to={link.to} aria-label={link.label} className="grid h-12 place-items-center">
              {({ isActive }) => (
                <motion.span
                  layout
                  whileTap={{ scale: 0.94 }}
                  animate={{
                    width: isActive ? 112 : 46,
                    backgroundColor: isActive ? '#F2EDEA' : 'rgba(242,237,234,0)',
                    color: isActive ? '#111215' : 'rgba(242,237,234,0.62)',
                  }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-[0.42rem] text-[1.32rem] font-semibold"
                >
                  <link.icon className="shrink-0" />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      className="whitespace-nowrap text-sm font-bold tracking-[-0.01em]"
                    >
                      {link.label}
                    </motion.span>
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
