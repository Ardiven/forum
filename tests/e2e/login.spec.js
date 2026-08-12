/**
 * E2E Tests — Alur Login (Playwright)
 *
 * Skenario pengujian:
 * 1. Login dengan kredensial yang valid → redirect ke homepage, nama user tampil di header
 * 2. Login dengan password yang salah → pesan error muncul, tetap di halaman login
 * 3. Submit form kosong → browser validation mencegah submit (field required)
 *
 * Catatan: Gunakan akun test yang sudah ada di forum-api.dicoding.dev
 * Isi EMAIL_TEST dan PASSWORD_TEST di environment atau ganti langsung di sini.
 */

import { test, expect } from '@playwright/test'

// Gunakan environment variable untuk kredensial, atau ganti langsung (hanya untuk testing)
const TEST_EMAIL = process.env.TEST_EMAIL || 'dicoding@gmail.com'
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'dicoding'

test.describe('Alur Login Aplikasi Forum Diskusi', () => {
  test.beforeEach(async ({ page }) => {
    // Bersihkan localStorage sebelum setiap tes agar kondisi fresh
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)
  })

  // Skenario 1: Login berhasil dengan kredensial valid
  test('login dengan kredensial valid harus redirect ke homepage dan menampilkan nama user', async ({ page }) => {
    // Isi form login
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)

    // Submit form
    await page.click('button[type="submit"]')

    // Harus redirect ke homepage
    await expect(page).toHaveURL('/', { timeout: 10000 })

    // Header harus menampilkan nama user atau tombol logout (bukan login/daftar)
    const logoutButton = page.getByRole('button', { name: /logout/i })
    await expect(logoutButton).toBeVisible({ timeout: 10000 })
  })

  // Skenario 2: Login dengan password salah → error muncul
  test('login dengan password salah harus menampilkan pesan error dan tetap di halaman login', async ({ page }) => {
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', 'password-salah-banget-123')

    await page.click('button[type="submit"]')

    // Harus tetap di halaman login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })

    // Pesan error harus muncul (role="alert")
    const errorMessage = page.getByRole('alert')
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
    await expect(errorMessage).not.toBeEmpty()
  })

  // Skenario 3: Submit form kosong → HTML validation mencegah submit
  test('submit form kosong harus dicegah oleh validasi HTML (field required)', async ({ page }) => {
    // Tidak mengisi apapun, langsung klik submit
    await page.click('button[type="submit"]')

    // Harus tetap di halaman login (browser mencegah submit)
    await expect(page).toHaveURL(/\/login/)

    // Tidak ada redirect atau error message dari server
    const errorAlert = page.getByRole('alert')
    await expect(errorAlert).not.toBeVisible()
  })
})
