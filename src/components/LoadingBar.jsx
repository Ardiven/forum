import { useSelector } from 'react-redux'

export default function LoadingBar () {
  const visible = useSelector((s) => s.loadingBar.visible)
  if (!visible) return null
  return (
    <div
      role='progressbar'
      aria-busy='true'
      aria-label='Memuat data'
      className='fixed top-0 left-0 right-0 h-px bg-emerald-400 animate-pulse z-50'
    />
  )
}
