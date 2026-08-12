import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { asyncRegister, asyncLogin } from '../states/auth/slice.js'

export default function RegisterPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit (e) {
    e.preventDefault()
    const result = await dispatch(asyncRegister({ name, email, password }))
    if (asyncRegister.fulfilled.match(result)) {
      toast.success('Akun berhasil dibuat! 🎉')
      await dispatch(asyncLogin({ email, password }))
      navigate('/', { replace: true })
    } else {
      toast.error(result.payload || 'Registrasi gagal')
    }
  }

  return (
    <main className='max-w-md mx-auto px-6 py-12'>
      <h1 className='text-2xl font-semibold mb-1'>Daftar Akun Baru</h1>
      <p className='text-slate-400 text-sm mb-6'>
        Sudah punya akun?{' '}
        <Link to='/login' className='text-emerald-300 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 rounded-sm'>
          Login di sini
        </Link>
        .
      </p>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Field id='name' label='Nama' type='text' value={name} onChange={setName} autoComplete='name' />
        <Field id='email' label='Email' type='email' value={email} onChange={setEmail} autoComplete='email' />
        <Field id='password' label='Password (min. 6 karakter)' type='password' value={password} onChange={setPassword} autoComplete='new-password' />
        {error && (
          <p role='alert' className='text-red-300 text-sm font-mono lowercase'>
            {error}
          </p>
        )}
        <button type='submit' disabled={status === 'loading'} className='btn-primary w-full'>
          {status === 'loading' ? 'Memproses…' : 'Daftar'}
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
