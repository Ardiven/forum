import { useSelector } from 'react-redux'

function ThumbsUpIcon ({ filled }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill={filled ? 'currentColor' : 'none'}
      stroke='currentColor'
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3' />
    </svg>
  )
}

function ThumbsDownIcon ({ filled }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill={filled ? 'currentColor' : 'none'}
      stroke='currentColor'
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17' />
    </svg>
  )
}

export default function VoteButton ({ upVotesBy = [], downVotesBy = [], onVote }) {
  const userId = useSelector((s) => s.auth.user?.id)
  const authed = useSelector((s) => !!s.auth.token)

  const up = upVotesBy.length
  const down = downVotesBy.length
  const isUp = userId ? upVotesBy.includes(userId) : false
  const isDown = userId ? downVotesBy.includes(userId) : false

  return (
    <div className='inline-flex items-center gap-2 font-mono text-xs'>
      <button
        type='button'
        aria-pressed={isUp}
        aria-label={isUp ? 'Batal suka' : 'Suka'}
        disabled={!authed}
        onClick={() => onVote?.(isUp ? 'neutral' : 'up')}
        className={[
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
          isUp
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            : 'text-slate-400 hover:text-emerald-300 border border-transparent'
        ].join(' ')}
        title={authed ? (isUp ? 'Batal suka' : 'Suka') : 'Login untuk vote'}
      >
        <ThumbsUpIcon filled={isUp} />
        <span>{up}</span>
      </button>
      <button
        type='button'
        aria-pressed={isDown}
        aria-label={isDown ? 'Batal tidak suka' : 'Tidak suka'}
        disabled={!authed}
        onClick={() => onVote?.(isDown ? 'neutral' : 'down')}
        className={[
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-colors',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
          isDown
            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
            : 'text-slate-400 hover:text-red-300 border border-transparent'
        ].join(' ')}
        title={authed ? (isDown ? 'Batal tidak suka' : 'Tidak suka') : 'Login untuk vote'}
      >
        <ThumbsDownIcon filled={isDown} />
        <span>{down}</span>
      </button>
    </div>
  )
}
