import { configureStore } from '@reduxjs/toolkit';
import planetsReducer from './slices/planetsSlice';

const store = configureStore({
  reducer: {
    planets: planetsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
