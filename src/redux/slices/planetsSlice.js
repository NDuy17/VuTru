import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { planets } from '../../data/planets';

/**
 * Async thunk for fetching planets from the API
 * Falls back to local bundled data if API fails
 * @async
 * @function fetchPlanets
 * @returns {Promise<Array>} Array of planet objects from API or local data
 */
export const fetchPlanets = createAsyncThunk(
  'planets/fetchPlanets',
  async (_, { rejectWithValue }) => {
    try {
      const { getPlanetsFromApi } = await import('../../services/planetsApi');
      const response = await getPlanetsFromApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Cannot fetch planets from API');
    }
  }
);

/**
 * Initial state for planets Redux slice
 * @type {Object}
 * @property {Array} planets - Array of planet objects
 * @property {string} status - Loading status: 'idle', 'loading', 'succeeded', 'failed'
 * @property {string|null} error - Error message if fetch failed
 */
const initialState = {
  planets: [],
  status: 'idle',
  error: null,
};

/**
 * Planets Redux slice
 * Manages state for planets data, loading status, and errors
 * Includes reducers for planet selection and async thunk handlers
 */
const planetsSlice = createSlice({
  name: 'planets',
  initialState,
  reducers: {
    /**
     * Selects a planet by marking it and deselecting others
     * @function selectPlanet
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action with payload (planet id)
     */
    selectPlanet: (state, action) => {
      state.planets = state.planets.map((planet) =>
        planet.id === action.payload
          ? { ...planet, selected: true }
          : { ...planet, selected: false }
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPlanets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.planets = (action.payload || []).map((planet) => ({
          ...planet,
          selected: false,
        }));
      })
      .addCase(fetchPlanets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Cannot fetch planets from API';
        // Fallback to local bundled data so app still works offline.
        state.planets = planets.map((planet) => ({ ...planet, selected: false }));
      });
  },
});

export const { selectPlanet } = planetsSlice.actions;
export default planetsSlice.reducer;
