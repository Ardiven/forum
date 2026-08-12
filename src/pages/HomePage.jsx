import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ThreadItem from '../components/ThreadItem.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import { asyncFetchThreads } from '../states/threads/slice.js'

export default function HomePage () {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector((s) => s.threads)
  const authed = useSelector((s) => !!s.auth.token)

  const [category, setCategory] = useState('__all__')

  useEffect(() => {
    if (status === 'idle') dispatch(asyncFetchThreads())
  }, [dispatch, status])

  const categories = useMemo(() => {
    const set = new Set(list.map((t) => t.category).filter(Boolean))
    return [...set].sort()
  }, [list])

  const filtered = useMemo(() => {
    if (category === '__all__') return list
    return list.filter((t) => t.category === category)
  }, [list, category])

  return (
    <main className='max-w-4xl mx-auto px-6 py-8 space-y-6'>
      <header className='flex items-center justify-between flex-wrap gap-3'>
        <div>
          <h1 className='text-2xl font-semibold'>Forum Diskusi</h1>
          <p className='text-slate-400 text-sm'>
            {filtered.length} thread
            {category !== '__all__' && ` dalam #${category}`}
          </p>
        </div>
        {authed && (
          <Link to='/new' className='btn-primary'>
            + Buat Thread
          </Link>
        )}
      </header>

      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          active={category}
          onChange={setCategory}
        />
      )}

      {status === 'loading' && list.length === 0 && (
        <p className='text-slate-400 text-sm'>Memuat thread…</p>
      )}
      {error && <p className='text-red-400 text-sm'>{error}</p>}

      {status === 'succeeded' && filtered.length === 0 && (
        <p className='text-slate-500 text-sm'>Belum ada thread.</p>
      )}

      <div className='space-y-6'>
        {filtered.map((t) => (
          <ThreadItem key={t.id} thread={t} />
        ))}
      </div>
    </main>
  )
}
