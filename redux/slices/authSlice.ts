import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }: { email: string; password: string; role: string }, thunkAPI) => {
    try {
      const response = await api.post(`/auth/login`, { email, password, role });
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue('Invalid credentials');
    }
  }
);

// Async thunk for seller registration
export const registerSeller = createAsyncThunk(
  'auth/registerSeller',
  async (sellerData: any, thunkAPI) => {
    try {
      const response = await api.post(`/sellers/register`, sellerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Seller registration failed');
    }
  }
);
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp, role }: { email: string; otp: string; role: string }, thunkAPI) => {
    try {
      const response = await api.post(`/auth/otp/verify`, { email, otp, role });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('OTP verification failed');
    }
  }
);

// Async thunk for buyer registration
export const registerBuyer = createAsyncThunk(
  'auth/registerBuyer',
  async (buyerData: any, thunkAPI) => {
    try {
      const response = await api.post(`/buyers/register`, buyerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Buyer registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      AsyncStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Seller registration reducers
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Buyer registration reducers
      .addCase(registerBuyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBuyer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerBuyer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
