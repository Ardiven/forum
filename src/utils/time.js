const UNITS = [
  { ms: 365 * 24 * 60 * 60 * 1000, label: 'tahun' },
  { ms: 30 * 24 * 60 * 60 * 1000, label: 'bulan' },
  { ms: 7 * 24 * 60 * 60 * 1000, label: 'minggu' },
  { ms: 24 * 60 * 60 * 1000, label: 'hari' },
  { ms: 60 * 60 * 1000, label: 'jam' },
  { ms: 60 * 1000, label: 'menit' },
  { ms: 1000, label: 'detik' }
]

export function timeAgo (iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(diff)) return ''
  for (const u of UNITS) {
    if (diff >= u.ms) {
      const value = Math.floor(diff / u.ms)
      return `${value} ${u.label} yang lalu`
    }
  }
  return 'baru saja'
}
