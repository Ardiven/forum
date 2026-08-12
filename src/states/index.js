import { configureStore } from '@reduxjs/toolkit'
import auth from './auth/slice.js'
import threads from './threads/slice.js'
import threadDetail from './threadDetail/slice.js'
import leaderboards from './leaderboards/slice.js'
import loadingBar from './loadingBar/slice.js'
import { loadingMiddleware } from './middleware.js'

export const store = configureStore({
  reducer: { auth, threads, threadDetail, leaderboards, loadingBar },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(loadingMiddleware)
})
