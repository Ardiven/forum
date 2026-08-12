import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar.jsx'
import CommentItem from '../components/CommentItem.jsx'
import VoteButton from '../components/VoteButton.jsx'
import { timeAgo } from '../utils/time.js'
import {
  asyncFetchThreadDetail,
  asyncAddComment,
  asyncVoteThread,
  asyncVoteComment,
  clearDetail
} from '../states/threadDetail/slice.js'

export default function ThreadDetailPage () {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { detail, status, error } = useSelector((s) => s.threadDetail)
  const authed = useSelector((s) => !!s.auth.token)
  const userId = useSelector((s) => s.auth.user?.id ?? null)

  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(clearDetail())
    dispatch(asyncFetchThreadDetail(id))
    return () => dispatch(clearDetail())
  }, [dispatch, id])

  async function handleSubmitComment (e) {
    e.preventDefault()
    if (!comment.trim()) return
    const result = await dispatch(asyncAddComment({ threadId: id, content: comment.trim() }))
    if (asyncAddComment.fulfilled.match(result)) setComment('')
  }

  function handleVoteThread (type) {
    dispatch(asyncVoteThread({ threadId: id, type, userId }))
  }
  function handleVoteComment (commentId, type) {
    dispatch(asyncVoteComment({ threadId: id, commentId, type, userId }))
  }

  if (status === 'loading' || (status === 'idle' && !detail)) {
    return <p className='max-w-3xl mx-auto px-6 py-8 text-slate-400 text-sm'>Memuat thread…</p>
  }
  if (status === 'failed') {
    return (
      <main className='max-w-3xl mx-auto px-6 py-8 space-y-3'>
        <p role='alert' className='text-red-300 text-sm font-mono lowercase'>{error}</p>
        <button type='button' onClick={() => navigate(-1)} className='btn-ghost'>
          ← Kembali
        </button>
      </main>
    )
  }
  if (!detail) return null

  return (
    <main className='max-w-3xl mx-auto px-6 py-8 space-y-6'>
      <Link to='/' className='text-sm text-slate-400 hover:text-slate-100 inline-block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 rounded-sm'>
        ← Semua thread
      </Link>

      <article className='space-y-4 border-b border-slate-800 pb-6'>
        <header className='flex items-start gap-3'>
          <Avatar name={detail.owner?.name} avatar={detail.owner?.avatar} size={40} />
          <div className='flex-1 min-w-0'>
            <h1 className='text-2xl font-bold text-slate-100'>{detail.title}</h1>
            <p className='text-xs text-slate-500 mt-1 font-mono lowercase'>
              {detail.owner?.name ?? 'anonim'} · {timeAgo(detail.createdAt)}
              {detail.category && (
                <>
                  {' · '}
                  <span className='text-emerald-300'>#{detail.category}</span>
                </>
              )}
            </p>
          </div>
        </header>
        <div
          className='text-slate-300 text-sm leading-relaxed whitespace-pre-line'
          dangerouslySetInnerHTML={{ __html: detail.body ?? '' }}
        />
        <div className='flex items-center justify-between'>
          <VoteButton
            upVotesBy={detail.upVotesBy ?? []}
            downVotesBy={detail.downVotesBy ?? []}
            onVote={handleVoteThread}
          />
          <span className='text-xs text-slate-500 font-mono'>
            {(detail.comments ?? []).length} komentar
          </span>
        </div>
      </article>

      <section>
        <h2 className='text-lg font-semibold text-slate-100 mb-3'>Komentar</h2>
        {(detail.comments ?? []).length === 0
          ? (
            <p className='text-slate-500 text-sm'>Belum ada komentar.</p>
            )
          : (
            <div>
              {(detail.comments ?? []).map((c) => (
                <CommentItem key={c.id} comment={c} onVote={handleVoteComment} />
              ))}
            </div>
            )}

        {authed
          ? (
            <form onSubmit={handleSubmitComment} className='mt-4 space-y-2'>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder='Tulis komentar…'
                className='input leading-relaxed'
              />
              <div className='flex justify-end'>
                <button type='submit' className='btn-primary'>
                  Kirim
                </button>
              </div>
            </form>
            )
          : (
            <p className='text-sm text-slate-400 mt-3'>
              <Link to='/login' className='text-emerald-300 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 rounded-sm'>Login</Link>
              {' '}untuk menulis komentar atau vote.
            </p>
            )}
      </section>
    </main>
  )
}
