/**
 * Unit Tests — asyncLogin & asyncFetchProfile Thunk (auth/slice.js)
 *
 * Skenario pengujian:
 * 1. asyncLogin sukses → token dikembalikan, putAccessToken dipanggil
 * 2. asyncLogin gagal → action rejected di-dispatch dengan pesan error
 * 3. asyncFetchProfile sukses → fulfilled dengan data user
 * 4. asyncFetchProfile gagal → rejected, token & user dibersihkan di state
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, {
  asyncLogin,
  asyncFetchProfile
} from '../../states/auth/slice.js'
import * as api from '../../utils/api.js'

// Mock seluruh modul api.js — vi.mock() di-hoist otomatis oleh Vitest
vi.mock('../../utils/api.js', () => ({
  login: vi.fn(),
  getMyProfile: vi.fn(),
  putAccessToken: vi.fn(),
  registerUser: vi.fn()
}))

function makeStore() {
  return configureStore({
    reducer: { auth: authReducer }
  })
}

describe('auth thunk functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Bersihkan localStorage sebelum setiap tes
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // Skenario 1: asyncLogin sukses
  it('asyncLogin sukses harus menyimpan token dan memanggil putAccessToken', async () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake'
    api.login.mockResolvedValueOnce({ token: fakeToken })

    const store = makeStore()
    const result = await store.dispatch(asyncLogin({ email: 'user@test.com', password: 'pass123' }))

    // Action harus fulfilled
    expect(asyncLogin.fulfilled.match(result)).toBe(true)
    expect(result.payload).toBe(fakeToken)

    // putAccessToken harus dipanggil dengan token
    expect(api.putAccessToken).toHaveBeenCalledWith(fakeToken)

    // State auth.token harus terisi
    const state = store.getState()
    expect(state.auth.token).toBe(fakeToken)
    expect(state.auth.status).toBe('succeeded')
  })

  // Skenario 2: asyncLogin gagal
  it('asyncLogin gagal harus dispatch rejected dengan pesan error', async () => {
    api.login.mockRejectedValueOnce(new Error('Email atau password salah'))

    const store = makeStore()
    const result = await store.dispatch(asyncLogin({ email: 'wrong@test.com', password: 'salah' }))

    // Action harus rejected
    expect(asyncLogin.rejected.match(result)).toBe(true)
    expect(result.payload).toBe('Email atau password salah')

    // State harus failed
    const state = store.getState()
    expect(state.auth.status).toBe('failed')
    expect(state.auth.error).toBe('Email atau password salah')
    expect(state.auth.token).toBeNull()
  })

  // Skenario 3: asyncFetchProfile sukses
  it('asyncFetchProfile sukses harus mengisi state.auth.user dengan data profil', async () => {
    const fakeUser = { id: 'user-1', name: 'User Test', email: 'user@test.com', avatar: '' }
    api.getMyProfile.mockResolvedValueOnce({ user: fakeUser })

    const store = makeStore()
    const result = await store.dispatch(asyncFetchProfile())

    expect(asyncFetchProfile.fulfilled.match(result)).toBe(true)

    const state = store.getState()
    expect(state.auth.user).toEqual(fakeUser)
  })

  // Skenario 4: asyncFetchProfile gagal
  it('asyncFetchProfile gagal harus membersihkan token dan user dari state', async () => {
    api.getMyProfile.mockRejectedValueOnce(new Error('Token tidak valid'))

    // Buat store dengan token yang sudah ada
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: {
          token: 'fake-expired-token',
          user: null,
          status: 'idle',
          error: null
        }
      }
    })

    await store.dispatch(asyncFetchProfile())

    const state = store.getState()
    // token dan user harus dibersihkan karena profile fetch gagal
    expect(state.auth.token).toBeNull()
    expect(state.auth.user).toBeNull()
  })
})
