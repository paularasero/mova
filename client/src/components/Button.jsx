export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'w-full rounded-full py-4 text-base font-semibold transition duration-300 active:scale-[0.99]';

  const variants = {
    primary:
      'bg-limeAccent text-ink shadow-[0_10px_26px_rgba(168,210,53,0.25)] hover:brightness-[0.98]',
    secondary: 'bg-white text-ink border border-black/10 hover:bg-black/[0.02]',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
