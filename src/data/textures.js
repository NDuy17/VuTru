// 🌌 LOCAL TEXTURE ASSETS
import { Asset } from 'expo-asset';

const resolveAsset = (asset) => {
  // Asset.fromModule works reliably across Expo Web and Native
  try {
    return Asset.fromModule(asset).uri;
  } catch (e) {
    console.warn('Failed to resolve asset:', asset);
    return asset;
  }
};

// ☀️ SUN
export const SUN_TEXTURE = resolveAsset(require('../../assets/textures/2k_sun.jpg'));

// 🪐 PLANETS
export const PLANET_TEXTURES = {
  mercury: resolveAsset(require('../../assets/textures/2k_mercury.jpg')),
  venus: resolveAsset(require('../../assets/textures/2k_venus_surface.jpg')),
  earth: resolveAsset(require('../../assets/textures/2k_earth_daymap.jpg')),
  mars: resolveAsset(require('../../assets/textures/2k_mars.jpg')),
  jupiter: resolveAsset(require('../../assets/textures/2k_jupiter.jpg')),
  saturn: resolveAsset(require('../../assets/textures/2k_saturn.jpg')),
  uranus: resolveAsset(require('../../assets/textures/2k_uranus.jpg')),
  neptune: resolveAsset(require('../../assets/textures/2k_neptune.jpg')),
};

// 🌙 MOONS
export const MOON_TEXTURES = {
  moon: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  io: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  europa: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  ganymede: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  callisto: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  titan: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
};

// ⚠️ MOONS FALLBACK
export const MOON_TEXTURES_FALLBACK = {
  phobos: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  deimos: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  rhea: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  enceladus: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  titania: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  oberon: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
  triton: resolveAsset(require('../../assets/textures/2k_moon.jpg')),
};
