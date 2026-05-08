export default function FilterChip({ label, active = false }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-ink text-white' : 'bg-white text-ink border border-black/10'
      }`}
      type="button"
    >
      {label}
    </button>
  );
}
