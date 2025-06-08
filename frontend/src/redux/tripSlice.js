import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance.js'; 

// Async thunks
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/trips');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trips'
      );
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'trips/fetchTripById',
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trip'
      );
    }
  }
);

export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/trips/', tripData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create trip'
      );
    }
  }
);

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ tripId, tripData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/trips/${tripId}`, tripData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update trip'
      );
    }
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (tripId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/trips/${tripId}`);
      return tripId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete trip'
      );
    }
  }
);

// Slice
const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    selectedTrip: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch trip by id
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create trip
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload);
        state.selectedTrip = action.payload;
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update trip
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.map(trip =>
          trip._id === action.payload._id ? action.payload : trip
        );
        state.selectedTrip = action.payload;
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete trip
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter(trip => trip._id !== action.payload);
        if (state.selectedTrip && state.selectedTrip._id === action.payload) {
          state.selectedTrip = null;
        }
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = tripSlice.actions;

export default tripSlice.reducer;
