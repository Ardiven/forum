import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { asyncCreateThread } from '../states/threads/slice.js'

export default function NewThreadPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authed = useSelector((s) => !!s.auth.token)
  const currentUser = useSelector((s) => s.auth.user ?? null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit (e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const payload = {
      title: title.trim(),
      body: body.trim(),
      ...(category.trim() ? { category: category.trim() } : {})
    }
    const result = await dispatch(asyncCreateThread({ payload, currentUser }))
    setLoading(false)
    if (asyncCreateThread.fulfilled.match(result)) {
      navigate(`/threads/${result.payload.thread.id}`)
    } else {
      setError(result.payload || 'Gagal membuat thread')
    }
  }

  if (!authed) {
    return (
      <main className='max-w-2xl mx-auto px-6 py-12 text-slate-300'>
        Kamu harus login dulu untuk membuat thread.
      </main>
    )
  }

  return (
    <main className='max-w-2xl mx-auto px-6 py-8 space-y-6'>
      <header>
        <h1 className='text-2xl font-semibold'>Buat Thread Baru</h1>
        <p className='text-slate-400 text-sm'>
          Bagikan ide, pertanyaan, atau diskusi baru.
        </p>
      </header>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Field id='title' label='Judul'>
          <input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='input'
          />
        </Field>
        <Field id='category' label='Kategori (opsional)'>
          <input
            id='category'
            type='text'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder='mis. react, redux'
            className='input'
          />
        </Field>
        <Field id='body' label='Isi'>
          <textarea
            id='body'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            required
            className='input leading-relaxed'
          />
        </Field>
        {error && (
          <p role='alert' className='text-red-300 text-sm font-mono lowercase'>
            {error}
          </p>
        )}
        <button type='submit' disabled={loading} className='btn-primary'>
          {loading ? 'Mengirim…' : 'Publikasikan'}
        </button>
      </form>
    </main>
  )
}

function Field ({ id, label, children }) {
  return (
    <div className='space-y-1.5'>
      <label htmlFor={id} className='text-sm text-slate-300 block'>
        {label}
      </label>
      {children}
    </div>
  )
}
