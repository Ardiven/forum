import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  active: 0,
  visible: false
}

const slice = createSlice({
  name: 'loadingBar',
  initialState,
  reducers: {
    showLoading: (s) => {
      s.active += 1
      s.visible = true
    },
    hideLoading: (s) => {
      s.active = Math.max(0, s.active - 1)
      if (s.active === 0) s.visible = false
    }
  }
})

export const { showLoading, hideLoading } = slice.actions
export default slice.reducer
