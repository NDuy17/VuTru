import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { planets } from '../../data/planets';

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

const initialState = {
  planets: [],
  status: 'idle',
  error: null,
};

const planetsSlice = createSlice({
  name: 'planets',
  initialState,
  reducers: {
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
