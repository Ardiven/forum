import { Link } from 'react-router-dom'
import Avatar from './Avatar.jsx'
import { timeAgo } from '../utils/time.js'

export default function ThreadItem ({ thread }) {
  return (
    <article className='card hover:border-emerald-500/30 transition-colors'>
      <header className='flex items-start gap-3'>
        <Avatar name={thread.owner?.name} avatar={thread.owner?.avatar} />
        <div className='flex-1 min-w-0'>
          <Link
            to={`/threads/${thread.id}`}
            className='block text-lg font-semibold text-slate-100 hover:text-emerald-300 truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 rounded-sm'
          >
            {thread.title}
          </Link>
          <p className='text-xs text-slate-500 mt-0.5 font-mono lowercase'>
            {thread.owner?.name ?? 'anonim'} · {timeAgo(thread.createdAt)}
          </p>
        </div>
        <span className='text-xs text-slate-400 shrink-0 font-mono'>
          {thread.totalComments ?? 0} komentar
        </span>
      </header>
      <p
        className='text-slate-400 text-sm mt-3 line-clamp-3 leading-relaxed'
        dangerouslySetInnerHTML={{ __html: thread.body?.slice(0, 200) ?? '' }}
      />
      {thread.category && (
        <div className='flex items-center gap-2 mt-3'>
          <span className='font-mono text-xs text-emerald-300'>#{thread.category}</span>
        </div>
      )}
    </article>
  )
}
