export default function Avatar ({ name, avatar, size = 32 }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase()
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || 'avatar'}
        width={size}
        height={size}
        className='rounded-full object-cover border border-slate-700'
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className='inline-flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 text-sm font-semibold border border-emerald-500/20 font-mono'
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {initial}
    </span>
  )
}
