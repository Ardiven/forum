import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getThreadDetail,
  createComment,
  voteThread,
  voteComment
} from '../../utils/api.js'

const initialState = {
  detail: null,
  optimisticSnapshots: {},
  status: 'idle',
  error: null
}

export const asyncFetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (id, { rejectWithValue }) => {
    try {
      return await getThreadDetail(id)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const asyncAddComment = createAsyncThunk(
  'threadDetail/addComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      return await createComment(threadId, { content })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const asyncVoteThread = createAsyncThunk(
  'threadDetail/voteThread',
  async ({ threadId, type, userId }, { rejectWithValue, dispatch }) => {
    try {
      await voteThread(threadId, type)
      dispatch(asyncFetchThreadDetail(threadId))
      return { threadId, type, userId }
    } catch (err) {
      return rejectWithValue({ message: err.message, threadId, type, userId })
    }
  }
)

export const asyncVoteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({ threadId, commentId, type, userId }, { rejectWithValue, dispatch }) => {
    try {
      await voteComment(threadId, commentId, type)
      dispatch(asyncFetchThreadDetail(threadId))
      return { threadId, commentId, type, userId }
    } catch (err) {
      return rejectWithValue({ message: err.message, threadId, commentId, type, userId })
    }
  }
)

function applyVote (arr, id, type, userId) {
  return arr.map((item) => {
    if (item.id !== id) return item
    const up = new Set(item.upVotesBy ?? [])
    const down = new Set(item.downVotesBy ?? [])
    if (type === 'up') {
      if (up.has(userId)) { up.delete(userId) } else { up.add(userId); down.delete(userId) }
    } else if (type === 'down') {
      if (down.has(userId)) { down.delete(userId) } else { down.add(userId); up.delete(userId) }
    } else {
      up.delete(userId); down.delete(userId)
    }
    return { ...item, upVotesBy: [...up], downVotesBy: [...down] }
  })
}

const slice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    clearDetail (state) {
      state.detail = null
      state.optimisticSnapshots = {}
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreadDetail.pending, (s) => {
        if (!s.detail) s.status = 'loading'
        s.error = null
      })
      .addCase(asyncFetchThreadDetail.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.detail = a.payload.detailThread
        s.optimisticSnapshots = {}
      })
      .addCase(asyncFetchThreadDetail.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Gagal memuat detail thread'
      })
      .addCase(asyncAddComment.fulfilled, (s, a) => {
        if (s.detail) {
          s.detail.comments = [...(s.detail.comments ?? []), a.payload.comment]
        }
      })
      .addCase(asyncVoteThread.pending, (s, a) => {
        if (!s.detail) return
        const { threadId, type, userId } = a.meta.arg
        if (!userId) return
        const key = `thread:${threadId}:${a.requestId}`
        s.optimisticSnapshots[key] = {
          kind: 'thread',
          requestId: a.requestId,
          snapshot: JSON.parse(JSON.stringify(s.detail))
        }
        s.detail = applyVote([s.detail], threadId, type, userId)[0]
      })
      .addCase(asyncVoteThread.fulfilled, (s, a) => {
        const key = `thread:${a.payload.threadId}:${a.meta.requestId}`
        delete s.optimisticSnapshots[key]
      })
      .addCase(asyncVoteThread.rejected, (s, a) => {
        if (!s.detail) return
        const { threadId, type, userId } = a.meta.arg
        if (!userId) return
        const key = `thread:${threadId}:${a.meta.requestId}`
        const snap = s.optimisticSnapshots[key]
        if (snap && snap.kind === 'thread') {
          s.detail = applyVote([snap.snapshot], threadId, type, userId)[0]
        }
        delete s.optimisticSnapshots[key]
      })
      .addCase(asyncVoteComment.pending, (s, a) => {
        if (!s.detail) return
        const { commentId, type, userId } = a.meta.arg
        if (!userId) return
        const key = `comment:${commentId}:${a.requestId}`
        s.optimisticSnapshots[key] = {
          kind: 'comment',
          requestId: a.requestId,
          snapshot: s.detail.comments
            ? JSON.parse(JSON.stringify(s.detail.comments))
            : []
        }
        s.detail.comments = applyVote(
          s.detail.comments ?? [],
          commentId,
          type,
          userId
        )
      })
      .addCase(asyncVoteComment.fulfilled, (s, a) => {
        const key = `comment:${a.payload.commentId}:${a.meta.requestId}`
        delete s.optimisticSnapshots[key]
      })
      .addCase(asyncVoteComment.rejected, (s, a) => {
        if (!s.detail) return
        const { commentId, userId } = a.meta.arg
        if (!userId) return
        const key = `comment:${commentId}:${a.meta.requestId}`
        const snap = s.optimisticSnapshots[key]
        if (snap && snap.kind === 'comment') {
          s.detail.comments = snap.snapshot
        }
        delete s.optimisticSnapshots[key]
      })
  }
})

export const { clearDetail } = slice.actions
export default slice.reducer
