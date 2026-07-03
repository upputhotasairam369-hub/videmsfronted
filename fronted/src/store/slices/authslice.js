import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export const loginWithOtp = createAsyncThunk(
  'auth/loginWithOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOtp({ phone, otp });
      localStorage.setItem('token', response.data.token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Verification failed'
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.me();
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data);
    }
  }
);

// New Thunk: Sends user data (like name/email) to Django database
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      state.otpSent = false;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Initial Login Flow
      .addCase(loginWithOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2. The Persistence Fix (Runs on page refresh via App.jsx)
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true; // Safely holds the login state
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // 3. Update Profile Flow
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Updates the UI instantly after DB save
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setOtpSent, clearError } = authSlice.actions;
export default authSlice.reducer;