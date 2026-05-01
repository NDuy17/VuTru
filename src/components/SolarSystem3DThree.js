import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { TextureLoader } from 'three';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlanet } from '../redux/slices/planetsSlice';
import { SUN_TEXTURE, PLANET_TEXTURES, MOON_TEXTURES, MOON_TEXTURES_FALLBACK } from '../data/textures';

const textureUrls = {
  // Sun
  'sun': SUN_TEXTURE,
  'Mặt Trời': SUN_TEXTURE,

  // Planets
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

  // Moons
  'moon': MOON_TEXTURES.moon,
  'Mặt Trăng': MOON_TEXTURES.moon,
  'phobos': MOON_TEXTURES_FALLBACK.phobos,
  'Phobos': MOON_TEXTURES_FALLBACK.phobos,
  'deimos': MOON_TEXTURES_FALLBACK.deimos,
  'Deimos': MOON_TEXTURES_FALLBACK.deimos,
  'io': MOON_TEXTURES.io,
  'Io': MOON_TEXTURES.io,
  'europa': MOON_TEXTURES.europa,
  'Europa': MOON_TEXTURES.europa,
  'ganymede': MOON_TEXTURES.ganymede,
  'Ganymede': MOON_TEXTURES.ganymede,
  'callisto': MOON_TEXTURES.callisto,
  'Callisto': MOON_TEXTURES.callisto,
  'titan': MOON_TEXTURES.titan,
  'Titan': MOON_TEXTURES.titan,
  'rhea': MOON_TEXTURES_FALLBACK.rhea,
  'Rhea': MOON_TEXTURES_FALLBACK.rhea,
  'enceladus': MOON_TEXTURES_FALLBACK.enceladus,
  'Enceladus': MOON_TEXTURES_FALLBACK.enceladus,
  'titania': MOON_TEXTURES_FALLBACK.titania,
  'Titania': MOON_TEXTURES_FALLBACK.titania,
  'oberon': MOON_TEXTURES_FALLBACK.oberon,
  'Oberon': MOON_TEXTURES_FALLBACK.oberon,
  'triton': MOON_TEXTURES_FALLBACK.triton,
  'Triton': MOON_TEXTURES_FALLBACK.triton,
};

const Planet = ({ planet, position, size, textureUrl, onClick }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      textureUrl,
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      () => {
        console.log(`Texture failed for ${planet.name}, using color`);
        setTexture(null);
      }
    );
  }, [textureUrl, planet.name]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[size, 32, 32]} />
      {texture ? (
        <meshBasicMaterial map={texture} />
      ) : (
        <meshBasicMaterial color={planet.color || '#ffffff'} />
      )}
    </mesh>
  );
};

const Moon = ({ moon, planetPosition, orbitRadius, size, textureUrl, time }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      textureUrl,
      (loadedTexture) => setTexture(loadedTexture),
      undefined,
      () => {
        console.log(`Texture failed for ${moon.name}, using color`);
        setTexture(null);
      }
    );
  }, [textureUrl, moon.name]);

  const angle = (time / ((moon.orbitalPeriod || 1) * 1000)) + (moon.initialAngle || 0);
  const x = planetPosition[0] + Math.cos(angle) * orbitRadius;
  const z = planetPosition[2] + Math.sin(angle) * orbitRadius;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, 0, z]}>
      <sphereGeometry args={[size, 16, 16]} />
      {texture ? (
        <meshBasicMaterial map={texture} />
      ) : (
        <meshBasicMaterial color={moon.color || '#E8E4DE'} />
      )}
    </mesh>
  );
};

const SolarSystem3D = () => {
  const planets = useSelector((state) => state.planets.planets);
  const dispatch = useDispatch();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta * 1000;
  });

  const planetComponents = useMemo(() => {
    return planets.map((planet) => {
      let position = [0, 0, 0];
      if (!planet.isSun) {
        const distanceAU = planet.distanceAU || 1;
        const orbitRadius = 50 + 100 * Math.pow(distanceAU, 0.8);
        const orbitalPeriod = (planet.orbitalPeriod || 1) * 20000;
        const angle = (timeRef.current / orbitalPeriod) + (planet.initialAngle || 0);
        position = [Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius];
      }

      const size = planet.isSun ? 5 : Math.max(0.5, Math.min(3, Math.sqrt(parseInt(planet.diameter.replace(/[^0-9]/g, '')) || 1000) / 2000));

      const textureUrl = textureUrls[planet.name] || textureUrls[planet.name.toLowerCase()] || SUN_TEXTURE;

      return (
        <Planet
          key={planet.id}
          planet={planet}
          position={position}
          size={size}
          textureUrl={textureUrl}
          onClick={() => dispatch(selectPlanet(planet.id))}
        />
      );
    });
  }, [planets, timeRef.current]);

  const moonComponents = useMemo(() => {
    return planets
      .filter((p) => p.moonsInfo?.length)
      .flatMap((planet) => {
        const planetPosition = planet.isSun ? [0, 0, 0] : (() => {
          const distanceAU = planet.distanceAU || 1;
          const orbitRadius = 50 + 100 * Math.pow(distanceAU, 0.8);
          const orbitalPeriod = (planet.orbitalPeriod || 1) * 20000;
          const angle = (timeRef.current / orbitalPeriod) + (planet.initialAngle || 0);
          return [Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius];
        })();

        return planet.moonsInfo.map((moon, index) => {
          const orbitRadius = 8 + index * 2;
          const size = Math.max(0.1, Math.min(0.5, Math.sqrt(parseInt(moon.diameter?.replace(/[^0-9]/g, '') || 100)) / 1000));

          const textureUrl = textureUrls[moon.name] || textureUrls[moon.name.toLowerCase()] || MOON_TEXTURES.moon;

          return (
            <Moon
              key={moon.id}
              moon={moon}
              planetPosition={planetPosition}
              orbitRadius={orbitRadius}
              size={size}
              textureUrl={textureUrl}
              time={timeRef.current}
            />
          );
        });
      });
  }, [planets, timeRef.current]);

  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} />
      {planetComponents}
      {moonComponents}
    </Canvas>
  );
};

export default SolarSystem3D;