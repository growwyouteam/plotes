import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'

const initialState = {
  colonies: [],
  currentColony: null,
  loading: false,
  error: null,
}

export const fetchColonies = createAsyncThunk(
  'colony/fetchColonies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/colonies')
      return response.data.data.colonies
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch colonies')
    }
  }
)

const colonySlice = createSlice({
  name: 'colony',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColonies.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchColonies.fulfilled, (state, action) => {
        state.loading = false
        state.colonies = action.payload
      })
      .addCase(fetchColonies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = colonySlice.actions
export default colonySlice.reducer
