import FilterChip from '../components/FilterChip';

export default function Explore() {
  const filtros = ['Montevideo', 'Hoy', 'Amigos', 'Comida'];

  return (
    <section className="mx-auto w-full max-w-md space-y-4 px-4 pb-28 pt-6">
      <h2 className="text-2xl font-bold tracking-tight text-ink">Explorar planes</h2>
      <div className="flex flex-wrap gap-2">
        {filtros.map((filtro, index) => (
          <FilterChip key={filtro} label={filtro} active={index === 0} />
        ))}
      </div>
      <p className="text-sm text-black/60">Filtros completos en la próxima iteración.</p>
    </section>
  );
}
