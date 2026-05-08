export default function PlanCard({ plan }) {
  return (
    <article className="overflow-hidden rounded-4xl bg-white shadow-soft">
      <img src={plan.image || plan.imagen} alt={plan.titulo} className="h-44 w-full object-cover" loading="lazy" />
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-black/50">{plan.barrio}, {plan.ciudad}</p>
        <h3 className="text-lg font-bold text-ink">{plan.titulo}</h3>
        <p className="text-sm text-black/65">{plan.descripcion}</p>
        <div className="flex items-center justify-between text-sm font-medium text-black/70">
          <span>{plan.categoria}</span>
          <span>{plan.likes} likes</span>
        </div>
      </div>
    </article>
  );
}
