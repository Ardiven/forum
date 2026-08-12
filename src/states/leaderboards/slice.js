import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getLeaderboards } from '../../utils/api.js'

const initialState = {
  list: [],
  status: 'idle',
  error: null
}

export const asyncFetchLeaderboards = createAsyncThunk(
  'leaderboards/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getLeaderboards()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const slice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchLeaderboards.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(asyncFetchLeaderboards.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.list = a.payload.leaderboards ?? []
      })
      .addCase(asyncFetchLeaderboards.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Gagal memuat leaderboard'
      })
  }
})

export default slice.reducer
