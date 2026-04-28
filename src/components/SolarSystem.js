import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions, PanResponder, Animated } from 'react-native';

const SolarSystem = ({ planets, onPlanetPress }) => {
  const { width, height } = useWindowDimensions();
  const selectedPlanet = useMemo(() => planets.find(p => p.selected), [planets]);
  
  const rotationX = useRef(new Animated.Value(0.4)).current;
  const rotationY = useRef(new Animated.Value(1.2)).current;
  const zoom = useRef(new Animated.Value(0.9)).current;
  const time = useRef(new Animated.Value(0)).current;

  const rotRef = useRef({ x: 0.4, y: 1.2, zoom: 0.9, time: 0 });
  const lastDistRef = useRef(null); // Fix for the 'lastDist' undefined error
  const [_, setUpdateTrigger] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(time, {
        toValue: 3600000,
        duration: 3600000,
        useNativeDriver: true,
      })
    ).start();

    const listener = time.addListener(({ value }) => {
      rotRef.current.time = value;
      setUpdateTrigger(v => v + 1);
    });
    return () => time.removeListener(listener);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (selectedPlanet) return;

        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          // PINCH TO ZOOM
          const touch1 = touches[0];
          const touch2 = touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          if (lastDistRef.current) {
            const diff = distance - lastDistRef.current;
            rotRef.current.zoom = Math.max(0.2, Math.min(5, rotRef.current.zoom + diff * 0.005));
          }
          lastDistRef.current = distance;
        } else {
          // ROTATION
          rotRef.current.y += gestureState.dx * 0.0001;
          rotRef.current.x += gestureState.dy * 0.0001;
        }
        setUpdateTrigger(prev => prev + 1);
      },
      onPanResponderRelease: () => {
        lastDistRef.current = null; // Reset on release
      }
    })
  ).current;

  const centerX = width / 2;
  const centerY = height / 2 - 50;

  const project = (x, y, z, rot, zoomVal) => {
    const cx = Math.cos(rot.x), sx = Math.sin(rot.x), cy = Math.cos(rot.y), sy = Math.sin(rot.y);
    const ny = y * cx - z * sx, nz1 = y * sx + z * cx;
    const nx = x * cy - nz1 * sy, nz = x * sy + nz1 * cy;
    const d = 5000 + nz;
    const scale = (5000 / d) * zoomVal;
    return { x: centerX + nx * scale, y: centerY - ny * scale, scale, depth: nz };
  };

  const planetData = useMemo(() => {
    const { x, y, zoom: z, time: t } = rotRef.current;
    const curRot = selectedPlanet ? { x: 0.1, y: y } : { x, y };
    const curZoom = selectedPlanet ? 2.8 : z;

    return planets.map((p) => {
      let x3d = 0, y3d = 0, z3d = 0;
      if (!p.isSun) {
        const distanceAU = p.distanceAU || 1;
        const orbitRadius = 250 + 400 * Math.pow(distanceAU, 0.45);
        const orbitalPeriod = (p.orbitalPeriod || 1) * 20000;
        const angle = (t / orbitalPeriod) + (p.initialAngle || 0);
        x3d = Math.cos(angle) * orbitRadius;
        z3d = Math.sin(angle) * orbitRadius;
      }

      const p2d = project(x3d, y3d, z3d, curRot, curZoom);
      const baseSize = p.isSun ? 70 : 32;
      
      if (selectedPlanet && p.id === selectedPlanet.id) {
        return { ...p, x: centerX, y: centerY - 100, size: 240, zIndex: 1000, visible: true, scale: 1 };
      }
      if (selectedPlanet && p.id !== selectedPlanet.id) {
        return { ...p, visible: false };
      }

      return { 
        ...p, 
        x: p2d.x, 
        y: p2d.y, 
        size: baseSize * p2d.scale, 
        zIndex: Math.floor(1000 - p2d.depth),
        visible: true,
        pScale: p2d.scale
      };
    });
  }, [selectedPlanet, width, height, _]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {planetData.filter(p => p.visible).sort((a,b) => a.zIndex - b.zIndex).map((p) => (
        <Pressable
          key={p.id}
          onPress={() => onPlanetPress(p.id)}
          style={[
            styles.planet,
            {
              transform: [
                { translateX: p.x - p.size / 2 },
                { translateY: p.y - p.size / 2 }
              ],
              width: p.size,
              height: p.size,
              zIndex: p.zIndex,
            }
          ]}
        >
          <View style={[styles.sphere, { backgroundColor: p.color, width: p.size, height: p.size, borderRadius: p.size/2 }]}>
            <View style={[styles.glow, { borderColor: p.color, opacity: 0.4, width: p.size + 8, height: p.size + 8, borderRadius: (p.size + 8)/2 }]} />
            <View style={[styles.innerShadow, { backgroundColor: 'rgba(0,0,0,0.4)', width: p.size, height: p.size, borderRadius: p.size/2, top: p.size * 0.2, left: p.size * 0.2 }]} />
            
            {p.name === 'Thổ Tinh' && (
              <View style={[styles.ring, { width: p.size * 2.4, height: p.size * 0.5, borderRadius: p.size, left: -p.size * 0.7 }]} />
            )}
          </View>
        </Pressable>
      ))}
      
      {!selectedPlanet && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>XOAY 3D • DÙNG 2 NGÓN TAY ĐỂ ZOOM</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  planet: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  sphere: { justifyContent: 'center', alignItems: 'center' },
  glow: { position: 'absolute', borderWidth: 1.5 },
  innerShadow: { position: 'absolute' },
  ring: { position: 'absolute', borderWidth: 2, borderColor: 'rgba(200, 180, 150, 0.4)', top: '35%' },
  hint: { position: 'absolute', bottom: 30, width: '100%', alignItems: 'center' },
  hintText: { color: '#00d4ff', fontSize: 9, fontWeight: 'bold', letterSpacing: 1.5, opacity: 0.5 }
});

export default SolarSystem;
