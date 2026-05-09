import mongoose from 'mongoose';
import Planet from './models/Planet.js';
import { seedPlanets } from './data/seedPlanets.js';

export const connectDb = async (mongoUri) => {
  await mongoose.connect(mongoUri);
};

export const seedDbIfEmpty = async () => {
  const total = await Planet.countDocuments();
  if (total > 0) return;

  await Planet.insertMany(seedPlanets);
};
