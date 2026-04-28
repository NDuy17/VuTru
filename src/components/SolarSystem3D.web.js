import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlanet } from '../redux/slices/planetsSlice';

const EARTH_REFERENCE_ORBIT_DURATION = 100000;

const SolarSystem3DWeb = () => {
  const canvasRef = useRef(null);
  const planets = useSelector((state) => state.planets.planets);
  const selectedPlanet = useSelector((state) =>
    state.planets.planets.find((p) => p.selected)
  );
  const dispatch = useDispatch();

  const [rotation, setRotation] = useState({ x: 0.4, y: 1.2 });
  const [zoom, setZoom] = useState(1.2);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  
  const rotationRef = useRef(rotation);
  const zoomRef = useRef(zoom);
  const planetsRef = useRef(planets);
  const selectedPlanetRef = useRef(selectedPlanet);
  const timeRef = useRef(0);
  const focusProgressRef = useRef(0);
  const cameraTargetRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { planetsRef.current = planets; }, [planets]);
  useEffect(() => { selectedPlanetRef.current = selectedPlanet; }, [selectedPlanet]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMouseDown = (e) => { isDraggingRef.current = true; dragStartRef.current = { x: e.clientX, y: e.clientY }; };
    const onMouseUp = () => { isDraggingRef.current = false; };
    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setRotation(prev => ({ x: prev.x + dy * 0.003, y: prev.y + dx * 0.003 }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (!selectedPlanetRef.current) {
        setZoom(prev => Math.max(0.1, Math.min(50, prev - e.deltaY * 0.0002)));
      }
    };

    const onClick = (e) => {
      if (selectedPlanetRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let nearestId = null;
      let minDist = 50;
      planetsRef.current.forEach(p => {
        const a = getOrbitAngle(p, timeRef.current);
        const pt = p.isSun ? { x: 0, y: 0, z: 0 } : getOrbitPoint(p, a);
        const s = projectTo2D(pt.x, pt.y, pt.z, rotationRef.current, zoomRef.current, canvas.width, canvas.height, cameraTargetRef.current);
        const d = Math.hypot(mx - s.x, my - s.y);
        if (d < minDist) { minDist = d; nearestId = p.id; }
      });
      dispatch(selectPlanet(nearestId));
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('click', onClick);

    const getOrbitAngle = (p, t) => p.isSun ? 0 : (t * Math.PI * 2) / ((p.orbitalPeriod || 1) * EARTH_REFERENCE_ORBIT_DURATION) + (p.initialAngle || 0);
    
    // COMPACT ORBITS: Nén quỹ đạo vòng ngoài (5-8) để hệ thống gọn gàng hơn
    const getOrbitPoint = (p, a) => {
      const distanceAU = p.distanceAU || 1;
      // Công thức nén logarit giúp hành tinh ở xa không bị bay quá xa
      const r = 400 + 480 * Math.pow(distanceAU, 0.45); 
      return { x: Math.cos(a) * r, y: 0, z: Math.sin(a) * r };
    };

    const projectTo2D = (x, y, z, rot, zVal, w, h, target) => {
      const cx = Math.cos(rot.x), sx = Math.sin(rot.x), cy = Math.cos(rot.y), sy = Math.sin(rot.y);
      const tx = x - target.x, ty = y - target.y, tz = z - target.z;
      const ny = ty * cx - tz * sx, nz1 = ty * sx + tz * cx;
      const nx = tx * cy - nz1 * sy, nz = tx * sy + nz1 * cy;
      const d = 5000 + nz;
      return { x: w/2 + (nx/d)*5000*zVal, y: h/2 - (ny/d)*5000*zVal };
    };
    const getDepth = (x, y, z, rot, target) => {
      const sx = Math.sin(rot.x), cx = Math.cos(rot.x), sy = Math.sin(rot.y), cy = Math.cos(rot.y);
      const tx = x - target.x, ty = y - target.y, tz = z - target.z;
      return tx * sy + (ty * sx + tz * cx) * cy;
    };

    const animate = () => {
      timeRef.current += 16 * 1.2;
      const t = timeRef.current;
      const fp = focusProgressRef.current = focusProgressRef.current + ((selectedPlanetRef.current ? 1 : 0) - focusProgressRef.current) * 0.08;
      
      let targetPos = { x: 0, y: 0, z: 0 };
      if (selectedPlanetRef.current) {
        const a = getOrbitAngle(selectedPlanetRef.current, t);
        targetPos = selectedPlanetRef.current.isSun ? { x: 0, y: 0, z: 0 } : getOrbitPoint(selectedPlanetRef.current, a);
      }
      cameraTargetRef.current.x += (targetPos.x - cameraTargetRef.current.x) * 0.1;
      cameraTargetRef.current.y += (targetPos.y - cameraTargetRef.current.y) * 0.1;
      cameraTargetRef.current.z += (targetPos.z - cameraTargetRef.current.z) * 0.1;

      const mixedRot = { x: rotationRef.current.x * (1 - fp), y: rotationRef.current.y };
      const curZoom = zoomRef.current * (1 - fp) + 1.8 * fp; 

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (fp < 0.95) {
        ctx.globalAlpha = 1 - fp;
        planetsRef.current.forEach(p => {
          if (p.isSun) return;
          ctx.strokeStyle = 'rgba(100, 150, 255, 0.35)'; ctx.lineWidth = 1; ctx.beginPath();
          for(let i=0; i<=100; i++) {
            const pt = getOrbitPoint(p, (i/100)*Math.PI*2);
            const s = projectTo2D(pt.x, pt.y, pt.z, mixedRot, curZoom, canvas.width, canvas.height, cameraTargetRef.current);
            if (i===0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
          }
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }

      const renderQueue = [];
      planetsRef.current.forEach(p => {
        const a = getOrbitAngle(p, t);
        const pt = p.isSun ? { x:0, y:0, z:0 } : getOrbitPoint(p, a);
        if (selectedPlanetRef.current && p.id !== selectedPlanetRef.current.id && fp > 0.8) return;
        
        const depth = getDepth(pt.x, pt.y, pt.z, mixedRot, cameraTargetRef.current);
        let size = (p.isSun ? 160 : 36) * curZoom;
        if (p.selected) size = 180 * curZoom * (0.5 + fp * 0.5);

        const s = projectTo2D(pt.x, pt.y, pt.z, mixedRot, curZoom, canvas.width, canvas.height, cameraTargetRef.current);
        renderQueue.push({ type: 'planet', p, s, depth, size });
        
        if (p.moon && (!selectedPlanetRef.current || p.selected)) {
          const ma = getOrbitAngle(p.moon, t);
          const moonRadius = 60 * (1 - fp) + 220 * fp; 
          const mx = pt.x + Math.cos(ma) * moonRadius;
          const mz = pt.z + Math.sin(ma) * moonRadius;
          renderQueue.push({ type: 'moon', s: projectTo2D(mx, 0, mz, mixedRot, curZoom, canvas.width, canvas.height, cameraTargetRef.current), depth: getDepth(mx, 0, mz, mixedRot, cameraTargetRef.current), size: size * 0.2 });
        }
      });

      renderQueue.sort((a,b) => b.depth - a.depth).forEach(obj => {
        if (obj.type === 'planet') {
          ctx.save();
          if (obj.p.isSun) {
             const g = ctx.createRadialGradient(obj.s.x, obj.s.y, 0, obj.s.x, obj.s.y, obj.size);
             g.addColorStop(0, '#FFF5C0'); g.addColorStop(1, '#B03000');
             ctx.fillStyle = g; ctx.beginPath(); ctx.arc(obj.s.x, obj.s.y, obj.size, 0, Math.PI * 2); ctx.fill();
          } else {
             if (obj.p.name === 'Thổ Tinh') {
                ctx.strokeStyle = 'rgba(200, 180, 150, 0.4)'; ctx.lineWidth = obj.size * 0.4; ctx.beginPath();
                ctx.ellipse(obj.s.x, obj.s.y, obj.size * 2.2, obj.size * 0.8, 0, 0, Math.PI * 2); ctx.stroke();
             }
             ctx.beginPath(); ctx.arc(obj.s.x, obj.s.y, obj.size, 0, Math.PI * 2); ctx.clip();
             const g = ctx.createRadialGradient(obj.s.x - obj.size * 0.3, obj.s.y - obj.size * 0.3, obj.size * 0.1, obj.s.x, obj.s.y, obj.size);
             g.addColorStop(0, obj.p.color); g.addColorStop(1, '#000');
             ctx.fillStyle = g; ctx.fillRect(obj.s.x - obj.size, obj.s.y - obj.size, obj.size * 2, obj.size * 2);
          }
          ctx.restore();
        } else {
          const g = ctx.createRadialGradient(obj.s.x - obj.size*0.3, obj.s.y - obj.size*0.3, 0, obj.s.x, obj.s.y, obj.size);
          g.addColorStop(0, '#E8E4DE'); g.addColorStop(1, '#78746E');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(obj.s.x, obj.s.y, obj.size, 0, Math.PI * 2); ctx.fill();
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab', userSelect: 'none', touchAction: 'none' }} />
      {selectedPlanet && (
        <View style={styles.soloInfoPanel}>
          <Text style={styles.soloPlanetName}>{selectedPlanet.emoji} {selectedPlanet.name}</Text>
          <View style={styles.soloStatsContainer}>
            <SoloStatItem label="Khối lượng" value={selectedPlanet.mass} />
            <SoloStatItem label="Nhiệt độ" value={selectedPlanet.temperature} />
            <SoloStatItem label="Trọng lực" value={selectedPlanet.gravity} />
            <SoloStatItem label="Mặt trăng" value={selectedPlanet.moons} />
          </View>
          <Text style={styles.soloDescription}>{selectedPlanet.description}</Text>
          <TouchableOpacity onPress={() => dispatch(selectPlanet(null))} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← QUAY LẠI HỆ MẶT TRỜI</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const SoloStatItem = ({ label, value }) => (
  <View style={styles.soloStatItem}><Text style={styles.soloStatLabel}>{label}</Text><Text style={styles.soloStatValue}>{value || 'N/A'}</Text></View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  soloInfoPanel: { 
    position: 'absolute', 
    top: '10%', 
    left: '5%', 
    width: 350, 
    backgroundColor: 'rgba(10, 15, 30, 0.9)', 
    padding: 30, 
    borderRadius: 30, 
    borderLeftWidth: 8, 
    borderLeftColor: '#00d4ff',
    shadowColor: '#00d4ff',
    shadowOpacity: 0.3,
    shadowRadius: 20
  },
  soloPlanetName: { color: '#00d4ff', fontSize: 36, fontWeight: 'bold', marginBottom: 20 },
  soloStatsContainer: { marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 15 },
  soloStatItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  soloStatLabel: { color: '#888', fontSize: 12 },
  soloStatValue: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  soloDescription: { color: '#ccc', fontSize: 14, lineHeight: 24, marginBottom: 30 },
  backBtn: { backgroundColor: '#1a2235', padding: 15, borderRadius: 15, alignItems: 'center' },
  backBtnText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 12 }
});

export default SolarSystem3DWeb;
