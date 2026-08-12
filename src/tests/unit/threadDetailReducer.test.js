/**
 * Unit Tests — threadDetailSlice Reducer
 *
 * Skenario pengujian:
 * 1. clearDetail → mereset seluruh state ke initial state
 * 2. asyncVoteThread.pending → optimistic upvote langsung diterapkan ke detail
 * 3. asyncVoteThread.rejected → state di-revert dari snapshot optimistic
 * 4. asyncAddComment.fulfilled → komentar baru ditambahkan ke detail.comments
 */

import { describe, it, expect } from 'vitest'
import reducer, {
  clearDetail,
  asyncVoteThread,
  asyncAddComment
} from '../../states/threadDetail/slice.js'

const mockDetail = {
  id: 'thread-1',
  title: 'Thread Test',
  body: 'Isi thread test',
  category: 'general',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'User Satu', avatar: '' },
  upVotesBy: [],
  downVotesBy: [],
  comments: []
}

const initialState = {
  detail: null,
  optimisticSnapshots: {},
  status: 'idle',
  error: null
}

describe('threadDetailSlice reducer', () => {
  // Skenario 1: clearDetail action
  it('harus mereset semua state ke initial saat clearDetail di-dispatch', () => {
    const populatedState = {
      detail: mockDetail,
      optimisticSnapshots: { 'thread:thread-1:req-1': {} },
      status: 'succeeded',
      error: null
    }

    const state = reducer(populatedState, clearDetail())

    expect(state.detail).toBeNull()
    expect(state.optimisticSnapshots).toEqual({})
    expect(state.status).toBe('idle')
    expect(state.error).toBeNull()
  })

  // Skenario 2: asyncVoteThread.pending → optimistic upvote
  it('harus menerapkan optimistic upvote ke detail saat asyncVoteThread.pending', () => {
    const stateWithDetail = {
      ...initialState,
      detail: { ...mockDetail, upVotesBy: [], downVotesBy: [] },
      status: 'succeeded'
    }

    // Redux Toolkit puts requestId directly on the action AND on meta
    const action = {
      type: asyncVoteThread.pending.type,
      requestId: 'req-123',
      meta: {
        arg: { threadId: 'thread-1', type: 'up', userId: 'user-2' },
        requestId: 'req-123'
      }
    }

    const state = reducer(stateWithDetail, action)

    // Optimistic update: user-2 harus ada di upVotesBy
    expect(state.detail.upVotesBy).toContain('user-2')
    expect(state.detail.downVotesBy).not.toContain('user-2')
    // Snapshot harus tersimpan dengan key menggunakan a.requestId (bukan a.meta.requestId)
    expect(state.optimisticSnapshots['thread:thread-1:req-123']).toBeDefined()
  })

  // Skenario 3: asyncVoteThread.rejected → snapshot dihapus, state diproses ulang dari snapshot
  it('harus menghapus snapshot dan memproses ulang state dari snapshot saat asyncVoteThread.rejected', () => {
    // Skenario: user sudah memiliki upvote sebelum optimistic action
    // Optimistic action menambah upvote user-2
    // Saat rejected, slice menerapkan applyVote pada snapshot dengan tipe yang sama
    // Snapshot: upVotesBy: ['user-2'] (sudah ada sebelumnya)
    // applyVote(['user-2'], 'up', 'user-2') → user-2 sudah ada → dihapus (toggle off) → []
    const detailWithExistingVote = { ...mockDetail, upVotesBy: ['user-2'], downVotesBy: [] }

    const stateAfterOptimistic = {
      detail: { ...mockDetail, upVotesBy: [], downVotesBy: [] }, // setelah toggle-off optimistic
      status: 'succeeded',
      error: null,
      optimisticSnapshots: {
        'thread:thread-1:req-123': {
          kind: 'thread',
          requestId: 'req-123',
          snapshot: detailWithExistingVote // snapshot sebelum toggle-off
        }
      }
    }

    // rejected handler menggunakan a.meta.requestId untuk lookup key
    const action = {
      type: asyncVoteThread.rejected.type,
      requestId: 'req-123',
      meta: {
        arg: { threadId: 'thread-1', type: 'up', userId: 'user-2' },
        requestId: 'req-123'
      },
      payload: { message: 'Gagal vote', threadId: 'thread-1', type: 'up', userId: 'user-2' }
    }

    const state = reducer(stateAfterOptimistic, action)

    // Snapshot dihapus setelah revert
    expect(state.optimisticSnapshots['thread:thread-1:req-123']).toBeUndefined()
    // applyVote(snapshot['user-2'], 'up', 'user-2') → toggle off → user-2 dihapus dari upVotesBy
    expect(state.detail.upVotesBy).not.toContain('user-2')
  })

  // Skenario 4: asyncAddComment.fulfilled → komentar baru ditambahkan
  it('harus menambahkan komentar baru ke detail.comments saat asyncAddComment.fulfilled', () => {
    const stateWithDetail = {
      ...initialState,
      detail: { ...mockDetail, comments: [] },
      status: 'succeeded'
    }

    const newComment = {
      id: 'comment-1',
      content: 'Komentar pertama',
      createdAt: '2024-01-01T01:00:00.000Z',
      owner: { id: 'user-3', name: 'User Tiga', avatar: '' },
      upVotesBy: [],
      downVotesBy: []
    }

    const action = {
      type: asyncAddComment.fulfilled.type,
      payload: { comment: newComment }
    }

    const state = reducer(stateWithDetail, action)

    expect(state.detail.comments).toHaveLength(1)
    expect(state.detail.comments[0].id).toBe('comment-1')
    expect(state.detail.comments[0].content).toBe('Komentar pertama')
  })
})
