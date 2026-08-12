/**
 * Unit Tests — threadsSlice Reducer
 *
 * Skenario pengujian:
 * 1. asyncFetchThreads.pending  → status harus 'loading', error harus null
 * 2. asyncFetchThreads.fulfilled → list thread harus terisi, status 'succeeded'
 * 3. asyncFetchThreads.rejected  → status 'failed', error harus terisi pesan
 * 4. asyncCreateThread.fulfilled → thread baru di-unshift ke awal list
 */

import { describe, it, expect } from 'vitest'
import reducer from '../../states/threads/slice.js'
import {
  asyncFetchThreads,
  asyncCreateThread
} from '../../states/threads/slice.js'

const initialState = {
  list: [],
  status: 'idle',
  error: null
}

const mockThread = {
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Isi thread pertama',
  category: 'general',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
  owner: { id: 'user-1', name: 'User Satu', avatar: '' }
}

const mockThread2 = {
  id: 'thread-2',
  title: 'Thread Kedua',
  body: 'Isi thread kedua',
  category: 'tech',
  createdAt: '2024-01-02T00:00:00.000Z',
  ownerId: 'user-2',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 3,
  owner: { id: 'user-2', name: 'User Dua', avatar: '' }
}

describe('threadsSlice reducer', () => {
  // Skenario 1: asyncFetchThreads.pending
  it('harus mengubah status menjadi loading saat asyncFetchThreads.pending', () => {
    const action = { type: asyncFetchThreads.pending.type }
    const state = reducer(initialState, action)

    expect(state.status).toBe('loading')
    expect(state.error).toBeNull()
  })

  // Skenario 2: asyncFetchThreads.fulfilled
  it('harus mengisi list thread dan status succeeded saat asyncFetchThreads.fulfilled', () => {
    const threads = [mockThread, mockThread2]
    const action = {
      type: asyncFetchThreads.fulfilled.type,
      payload: { threads }
    }
    const state = reducer(initialState, action)

    expect(state.status).toBe('succeeded')
    expect(state.list).toHaveLength(2)
    expect(state.list[0].id).toBe('thread-1')
    expect(state.list[1].id).toBe('thread-2')
  })

  // Skenario 3: asyncFetchThreads.rejected
  it('harus mengubah status menjadi failed dan mengisi error saat asyncFetchThreads.rejected', () => {
    const action = {
      type: asyncFetchThreads.rejected.type,
      payload: 'Gagal memuat thread'
    }
    const state = reducer(initialState, action)

    expect(state.status).toBe('failed')
    expect(state.error).toBe('Gagal memuat thread')
  })

  // Skenario 4: asyncCreateThread.fulfilled
  it('harus menambahkan thread baru di awal list saat asyncCreateThread.fulfilled', () => {
    const stateWithThreads = {
      ...initialState,
      list: [mockThread2],
      status: 'succeeded'
    }
    const action = {
      type: asyncCreateThread.fulfilled.type,
      payload: { thread: mockThread }
    }
    const state = reducer(stateWithThreads, action)

    expect(state.list).toHaveLength(2)
    // thread baru harus di index 0 (unshift)
    expect(state.list[0].id).toBe('thread-1')
    expect(state.list[1].id).toBe('thread-2')
  })
})
