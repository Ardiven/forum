import { showLoading, hideLoading } from './loadingBar/slice.js'

export const loadingMiddleware = () => (next) => (action) => {
  if (typeof action.type !== 'string' || !action.type.startsWith('async')) {
    return next(action)
  }

  const pending = action.type.endsWith('/pending')
  const settled = action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')

  if (pending) {
    next(action)
    showLoading()
    return
  }
  if (settled) {
    next(action)
    queueMicrotask(() => hideLoading())
    return
  }
  return next(action)
}
