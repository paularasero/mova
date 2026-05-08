export default function UserAvatar({ src, alt = 'Usuario', size = 'md' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
      loading="lazy"
    />
  );
}
