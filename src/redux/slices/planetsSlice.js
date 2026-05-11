import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/**
 * Async thunk for fetching planets from the backend API
 * Fetches planet data including statistics, textures, and orbit configurations
 * @async
 * @function fetchPlanets
 * @returns {Promise<Array>} Array of planet objects from API
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
 * Includes reducers for planet selection, state resets, and error handling
 * @module planetsSlice
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
    /**
     * Resets planet selection by marking all planets as unselected
     * @function resetSelection
     * @param {Object} state - Current Redux state
     */
    resetSelection: (state) => {
      state.planets = state.planets.map((planet) => ({
        ...planet,
        selected: false,
      }));
    },
    /**
     * Manually sets an error message
     * @function setError
     * @param {Object} state - Current Redux state
     * @param {Object} action - Redux action with payload (error string)
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    /**
     * Clears current error and resets status to idle
     * @function clearError
     * @param {Object} state - Current Redux state
     */
    clearError: (state) => {
      state.error = null;
      state.status = 'idle';
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
        state.planets = []; // Ensure no stale data remains on failure
      });
  },
});

export const { selectPlanet, resetSelection, setError, clearError } = planetsSlice.actions;
export default planetsSlice.reducer;

