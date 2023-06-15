import { createSlice } from '@reduxjs/toolkit'

export const controlSlice = createSlice({
  name: 'control',
  initialState: {
    source: null,
  },
  reducers: {
    setSource: (state, { payload }) => {
      state.source = payload
    },
  },
})

export const { setSource } = controlSlice.actions

export default controlSlice.reducer
