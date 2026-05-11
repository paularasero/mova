import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiMapPin } from 'react-icons/fi';

export default function PlanCard({ plan, compact = false }) {
  const image = plan.image || plan.imagen;
  const title = plan.title || plan.titulo;
  const neighborhood = plan.neighborhood || plan.barrio;
  const city = plan.city || plan.ciudad;
  const category = plan.category || plan.categoria;
  const likes = plan.likes ?? 0;

  return (
    <motion.article whileTap={{ scale: 0.98 }}>
      <Link
        to={`/plan/${plan.id}`}
        className={`group relative block overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.06] shadow-[0_18px_50px_rgba(0,0,0,0.3)] ${compact ? 'h-44' : 'h-60'}`}
      >
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/24 to-black/88" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/70">
            <FiMapPin />
            <span>{neighborhood}, {city}</span>
          </div>
          <h3 className="text-lg font-bold leading-tight tracking-[-0.01em] text-white">{title}</h3>
          {!compact && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/68">{plan.description || plan.descripcion}</p>}
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-white/76">
            <span className="rounded-full bg-white/12 px-3 py-1">{category}</span>
            <span className="flex items-center gap-1"><FiHeart /> {likes}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
