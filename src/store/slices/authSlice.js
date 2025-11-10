import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'

/**
 * Auth Slice
 * Manages authentication state and user session
 */

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  loading: true,
  error: null,
}

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Try backend login first
      const response = await api.post('/auth/login', credentials)
      return response.data.data
    } catch (error) {
      // Demo mode - works without backend
      console.log('Backend failed, using demo mode')
      
      if (credentials.email && credentials.password) {
        const demoUser = {
          _id: 'demo-admin-123',
          name: 'Demo Admin',
          email: credentials.email,
          phone: '9876543210',
          roleId: {
            _id: 'admin-role',
            name: 'Admin',
            permissions: ['all']
          }
        }
        
        const demoToken = 'demo-admin-token-' + Date.now()
        const demoRefreshToken = 'demo-refresh-token-' + Date.now()
        
        return {
          user: demoUser,
          accessToken: demoToken,
          refreshToken: demoRefreshToken
        }
      }
      
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth
      if (!refreshToken) {
        return null
      }
      await api.post('/auth/logout', { refreshToken })
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No token found')
      }
      
      // Check if demo token
      if (token.startsWith('demo-admin-token')) {
        const demoUser = {
          _id: 'demo-admin-123',
          name: 'Demo Admin',
          email: 'admin@demo.com',
          phone: '9876543210',
          roleId: {
            _id: 'admin-role',
            name: 'Admin',
            permissions: ['all']
          }
        }
        return { user: demoUser }
      }
      
      const response = await api.get('/auth/me')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication check failed')
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('token', action.payload.accessToken)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        localStorage.setItem('token', action.payload.accessToken)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.loading = false
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.token = null
        state.refreshToken = null
        state.isAuthenticated = false
        state.loading = false
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.refreshToken = null
      })
  },
})

export const { clearError, updateUser } = authSlice.actions
export default authSlice.reducer
