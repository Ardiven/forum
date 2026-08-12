import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as apiLogin, registerUser as apiRegister, getMyProfile, putAccessToken } from '../../utils/api.js'

const initialState = {
  token: null,
  user: null,
  status: 'idle',
  error: null
}

export const asyncLogin = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiLogin(payload)
      const token = data.token
      putAccessToken(token)
      localStorage.setItem('accessToken', token)
      return token
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const asyncRegister = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      await apiRegister(payload)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const asyncLogout = createAsyncThunk('auth/logout', async () => {
  putAccessToken(null)
  localStorage.removeItem('accessToken')
})

export const asyncFetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await getMyProfile()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateToken (state) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        state.token = token
        putAccessToken(token)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLogin.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(asyncLogin.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.token = a.payload
      })
      .addCase(asyncLogin.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Login gagal'
      })
      .addCase(asyncRegister.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(asyncRegister.fulfilled, (s) => {
        s.status = 'succeeded'
      })
      .addCase(asyncRegister.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Registrasi gagal'
      })
      .addCase(asyncLogout.fulfilled, (s) => {
        s.token = null
        s.user = null
      })
      .addCase(asyncFetchProfile.fulfilled, (s, a) => {
        s.user = a.payload?.user ?? a.payload
      })
      .addCase(asyncFetchProfile.rejected, (s) => {
        s.token = null
        s.user = null
      })
  }
})

export const { hydrateToken } = authSlice.actions
export default authSlice.reducer
