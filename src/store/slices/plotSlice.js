import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'

const initialState = {
  plots: [],
  currentPlot: null,
  loading: false,
  error: null,
}

export const fetchPlots = createAsyncThunk(
  'plot/fetchPlots',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/plots', { params })
      return response.data.data.plots
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plots')
    }
  }
)

const plotSlice = createSlice({
  name: 'plot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPlot: (state, action) => {
      state.currentPlot = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlots.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPlots.fulfilled, (state, action) => {
        state.loading = false
        state.plots = action.payload
      })
      .addCase(fetchPlots.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setCurrentPlot } = plotSlice.actions
export default plotSlice.reducer
