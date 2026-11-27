import axios from 'axios';

// One axios instance for the whole app: every call goes to our API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Called once in main.jsx. The store is passed in (not imported) to avoid a circular import:
// store -> slices -> api -> store. Same reason we dispatch { type: 'auth/logout' }
// instead of importing the logout action creator from authSlice.
export const setupInterceptors = (store) => {
  // Before every request: add the JWT if we have one
  api.interceptors.request.use((config) => {
    const { token } = store.getState().auth;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // After every response
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Token expired or invalid: log out (only if we were logged in, so a wrong login password doesn't trigger it)
      if (error.response?.status === 401 && store.getState().auth.token) {
        store.dispatch({ type: 'auth/logout' });
      }
      // Replace axios' generic error with the message our backend sent
      return Promise.reject(new Error(error.response?.data?.message || error.message));
    }
  );
};

export default api;
