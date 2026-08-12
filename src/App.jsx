import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import LoadingBar from './components/LoadingBar.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ThreadDetailPage from './pages/ThreadDetailPage.jsx'
import NewThreadPage from './pages/NewThreadPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { asyncLogout, asyncFetchProfile } from './states/auth/slice.js'

function Header () {
  const dispatch = useDispatch()
  const { token, user } = useSelector((s) => s.auth)

  function handleLogout () {
    dispatch(asyncLogout())
    toast.success('Sampai jumpa! 👋')
  }

  const linkClass = ({ isActive }) =>
    [
      'px-3 py-1.5 rounded-md text-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
      isActive
        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
    ].join(' ')

  return (
    <header className='border-b border-slate-800 sticky top-0 z-40 bg-slate-950'>
      <nav className='max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-3'>
        <Link
          to='/'
          className='text-emerald-300 font-semibold font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 rounded-sm'
        >
          forum.
        </Link>
        <ul className='flex items-center gap-1'>
          <li><NavLink to='/' end className={linkClass}>Threads</NavLink></li>
          <li><NavLink to='/leaderboard' className={linkClass}>Leaderboard</NavLink></li>
        </ul>
        <div className='flex items-center gap-2'>
          {token
            ? (
              <>
                <span className='text-sm text-slate-400 hidden sm:inline font-mono lowercase'>
                  {user?.name ?? 'user'}
                </span>
                <button type='button' onClick={handleLogout} className='btn-secondary'>
                  Logout
                </button>
              </>
              )
            : (
              <>
                <Link to='/login' className='btn-ghost'>Login</Link>
                <Link to='/register' className='btn-primary'>Daftar</Link>
              </>
              )}
        </div>
      </nav>
    </header>
  )
}

function RequireAuth ({ children }) {
  const token = useSelector((s) => s.auth.token)
  if (!token) return <Navigate to='/login' replace />
  return children
}

export default function App () {
  const dispatch = useDispatch()
  const token = useSelector((s) => s.auth.token)

  useEffect(() => {
    if (token) dispatch(asyncFetchProfile())
  }, [dispatch, token])

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <LoadingBar />
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/threads/:id' element={<ThreadDetailPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route
          path='/new'
          element={
            <RequireAuth>
              <NewThreadPage />
            </RequireAuth>
          }
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}
