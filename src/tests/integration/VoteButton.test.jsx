/**
 * Integration Tests — VoteButton Component
 *
 * Skenario pengujian:
 * 1. Tombol upvote dan downvote disabled jika user tidak login (tidak ada token)
 * 2. Tombol aktif (tidak disabled) jika user sudah login
 * 3. Klik upvote saat sudah di-upvote → onVote dipanggil dengan argumen 'neutral'
 * 4. Klik downvote saat belum di-vote → onVote dipanggil dengan argumen 'down'
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import VoteButton from '../../components/VoteButton.jsx'
import authReducer from '../../states/auth/slice.js'

// Helper membuat store dengan state auth tertentu
function makeStore (authState = {}) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        token: null,
        user: null,
        status: 'idle',
        error: null,
        ...authState
      }
    }
  })
}

function renderVoteButton ({ authState = {}, upVotesBy = [], downVotesBy = [], onVote = vi.fn() } = {}) {
  const store = makeStore(authState)
  return {
    onVote,
    ...render(
      <Provider store={store}>
        <VoteButton
          upVotesBy={upVotesBy}
          downVotesBy={downVotesBy}
          onVote={onVote}
        />
      </Provider>
    )
  }
}

describe('VoteButton component', () => {
  // Skenario 1: Tombol disabled jika tidak login
  it('harus merender tombol upvote dan downvote dalam kondisi disabled jika user tidak login', () => {
    renderVoteButton({ authState: { token: null, user: null } })

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })

  // Skenario 2: Tombol aktif jika sudah login
  it('harus merender tombol dalam kondisi aktif (tidak disabled) jika user sudah login', () => {
    renderVoteButton({
      authState: {
        token: 'valid-token',
        user: { id: 'user-1', name: 'User Test' }
      }
    })

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled()
    })
  })

  // Skenario 3: Klik upvote saat sudah upvote → panggil onVote('neutral')
  it('harus memanggil onVote dengan "neutral" saat tombol upvote diklik ketika sudah di-upvote', async () => {
    const user = userEvent.setup()
    const onVote = vi.fn()

    renderVoteButton({
      authState: {
        token: 'valid-token',
        user: { id: 'user-1', name: 'User Test' }
      },
      upVotesBy: ['user-1'], // user sudah upvote
      downVotesBy: [],
      onVote
    })

    const upButton = screen.getByRole('button', { name: /batal suka/i })
    await user.click(upButton)

    expect(onVote).toHaveBeenCalledOnce()
    expect(onVote).toHaveBeenCalledWith('neutral')
  })

  // Skenario 4: Klik downvote saat belum vote → panggil onVote('down')
  it('harus memanggil onVote dengan "down" saat tombol downvote diklik ketika belum pernah vote', async () => {
    const user = userEvent.setup()
    const onVote = vi.fn()

    renderVoteButton({
      authState: {
        token: 'valid-token',
        user: { id: 'user-1', name: 'User Test' }
      },
      upVotesBy: [],
      downVotesBy: [], // belum ada vote
      onVote
    })

    const downButton = screen.getByRole('button', { name: /tidak suka/i })
    await user.click(downButton)

    expect(onVote).toHaveBeenCalledOnce()
    expect(onVote).toHaveBeenCalledWith('down')
  })
})
