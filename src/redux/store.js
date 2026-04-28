import { configureStore } from '@reduxjs/toolkit';
import planetsReducer from './slices/planetsSlice';

const store = configureStore({
  reducer: {
    planets: planetsReducer,
  },
});

export default store;
