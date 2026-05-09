import Sun from '../../../src/data/planets/Sun.js';
import Mercury from '../../../src/data/planets/Mercury.js';
import Venus from '../../../src/data/planets/Venus.js';
import Earth from '../../../src/data/planets/Earth.js';
import Mars from '../../../src/data/planets/Mars.js';
import Jupiter from '../../../src/data/planets/Jupiter.js';
import Saturn from '../../../src/data/planets/Saturn.js';
import Uranus from '../../../src/data/planets/Uranus.js';
import Neptune from '../../../src/data/planets/Neptune.js';

const sourcePlanets = [
  Sun,
  Mercury,
  Venus,
  Earth,
  Mars,
  Jupiter,
  Saturn,
  Uranus,
  Neptune,
];

const enrichAngles = (item) => ({
  ...item,
  initialAngle:
    typeof item.initialAngle === 'number'
      ? item.initialAngle
      : Math.random() * Math.PI * 2,
});

export const seedPlanets = sourcePlanets.map((planet) => {
  const mapped = enrichAngles(planet);

  if (mapped.moon) {
    mapped.moon = enrichAngles(mapped.moon);
  }

  if (Array.isArray(mapped.moonsInfo)) {
    mapped.moonsInfo = mapped.moonsInfo.map((moon) => enrichAngles(moon));
  }

  return mapped;
});
