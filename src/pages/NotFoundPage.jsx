import { Link } from 'react-router-dom'

export default function NotFoundPage () {
  return (
    <main className='max-w-md mx-auto px-6 py-20 text-center space-y-6'>
      <p className='font-mono text-xs text-slate-500 lowercase'>error 404</p>
      <h1 className='text-3xl font-semibold text-slate-100'>
        Halaman tidak ditemukan
      </h1>
      <p className='text-slate-400 text-sm'>
        Tautan yang kamu buka tidak mengarah ke thread atau halaman mana pun.
      </p>
      <Link to='/' className='btn-secondary inline-block'>
        Kembali ke Forum
      </Link>
    </main>
  )
}
