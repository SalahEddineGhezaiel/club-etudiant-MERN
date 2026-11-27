import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Restore the session saved by store.js, so a page refresh keeps the user logged in
const saved = JSON.parse(localStorage.getItem('auth') || 'null');

// A thunk = an async action. Redux dispatches auth/login/pending, then /fulfilled or /rejected
export const login = createAsyncThunk('auth/login', async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data; // { token, user } becomes action.payload
});

export const register = createAsyncThunk('auth/register', async (form) => {
  const { data } = await api.post('/auth/register', form);
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved?.user || null,
    token: saved?.token || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const fulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.error.message; // the backend message, thanks to the response interceptor
    };
    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, fulfilled)
      .addCase(login.rejected, rejected)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, fulfilled)
      .addCase(register.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
