import Avatar from './Avatar.jsx'
import VoteButton from './VoteButton.jsx'
import { timeAgo } from '../utils/time.js'

export default function CommentItem ({ comment, onVote }) {
  return (
    <article className='flex gap-3 border-t border-slate-800 py-4'>
      <Avatar name={comment.owner?.name} avatar={comment.owner?.avatar} />
      <div className='flex-1 min-w-0'>
        <header className='flex items-center gap-2 text-sm'>
          <span className='font-semibold text-slate-100'>{comment.owner?.name ?? 'anonim'}</span>
          <span className='text-xs text-slate-500 font-mono lowercase'>{timeAgo(comment.createdAt)}</span>
        </header>
        <p
          className='text-slate-300 text-sm mt-1 leading-relaxed'
          dangerouslySetInnerHTML={{ __html: comment.content ?? '' }}
        />
        <div className='mt-2'>
          <VoteButton
            upVotesBy={comment.upVotesBy ?? []}
            downVotesBy={comment.downVotesBy ?? []}
            onVote={(type) => onVote?.(comment.id, type)}
          />
        </div>
      </div>
    </article>
  )
}
