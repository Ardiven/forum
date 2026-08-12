import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 * Jalankan dengan: npm run e2e
 * Pastikan aplikasi sudah berjalan di port 5173 (npm run dev) sebelum menjalankan E2E
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Batas waktu maksimum per test */
  timeout: 30 * 1000,
  /* Batas waktu assertion */
  expect: {
    timeout: 5000
  },
  /* Jalankan test secara seri (lebih mudah di-debug) */
  fullyParallel: false,
  /* Gagalkan build jika ada test.only tertinggal */
  forbidOnly: !!process.env.CI,
  /* Jangan retry di CI */
  retries: process.env.CI ? 0 : 0,
  /* Reporter */
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    /* Base URL agar bisa pakai relative path seperti page.goto('/login') */
    baseURL: 'http://localhost:5173',
    /* Simpan trace untuk debugging saat test gagal */
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  /* Otomatis jalankan dev server sebelum E2E (hanya di lokal) */
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 30 * 1000
      }
})
