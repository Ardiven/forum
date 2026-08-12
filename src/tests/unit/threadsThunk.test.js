/**
 * Unit Tests — asyncFetchThreads & asyncCreateThread Thunk (threads/slice.js)
 *
 * Skenario pengujian:
 * 1. asyncFetchThreads sukses → thread dan user di-merge, owner disertakan
 * 2. asyncFetchThreads gagal → action rejected dengan pesan error
 * 3. asyncCreateThread sukses → thread baru dikembalikan dengan data owner
 * 4. asyncCreateThread gagal → action rejected dengan pesan error
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import threadsReducer, {
  asyncFetchThreads,
  asyncCreateThread
} from '../../states/threads/slice.js'
import * as api from '../../utils/api.js'

// Mock seluruh modul api.js — vi.mock() di-hoist otomatis oleh Vitest
vi.mock('../../utils/api.js', () => ({
  getThreads: vi.fn(),
  getUsers: vi.fn(),
  createThread: vi.fn(),
  putAccessToken: vi.fn()
}))

function makeStore () {
  return configureStore({
    reducer: { threads: threadsReducer }
  })
}

const mockUsers = [
  { id: 'user-1', name: 'User Satu', email: 'user1@test.com', avatar: '' },
  { id: 'user-2', name: 'User Dua', email: 'user2@test.com', avatar: '' }
]

const mockThreadsRaw = [
  {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Isi thread',
    category: 'general',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 0
  },
  {
    id: 'thread-2',
    title: 'Thread Kedua',
    body: 'Isi kedua',
    category: 'tech',
    createdAt: '2024-01-02T00:00:00.000Z',
    ownerId: 'user-2',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 5
  }
]

describe('threads thunk functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Skenario 1: asyncFetchThreads sukses — merge thread dengan owner
  it('asyncFetchThreads sukses harus menggabungkan thread dengan data owner-nya', async () => {
    api.getThreads.mockResolvedValueOnce({ threads: mockThreadsRaw })
    api.getUsers.mockResolvedValueOnce({ users: mockUsers })

    const store = makeStore()
    const result = await store.dispatch(asyncFetchThreads())

    expect(asyncFetchThreads.fulfilled.match(result)).toBe(true)

    const { threads } = result.payload
    expect(threads).toHaveLength(2)

    // Thread pertama harus memiliki owner dari user-1
    expect(threads[0].owner).toEqual(mockUsers[0])
    expect(threads[0].owner.name).toBe('User Satu')

    // Thread kedua harus memiliki owner dari user-2
    expect(threads[1].owner).toEqual(mockUsers[1])
    expect(threads[1].owner.name).toBe('User Dua')

    // State harus terupdate
    const state = store.getState()
    expect(state.threads.status).toBe('succeeded')
    expect(state.threads.list).toHaveLength(2)
  })

  // Skenario 2: asyncFetchThreads gagal
  it('asyncFetchThreads gagal harus dispatch rejected dengan pesan error', async () => {
    api.getThreads.mockRejectedValueOnce(new Error('Koneksi gagal'))
    api.getUsers.mockResolvedValueOnce({ users: [] })

    const store = makeStore()
    const result = await store.dispatch(asyncFetchThreads())

    expect(asyncFetchThreads.rejected.match(result)).toBe(true)
    expect(result.payload).toBe('Koneksi gagal')

    const state = store.getState()
    expect(state.threads.status).toBe('failed')
    expect(state.threads.error).toBe('Koneksi gagal')
  })

  // Skenario 3: asyncCreateThread sukses — thread dengan owner
  it('asyncCreateThread sukses harus menambahkan thread baru dengan owner ke list', async () => {
    const newThreadRaw = {
      id: 'thread-3',
      title: 'Thread Baru',
      body: 'Isi thread baru',
      category: 'news',
      createdAt: '2024-01-03T00:00:00.000Z',
      ownerId: 'user-1',
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0
    }
    const currentUser = mockUsers[0]

    api.createThread.mockResolvedValueOnce({ thread: newThreadRaw })

    const store = makeStore()
    const result = await store.dispatch(
      asyncCreateThread({
        payload: { title: 'Thread Baru', body: 'Isi thread baru', category: 'news' },
        currentUser
      })
    )

    expect(asyncCreateThread.fulfilled.match(result)).toBe(true)
    expect(result.payload.thread.id).toBe('thread-3')
    expect(result.payload.thread.owner).toEqual(currentUser)

    // Thread baru harus masuk ke state
    const state = store.getState()
    expect(state.threads.list).toHaveLength(1)
    expect(state.threads.list[0].owner.name).toBe('User Satu')
  })

  // Skenario 4: asyncCreateThread gagal
  it('asyncCreateThread gagal harus dispatch rejected dengan pesan error', async () => {
    api.createThread.mockRejectedValueOnce(new Error('Token expired'))

    const store = makeStore()
    const result = await store.dispatch(
      asyncCreateThread({
        payload: { title: 'Thread', body: 'Body', category: 'test' },
        currentUser: mockUsers[0]
      })
    )

    expect(asyncCreateThread.rejected.match(result)).toBe(true)
    expect(result.payload).toBe('Token expired')
  })
})
