import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { asyncLogin } from '../states/auth/slice.js'

export default function LoginPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, status, error } = useSelector((s) => s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (token) navigate('/', { replace: true })
  }, [token, navigate])

  async function handleSubmit (e) {
    e.preventDefault()
    const result = await dispatch(asyncLogin({ email, password }))
    if (asyncLogin.fulfilled.match(result)) {
      toast.success('Selamat datang kembali! 👋')
      navigate('/', { replace: true })
    } else {
      toast.error(result.payload || 'Login gagal')
    }
  }

  return (
    <main className='max-w-md mx-auto px-6 py-12'>
      <h1 className='text-2xl font-semibold mb-1'>Login</h1>
      <p className='text-slate-400 text-sm mb-6'>
        Belum punya akun?{' '}
        <Link to='/register' className='text-emerald-300 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 rounded-sm'>
          Daftar di sini
        </Link>
        .
      </p>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Field id='email' label='Email' type='email' value={email} onChange={setEmail} autoComplete='email' />
        <Field id='password' label='Password' type='password' value={password} onChange={setPassword} autoComplete='current-password' />
        {error && (
          <p role='alert' className='text-red-300 text-sm font-mono lowercase'>
            {error}
          </p>
        )}
        <button type='submit' disabled={status === 'loading'} className='btn-primary w-full'>
          {status === 'loading' ? 'Memproses…' : 'Login'}
        </button>
      </form>
    </main>
  )
}

function Field ({ id, label, type, value, onChange, autoComplete }) {
  return (
    <div className='space-y-1.5'>
      <label htmlFor={id} className='text-sm text-slate-300 block'>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
        className='input'
      />
    </div>
  )
}
