/**
 * Integration Tests — ThreadItem Component
 *
 * Skenario pengujian:
 * 1. Render judul thread sebagai link yang mengarah ke /threads/:id
 * 2. Render nama owner dan waktu relatif di bawah judul
 * 3. Render kategori thread dengan prefix '#'
 * 4. Tidak merender elemen kategori jika category tidak ada
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ThreadItem from '../../components/ThreadItem.jsx'

// Helper untuk render dengan MemoryRouter (ThreadItem menggunakan Link)
function renderWithRouter (thread) {
  return render(
    <MemoryRouter>
      <ThreadItem thread={thread} />
    </MemoryRouter>
  )
}

const baseThread = {
  id: 'thread-abc123',
  title: 'Cara Belajar React dengan Efektif',
  body: '<p>Konten thread tentang belajar React</p>',
  category: 'react',
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam lalu
  owner: { id: 'user-1', name: 'Budi Santoso', avatar: '' },
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 7
}

describe('ThreadItem component', () => {
  // Skenario 1: Judul sebagai link ke halaman detail thread
  it('harus merender judul thread sebagai link yang mengarah ke /threads/:id', () => {
    renderWithRouter(baseThread)

    const titleLink = screen.getByRole('link', { name: /cara belajar react/i })
    expect(titleLink).toBeInTheDocument()
    expect(titleLink).toHaveAttribute('href', '/threads/thread-abc123')
  })

  // Skenario 2: Nama owner dan jumlah komentar
  it('harus merender nama owner dan jumlah komentar', () => {
    renderWithRouter(baseThread)

    // Nama owner harus tampil
    expect(screen.getByText(/budi santoso/i)).toBeInTheDocument()

    // Jumlah komentar harus tampil
    expect(screen.getByText(/7 komentar/i)).toBeInTheDocument()
  })

  // Skenario 3: Kategori dengan prefix '#'
  it('harus merender kategori dengan prefix "#" jika category ada', () => {
    renderWithRouter(baseThread)

    const category = screen.getByText('#react')
    expect(category).toBeInTheDocument()
  })

  // Skenario 4: Tanpa kategori
  it('tidak boleh merender elemen kategori jika category tidak ada', () => {
    const threadWithoutCategory = { ...baseThread, category: '' }
    renderWithRouter(threadWithoutCategory)

    // Tidak ada teks yang dimulai dengan '#'
    const categoryEl = screen.queryByText(/^#/)
    expect(categoryEl).not.toBeInTheDocument()
  })
})
