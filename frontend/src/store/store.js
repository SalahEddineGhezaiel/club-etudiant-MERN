import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // state.auth
    events: eventReducer, // state.events
  },
});

// Save the session in localStorage whenever it changes.
// Done here and not in the reducers, because reducers must stay pure (no side effects).
store.subscribe(() => {
  const { user, token } = store.getState().auth;
  if (token) localStorage.setItem('auth', JSON.stringify({ user, token }));
  else localStorage.removeItem('auth');
});
