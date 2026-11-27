import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  const { data } = await api.get('/events');
  return data;
});

export const fetchEvent = createAsyncThunk('events/fetchOne', async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data;
});

export const createEvent = createAsyncThunk('events/create', async (eventData) => {
  const { data } = await api.post('/events', eventData);
  return data;
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, eventData }) => {
  const { data } = await api.put(`/events/${id}`, eventData);
  return data;
});

export const deleteEvent = createAsyncThunk('events/delete', async (id) => {
  await api.delete(`/events/${id}`);
  return id;
});

export const joinEvent = createAsyncThunk('events/join', async (id) => {
  const { data } = await api.post(`/events/${id}/join`);
  return data;
});

export const leaveEvent = createAsyncThunk('events/leave', async (id) => {
  const { data } = await api.delete(`/events/${id}/join`);
  return data;
});

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    list: [], // all events (Events page, Admin page)
    current: null, // the event open in EventDetail, with populated participants
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.list.push(action.payload); // Immer lets us "mutate": it builds a new state for us
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.list = state.list.map((e) => (e._id === action.payload._id ? action.payload : e));
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e._id !== action.payload);
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export default eventSlice.reducer;
