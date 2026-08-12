import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getThreads, getUsers, createThread } from '../../utils/api.js'

const initialState = {
  list: [],
  status: 'idle',
  error: null
}

export const asyncFetchThreads = createAsyncThunk(
  'threads/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const [threadsData, usersData] = await Promise.all([
        getThreads(),
        getUsers()
      ])

      const users = usersData.users ?? []

      const threadsWithOwner = (threadsData.threads ?? []).map((thread) => {
        const owner = users.find((u) => u.id === thread.ownerId) ?? null
        return { ...thread, owner }
      })

      return { threads: threadsWithOwner }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const asyncCreateThread = createAsyncThunk(
  'threads/create',
  async ({ payload, currentUser }, { rejectWithValue }) => {
    try {
      const data = await createThread(payload)
      const thread = data.thread
      return {
        thread: {
          ...thread,
          owner: currentUser ?? null
        }
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchThreads.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(asyncFetchThreads.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.list = a.payload.threads ?? []
      })
      .addCase(asyncFetchThreads.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Gagal memuat thread'
      })
      .addCase(asyncCreateThread.fulfilled, (s, a) => {
        s.list.unshift(a.payload.thread)
      })
  }
})

export default threadsSlice.reducer
