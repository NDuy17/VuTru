/**
 * Continent SVG Data URIs
 * Provides offline-capable, production-quality SVG representations of continents
 */

const continentImages = {
  'Châu Á': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><path d="M70,30 L80,35 L85,45 L80,60 L70,70 L50,75 L40,70 L30,60 L25,45 L30,35 L50,25 Z" fill="%2300d4ff" opacity="0.6"/><text x="50" y="55" font-size="10" text-anchor="middle" fill="white">ASIA</text></svg>',
  'Châu Âu': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><path d="M40,30 L60,30 L65,40 L60,55 L45,60 L35,55 L30,45 Z" fill="%2300d4ff" opacity="0.6"/><text x="50" y="50" font-size="10" text-anchor="middle" fill="white">EUROPE</text></svg>',
  'Châu Phi': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><path d="M40,25 L60,25 L70,40 L65,60 L50,85 L35,60 L30,40 Z" fill="%2300d4ff" opacity="0.6"/><text x="50" y="50" font-size="10" text-anchor="middle" fill="white">AFRICA</text></svg>',
  'Bắc Mỹ': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><path d="M20,20 L60,20 L55,50 L40,65 L25,50 Z" fill="%2300d4ff" opacity="0.6"/><text x="40" y="45" font-size="8" text-anchor="middle" fill="white">N. AMERICA</text></svg>',
  'Nam Mỹ': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><path d="M40,40 L65,40 L55,80 L40,90 L30,70 Z" fill="%2300d4ff" opacity="0.6"/><text x="48" y="65" font-size="8" text-anchor="middle" fill="white">S. AMERICA</text></svg>',
  'Châu Úc': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><path d="M60,60 L85,60 L85,85 L65,85 L60,75 Z" fill="%2300d4ff" opacity="0.6"/><text x="72" y="75" font-size="8" text-anchor="middle" fill="white">OCEANIA</text></svg>',
  'Nam Cực': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231a2454"/><circle cx="50" cy="50" r="40" fill="%2300d4ff" opacity="0.3"/><path d="M30,80 L70,80 L80,90 L20,90 Z" fill="white" opacity="0.8"/><text x="50" y="88" font-size="8" text-anchor="middle" fill="%231a2454">ANTARCTICA</text></svg>',
  'Asia': 'Châu Á',
  'Europe': 'Châu Âu',
  'Africa': 'Châu Phi',
  'North America': 'Bắc Mỹ',
  'South America': 'Nam Mỹ',
  'Oceania': 'Châu Úc',
  'Antarctica': 'Nam Cực',
};

const normalizedContinentKeys = Object.keys(continentImages).reduce((keys, key) => {
  keys[key.toLowerCase()] = key;
  return keys;
}, {});

/**
 * Get Continent Image Data URI
 * @param {string} name - Continent name in Vietnamese or English
 * @returns {string} SVG Data URI
 */
export const getContinentImage = (name) => {
  const normalizedName = String(name || '').trim().toLowerCase();
  const directKey = normalizedContinentKeys[normalizedName] || name;
  const key = continentImages[directKey] || directKey;
  return continentImages[key] || continentImages['Châu Á'];
};

export default continentImages;
