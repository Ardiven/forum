export default function CategoryFilter ({ categories, active, onChange }) {
  return (
    <div className='flex flex-wrap gap-2'>
      <Chip
        label='semua'
        active={active === '__all__'}
        onClick={() => onChange('__all__')}
      />
      {categories.map((c) => (
        <Chip
          key={c}
          label={`#${c}`}
          active={active === c}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}

function Chip ({ label, active, onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex items-center rounded-md px-2.5 py-1 font-mono text-xs',
        'transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
        active
          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          : 'text-slate-300 hover:text-slate-100 border border-transparent'
      ].join(' ')}
    >
      {label}
    </button>
  )
}
