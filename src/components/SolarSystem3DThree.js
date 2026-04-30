import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Group } from '@react-three/drei';
import * as THREE from 'three';

// Utility functions
const createPlanet = (radius, color, textureUrl = null) => {
  const geometry = new THREE.SphereGeometry(radius, 64, 64);
  const material = textureUrl
    ? new THREE.MeshPhongMaterial({ map: useLoader(THREE.TextureLoader, textureUrl) })
    : new THREE.MeshPhongMaterial({ color });
  return { geometry, material };
};

const createMoon = (radius, color, textureUrl = null) => {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = textureUrl
    ? new THREE.MeshPhongMaterial({ map: useLoader(THREE.TextureLoader, textureUrl) })
    : new THREE.MeshPhongMaterial({ color });
  return { geometry, material };
};

const createOrbitSystem = (planetRadius, planetColor, planetTexture, moons) => {
  const planet = createPlanet(planetRadius, planetColor, planetTexture);
  const moonSystems = moons.map((moon) => ({
    ...moon,
    moon: createMoon(moon.radius, moon.color, moon.texture),
    orbitRadius: moon.orbitRadius,
    orbitSpeed: moon.orbitSpeed,
    rotationSpeed: moon.rotationSpeed,
  }));

  return { planet, moonSystems };
};

// Planet data with moons
const planetData = {
  earth: {
    radius: 1,
    color: 0x4f94cd,
    texture: '/textures/earth.jpg', // Placeholder
    moons: [
      {
        name: 'Moon',
        radius: 0.27,
        color: 0xcccccc,
        texture: '/textures/moon.jpg', // Placeholder
        orbitRadius: 3,
        orbitSpeed: 0.01,
        rotationSpeed: 0.005,
      },
    ],
  },
  mars: {
    radius: 0.8,
    color: 0xcd5c5c,
    texture: '/textures/mars.jpg', // Placeholder
    moons: [
      {
        name: 'Phobos',
        radius: 0.15,
        color: 0x8b4513,
        orbitRadius: 2,
        orbitSpeed: 0.02,
        rotationSpeed: 0.01,
      },
      {
        name: 'Deimos',
        radius: 0.12,
        color: 0x696969,
        orbitRadius: 2.5,
        orbitSpeed: 0.015,
        rotationSpeed: 0.008,
      },
    ],
  },
  jupiter: {
    radius: 2.5,
    color: 0xd2b48c,
    texture: '/textures/jupiter.jpg', // Placeholder
    moons: [
      {
        name: 'Io',
        radius: 0.6,
        color: 0xffff00,
        orbitRadius: 4,
        orbitSpeed: 0.03,
        rotationSpeed: 0.02,
      },
      {
        name: 'Europa',
        radius: 0.55,
        color: 0x87ceeb,
        orbitRadius: 5,
        orbitSpeed: 0.025,
        rotationSpeed: 0.015,
      },
      {
        name: 'Ganymede',
        radius: 0.7,
        color: 0x8b4513,
        orbitRadius: 6,
        orbitSpeed: 0.02,
        rotationSpeed: 0.01,
      },
      {
        name: 'Callisto',
        radius: 0.65,
        color: 0x696969,
        orbitRadius: 7,
        orbitSpeed: 0.018,
        rotationSpeed: 0.008,
      },
    ],
  },
  saturn: {
    radius: 2.2,
    color: 0xfad5a5,
    texture: '/textures/saturn.jpg', // Placeholder
    moons: [
      {
        name: 'Titan',
        radius: 0.5,
        color: 0xffd700,
        orbitRadius: 5,
        orbitSpeed: 0.015,
        rotationSpeed: 0.01,
      },
    ],
  },
};

// Planet Component
const Planet = ({ data, position }) => {
  const groupRef = useRef();
  const planetRef = useRef();
  const moonRefs = useRef([]);

  const { planet, moonSystems } = useMemo(() => createOrbitSystem(data.radius, data.color, data.texture, data.moons), [data]);

  useFrame((state, delta) => {
    // Planet rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }

    // Moon orbits and rotations
    moonSystems.forEach((moonSystem, index) => {
      const moonGroup = moonRefs.current[index];
      if (moonGroup) {
        moonGroup.rotation.y += moonSystem.orbitSpeed;
        const moonMesh = moonGroup.children[0];
        if (moonMesh) {
          moonMesh.rotation.y += moonSystem.rotationSpeed;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={planetRef} geometry={planet.geometry} material={planet.material} />
      {moonSystems.map((moonSystem, index) => (
        <group key={moonSystem.name} ref={(el) => (moonRefs.current[index] = el)}>
          <mesh
            position={[moonSystem.orbitRadius, 0, 0]}
            geometry={moonSystem.moon.geometry}
            material={moonSystem.moon.material}
          />
        </group>
      ))}
    </group>
  );
};

// Main Solar System Component
const SolarSystem3DThree = () => {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Planets */}
      <Planet data={planetData.earth} position={[-10, 0, 0]} />
      <Planet data={planetData.mars} position={[-5, 0, 0]} />
      <Planet data={planetData.jupiter} position={[0, 0, 0]} />
      <Planet data={planetData.saturn} position={[10, 0, 0]} />

      {/* Sun */}
      <mesh position={[0, 0, -50]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color={0xffff00} />
      </mesh>
    </Canvas>
  );
};

export default SolarSystem3DThree;