import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../components/Avatar.jsx'
import { asyncFetchLeaderboards } from '../states/leaderboards/slice.js'

export default function LeaderboardPage () {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector((s) => s.leaderboards)

  useEffect(() => {
    if (status === 'idle') dispatch(asyncFetchLeaderboards())
  }, [dispatch, status])

  return (
    <main className='max-w-2xl mx-auto px-6 py-8 space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold text-slate-100'>Leaderboard</h1>
        <p className='text-slate-400 text-sm'>Pengguna dengan skor tertinggi.</p>
      </header>

      {status === 'loading' && <p className='text-slate-400 text-sm'>Memuat…</p>}
      {error && (
        <p role='alert' className='text-red-300 text-sm font-mono lowercase'>
          {error}
        </p>
      )}

      {status === 'succeeded' && (
        <ol className='divide-y divide-slate-800'>
          {list.map((u, i) => {
            const isFirst = i === 0
            const rank = String(i + 1).padStart(2, '0')
            return (
              <li
                key={u.user.id}
                className='flex items-center gap-3 py-4 focus-visible:outline-none'
              >
                <span className='w-8 text-center font-mono text-xs text-slate-500'>
                  {rank}
                </span>
                <Avatar name={u.user.name} avatar={u.user.avatar} />
                <span className='flex-1 text-slate-100'>{u.user.name}</span>
                <span
                  className={[
                    'font-mono text-sm',
                    isFirst ? 'text-emerald-300' : 'text-slate-400'
                  ].join(' ')}
                >
                  {u.score}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </main>
  )
}
