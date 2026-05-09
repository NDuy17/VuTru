import mongoose from 'mongoose';

const moonSchema = new mongoose.Schema({}, { strict: false, _id: false });
const regionSchema = new mongoose.Schema({}, { strict: false, _id: false });

const planetSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    emoji: String,
    color: String,
    description: String,
    type: String,
    mass: String,
    diameter: String,
    climate: String,
    temperature: String,
    distance: String,
    distanceAU: Number,
    inclination: Number,
    orbitalPeriod: Number,
    gravity: String,
    moons: Number,
    orbitRadius: Number,
    initialAngle: Number,
    isSun: Boolean,
    regions: [regionSchema],
    moon: moonSchema,
    moonsInfo: [moonSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('Planet', planetSchema);
