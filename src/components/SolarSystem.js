import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions, PanResponder, Animated, Image, Easing } from 'react-native';
import PropTypes from 'prop-types';
import { ANIMATION, PLANET_SIZING, PATTERNS, RESOURCES } from '../constants';

const EARTH_CONTINENTS_TEXTURE = RESOURCES.EARTH_CONTINENTS_MAP;
const EARTH_COUNTRIES_TEXTURE = RESOURCES.EARTH_COUNTRIES_MAP;

/**
 * Parse diameter string and extract numeric value
 * @function
 * @param {string|number} diameter - Diameter value to parse
 * @returns {number} Numeric diameter in km
 */
const parseDiameter = (diameter) => {
  const value = String(diameter).replace(PATTERNS.DIGITS_ONLY, '');
  return Number(value) || 0;
};

/**
 * Calculate visual size for planet display
 * Scales diameter to fit within reasonable mobile display bounds
 * @function
 * @param {string|number} diameter - Planet diameter in km
 * @returns {number} Visual size for rendering
 */
const getVisualSize = (diameter) => {
  const diameterKm = parseDiameter(diameter);
  return Math.max(PLANET_SIZING.MIN_VISUAL_SIZE, Math.min(PLANET_SIZING.MAX_VISUAL_SIZE, Math.sqrt(diameterKm) * PLANET_SIZING.SIZE_SCALE_FACTOR));
};

/**
 * Calculate visual size for moon relative to planet
 * @function
 * @param {string|number} moonDiameter - Moon diameter
 * @param {string|number} planetDiameter - Parent planet diameter
 * @param {number} planetSize - Visual size of parent planet
 * @returns {number} Visual size for moon rendering
 */
const getMoonVisualSize = (moonDiameter, planetDiameter, planetSize) => {
  const moonKm = parseDiameter(moonDiameter);
  const planetKm = parseDiameter(planetDiameter) || 1;
  const ratio = Math.sqrt(moonKm / planetKm);
  const visual = planetSize * ratio * PLANET_SIZING.MOON_RATIO_FACTOR;
  return Math.max(PLANET_SIZING.MIN_MOON_SIZE, Math.min(visual, planetSize * PLANET_SIZING.MAX_MOON_RATIO));
};

const textureMap = {
  'sun': SUN_TEXTURE,
  'Mặt Trời': SUN_TEXTURE,
  'mercury': PLANET_TEXTURES.mercury,
  'Thủy Tinh': PLANET_TEXTURES.mercury,
  'venus': PLANET_TEXTURES.venus,
  'Kim Tinh': PLANET_TEXTURES.venus,
  'earth': PLANET_TEXTURES.earth,
  'Trái Đất': PLANET_TEXTURES.earth,
  'mars': PLANET_TEXTURES.mars,
  'Hỏa Tinh': PLANET_TEXTURES.mars,
  'jupiter': PLANET_TEXTURES.jupiter,
  'Mộc Tinh': PLANET_TEXTURES.jupiter,
  'saturn': PLANET_TEXTURES.saturn,
  'Thổ Tinh': PLANET_TEXTURES.saturn,
  'uranus': PLANET_TEXTURES.uranus,
  'Thiên Vương Tinh': PLANET_TEXTURES.uranus,
  'neptune': PLANET_TEXTURES.neptune,
  'Hải Vương Tinh': PLANET_TEXTURES.neptune,
  'moon': MOON_TEXTURES.moon,
  'Mặt Trăng': MOON_TEXTURES.moon,
};

// 🌎 Optimized TextureSphere (Memoized for peak performance)
/**
 * TextureSphere Component
 * Renders a rotating textured sphere for planet/celestial body display
 * Memoized to prevent unnecessary re-renders
 * @component
 * @param {Object} props - Component props
 * @param {number} props.size - Size of sphere in pixels
 * @param {string} props.texture - URI of texture image to apply
 * @param {number} props.angle - Current rotation angle in radians
 * @param {boolean} [props.isSun] - Whether to render sun glow effect
 * @param {string} [props.color] - Fallback color if no texture provided
 * @returns {React.ReactNode} Textured sphere UI
 */
const TextureSphere = memo(({ size, texture, angle, isSun, color }) => {
  const scrollOffset = (angle % (Math.PI * 2)) * (size / Math.PI);
  
  return (
    <View style={[styles.sphereContainer, { width: size, height: size, borderRadius: size / 2 }]}>
      {texture ? (
        <View style={[styles.textureRow, { width: size * 4, transform: [{ translateX: -scrollOffset }] }]}>
          <Image source={{ uri: texture }} style={{ width: size * 2, height: size }} resizeMode="stretch" />
          <Image source={{ uri: texture }} style={{ width: size * 2, height: size }} resizeMode="stretch" />
        </View>
      ) : (
        <View style={{ width: size, height: size, backgroundColor: color || '#444' }} />
      )}
      {isSun && <View style={[styles.sunGlow, { width: size * 1.8, height: size * 1.8, borderRadius: size * 0.9, left: -size * 0.4, top: -size * 0.4 }]} />}
    </View>
  );
});

TextureSphere.displayName = 'TextureSphere';
TextureSphere.propTypes = {
  size: PropTypes.number.isRequired,
  texture: PropTypes.string,
  angle: PropTypes.number.isRequired,
  isSun: PropTypes.bool,
  color: PropTypes.string,
};
TextureSphere.defaultProps = {
  texture: null,
  isSun: false,
  color: '#444',
};

/**
 * SolarSystem Component
 * Main interactive 3D solar system visualization component
 * Handles pan/pinch gestures for rotation and zoom
 * Displays planets with orbital mechanics and selection
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.planets - Array of planet objects with id, name, selected, etc.
 * @param {Function} props.onPlanetPress - Callback when planet is selected
 * @param {Function} props.onMoonPress - Callback when moon is selected
 * @param {boolean} [props.explorationMode] - Whether in exploration mode
 * @param {string|null} [props.earthMapMode] - Current Earth map mode (continents/countries)
 * @returns {React.ReactNode} Interactive solar system UI
 */
const SolarSystem = ({ planets, onPlanetPress, onMoonPress, explorationMode = false, earthMapMode = null }) => {
  const { width, height } = useWindowDimensions();
  const selectedPlanet = useMemo(() => planets.find(p => p.selected), [planets]);
  
  const rotRef = useRef({ x: 0.4, y: 1.2, zoom: 0.6 });
  const lastDistRef = useRef(null);
  const timeRef = useRef(0);
  const [_, setUpdateTrigger] = useState(0);
  const animationFrameId = useRef(null);
  const selectedPlanetRef = useRef(selectedPlanet);
  const focusSpinRef = useRef(0);
  const lastPanRef = useRef({ dx: 0, dy: 0 });

  useEffect(() => { selectedPlanetRef.current = selectedPlanet; }, [selectedPlanet]);
  useEffect(() => {
    if (!selectedPlanet || !explorationMode) {
      focusSpinRef.current = 0;
    }
  }, [selectedPlanet, explorationMode]);

  const isInteractingRef = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    let lastTime = 0;
    const animate = (now) => {
      const delta = now - lastTime;
      // 🚀 10 FPS for system view = Pure Butter Navigation
      const targetFrameTime = 1000 / (selectedPlanetRef.current ? 25 : 10);
      
      if (delta >= targetFrameTime) {
        timeRef.current += delta;
        setUpdateTrigger(prev => prev + 1);
        lastTime = now;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);


  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isInteractingRef.current = true;
        setIsInteracting(true);
        lastPanRef.current = { dx: 0, dy: 0 };
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaDx = gestureState.dx - lastPanRef.current.dx;
        const deltaDy = gestureState.dy - lastPanRef.current.dy;
        lastPanRef.current = { dx: gestureState.dx, dy: gestureState.dy };

        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          const t1 = touches[0];
          const t2 = touches[1];
          const dist = Math.sqrt(Math.pow(t2.pageX - t1.pageX, 2) + Math.pow(t2.pageY - t1.pageY, 2));
          if (lastDistRef.current) {
            const delta = dist - lastDistRef.current;
            rotRef.current.zoom = Math.max(0.1, Math.min(10, rotRef.current.zoom + delta * 0.003 * rotRef.current.zoom));
          }
          lastDistRef.current = dist;
        } else {
          if (selectedPlanet && explorationMode) {
            // In explore mode, drag rotates only focused planet texture.
            focusSpinRef.current += deltaDx * 0.02;
          } else {
            rotRef.current.y += deltaDx * (selectedPlanet ? 0.004 : 0.006);
            rotRef.current.x += deltaDy * (selectedPlanet ? 0.004 : 0.006);
          }
        }
      },
      onPanResponderRelease: () => { 
        lastDistRef.current = null;
        isInteractingRef.current = false;
        setIsInteracting(false);
      },
      onPanResponderTerminate: () => {
        lastDistRef.current = null;
        isInteractingRef.current = false;
        setIsInteracting(false);
      }
    })
  ).current;

  const project = (x, y, z, rot, zoomVal) => {
    const cx = Math.cos(rot.x), sx = Math.sin(rot.x), cy = Math.cos(rot.y), sy = Math.sin(rot.y);
    const ny = y * cx - z * sx, nz1 = y * sx + z * cx;
    const nx = x * cy - nz1 * sy, nz = x * sy + nz1 * cy;
    const d = 5000 + nz;
    const scale = (5000 / d) * zoomVal;
    return { x: width / 2 + nx * scale, y: height / 2 - 20 - ny * scale, scale, depth: nz };
  };

  const planetData = useMemo(() => {
    const t = timeRef.current;
    const { x, y, zoom } = rotRef.current;
    
    return planets.map((p, index) => {
      let x3d = 0, y3d = 0, z3d = 0;
      const a = p.isSun ? 0 : (t * Math.PI * 2) / ((p.orbitalPeriod || 1) * 100000) + (p.initialAngle || 0);
      let orbitRadius = 0;

      if (!p.isSun) {
        // 📏 Stylized Spacing: Use index to make gaps uniform and visible on mobile
        orbitRadius = 240 + index * 180; 
        x3d = Math.cos(a) * orbitRadius;
        z3d = Math.sin(a) * orbitRadius;
      }

      const p2d = project(x3d, y3d, z3d, { x, y }, zoom);
      
      if (selectedPlanet && p.id === selectedPlanet.id) {
        // 🔍 Zoom support in focus mode: size scales directly with global zoom
        const focusSize = 250 * (zoom / 1.0); 
        const lockedAngle = (p.initialAngle || 0) + focusSpinRef.current;
        return { 
          ...p, 
          x: width * 0.34, 
          y: height / 2 - 20, 
          size: focusSize, 
          zIndex: 2000, 
          visible: true, 
          angle: explorationMode ? lockedAngle : a, 
          texture: p.id === 3 && earthMapMode === 'continents'
            ? EARTH_CONTINENTS_TEXTURE
            : p.id === 3 && earthMapMode === 'countries'
              ? EARTH_COUNTRIES_TEXTURE
              : textureMap[p.name], 
          orbitRadius 
        };
      }
      if (selectedPlanet && p.id !== selectedPlanet.id) return { ...p, visible: false };

      let size = (p.isSun ? 110 : getVisualSize(p.diameter) * 0.8) * p2d.scale;

      return { 
        ...p, 
        x: p2d.x, y: p2d.y, size, 
        zIndex: Math.floor(1000 - p2d.depth), 
        visible: true, angle: a, texture: textureMap[p.name], orbitRadius
      };
    });
  }, [selectedPlanet, width, height, explorationMode, earthMapMode, _]);

  // 🛰️ Synchronized Orbits (Super Optimized)
  const orbitPaths = useMemo(() => {
    const { x, y, zoom } = rotRef.current;
    
    if (!selectedPlanet) {
      return planetData.filter(p => !p.isSun).map(p => {
        const points = [];
        const step = 64; // 🚀 MAXIMUM SMOOTHNESS: 64 segments for perfect circles
        for (let i = 0; i <= step; i++) {
          const angle = (i / step) * Math.PI * 2;
          const pt = project(Math.cos(angle) * p.orbitRadius, 0, Math.sin(angle) * p.orbitRadius, { x, y }, zoom);
          points.push(pt);
        }
        return { id: p.id, points, type: 'planet' };
      });
    }
    
    const p = planetData.find(pl => pl.id === selectedPlanet.id);
    if (!p) return [];
    
    const moonTilt = 0.12; 
    const moonSources = p.moonsInfo?.length ? p.moonsInfo : p.moon ? [p.moon] : [];
    
    return moonSources.map((moon, idx) => {
      const points = [];
      const step = 12; 
      // 🛰️ Fully proportional orbital path for Focus View
      const focusMoonSpacing = explorationMode ? 1.7 : 1;
      const relOrbitR = ((p.isSun ? 0 : 40) + (250 * 0.55) + (idx * 40)) * (rotRef.current.zoom / 1.0) * focusMoonSpacing;
      
      for (let i = 0; i <= step; i++) {
        const angle = (i / step) * Math.PI * 2;
        const ox = p.x + Math.cos(angle) * relOrbitR;
        const oy = p.y + Math.sin(angle) * relOrbitR * moonTilt;
        points.push({ x: ox, y: oy });
      }
      return { id: `moon-orbit-${moon.id}`, points, type: 'moon' };
    });
  }, [planetData, selectedPlanet, explorationMode, _]);

  const moonData = useMemo(() => {
    const { x, y, zoom } = rotRef.current;
    const t = timeRef.current;
    
    const activePlanets = selectedPlanet 
      ? planetData.filter(p => p.id === selectedPlanet.id)
      : planetData.filter(p => p.visible && !p.isSun);

    return activePlanets.flatMap(p => {
      let moonSources = p.moonsInfo?.length ? p.moonsInfo : p.moon ? [p.moon] : [];
      
      // 🚀 PERFORMANCE: In system view, only show the 1st moon to save CPU
      if (!selectedPlanet && moonSources.length > 1) {
        moonSources = [moonSources[0]];
      }

      const moonTilt = 0.12; 

      return moonSources.map((moon, i) => {
        const ma = (t * Math.PI * 2) / ((moon.orbitalPeriod || 1) * 100000) + (moon.initialAngle || 0);
        
        // 🚀 Balanced spacing: Close to planet but clearing rings
        const baseVisualSize = (p.isSun ? 110 : getVisualSize(p.diameter) * 0.8);
        let baseRelR = baseVisualSize * 1.5;
        if (p.name === 'Thổ Tinh') baseRelR = baseVisualSize * 2.6;
        if (p.name === 'Mộc Tinh') baseRelR = baseVisualSize * 1.8;

        const focusMoonSpacing = explorationMode ? 1.7 : 1;
        const relOrbitR = selectedPlanet 
          ? ((p.isSun ? 0 : 40) + (250 * 0.55) + (i * 40)) * (rotRef.current.zoom / 1.0) * focusMoonSpacing
          : baseRelR + (i * 20);
        
        let mx, my, zIndex;

        if (selectedPlanet) {
          mx = p.x + Math.cos(ma) * relOrbitR;
          my = p.y + Math.sin(ma) * relOrbitR * moonTilt;
          zIndex = p.zIndex + Math.floor(Math.sin(ma) * 100);
        } else {
          const a_planet = (t * Math.PI * 2) / ((p.orbitalPeriod || 1) * 100000) + (p.initialAngle || 0);
          const px3d = Math.cos(a_planet) * p.orbitRadius;
          const pz3d = Math.sin(a_planet) * p.orbitRadius;
          const mx3d = px3d + Math.cos(ma) * relOrbitR;
          const mz3d = pz3d + Math.sin(ma) * relOrbitR;
          const m2d = project(mx3d, 0, mz3d, { x, y }, zoom);
          mx = m2d.x; my = m2d.y;
          zIndex = Math.floor(1000 - m2d.depth);
        }

        const size = getMoonVisualSize(moon.diameter, p.diameter, p.size) * (selectedPlanet ? 0.85 : 0.75);

        return { ...moon, x: mx, y: my, size, zIndex, texture: textureMap[moon.name] || MOON_TEXTURES.moon, angle: ma, planet: p, visible: true };
      });
    });
  }, [planetData, selectedPlanet, explorationMode, _]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* 🌌 Background Stars removed for maximum mobile speed */}

      {/* 🛰️ Projected Orbits (Hidden during interaction for zero lag) */}
      {!isInteracting && !selectedPlanet && orbitPaths.map(orbit => (
        <View key={orbit.id} style={StyleSheet.absoluteFill} pointerEvents="none">
          {orbit.points.map((pt, i) => {
            if (i === 0) return null;
            const prev = orbit.points[i - 1];
            const dx = pt.x - prev.x;
            const dy = pt.y - prev.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            return (
              <View 
                key={i} 
                style={[
                  styles.orbitSegment, 
                  { 
                    left: prev.x, 
                    top: prev.y, 
                    width: dist + 0.5, 
                    transform: [{ rotate: `${angle}rad` }],
                    opacity: orbit.type === 'moon' ? 0.06 : 0.12
                  }
                ]} 
              />
            );
          })}
        </View>
      ))}

      {/* Planets & Moons Sorted by Depth */}
      {[...planetData, ...moonData]
        .filter(obj => obj.visible && (!obj.planet || !isInteracting))
        .sort((a,b) => a.zIndex - b.zIndex)
        .map((obj) => (
        <Pressable
          key={obj.planet ? `moon-${obj.id}` : `planet-${obj.id}`}
          onPress={() => obj.planet ? onMoonPress?.(obj, obj.planet) : onPlanetPress(obj.id)}
          style={[
            styles.objContainer,
            {
              left: obj.x - obj.size / 2,
              top: obj.y - obj.size / 2,
              width: obj.size,
              height: obj.size,
              zIndex: obj.zIndex,
            }
          ]}
        >
          <TextureSphere 
            size={obj.size} 
            texture={obj.texture} 
            angle={obj.angle * (obj.isSun ? 0.3 : 1.5)} 
            isSun={obj.isSun} 
            color={obj.color} 
          />
          
          {!selectedPlanet && !obj.planet && obj.size > 22 && (
            <Text style={styles.label}>{obj.name}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00040a' },
  starLayer: { ...StyleSheet.absoluteFillObject },
  star: { position: 'absolute', width: 1.5, height: 1.5, backgroundColor: '#fff', borderRadius: 1 },
  orbitSegment: { position: 'absolute', height: 1, backgroundColor: 'rgba(120, 180, 255, 0.4)', transformOrigin: '0% 50%' },
  objContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  sphereContainer: { overflow: 'hidden' },
  textureRow: { flexDirection: 'row', height: '100%' },
  sunGlow: { position: 'absolute', backgroundColor: 'rgba(255, 100, 0, 0.25)', shadowColor: '#f80', shadowRadius: 20, shadowOpacity: 0.8, elevation: 5 },
  label: { color: 'rgba(255,255,255,0.4)', fontSize: 9, position: 'absolute', bottom: -14, fontWeight: '600' },
});

SolarSystem.propTypes = {
  planets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      selected: PropTypes.bool,
      isSun: PropTypes.bool,
      orbitalPeriod: PropTypes.number,
      initialAngle: PropTypes.number,
      moons: PropTypes.array,
    })
  ).isRequired,
  onPlanetPress: PropTypes.func.isRequired,
  onMoonPress: PropTypes.func.isRequired,
  explorationMode: PropTypes.bool,
  earthMapMode: PropTypes.string,
};

SolarSystem.defaultProps = {
  explorationMode: false,
  earthMapMode: null,
};

export default SolarSystem;
