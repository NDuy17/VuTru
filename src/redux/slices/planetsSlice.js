import { createSlice } from '@reduxjs/toolkit';
import { planets } from '../../data/planets';

const initialState = {
  planets: planets.map((planet) => ({ ...planet, selected: false })),
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
    deselectPlanet: (state) => {
      state.planets = state.planets.map((planet) => ({
        ...planet,
        selected: false,
      }));
    },
  },
});

export const { selectPlanet, deselectPlanet } = planetsSlice.actions;
export default planetsSlice.reducer;
