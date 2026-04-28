import React from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlanet } from '../redux/slices/planetsSlice';
import SolarSystem from './SolarSystem';

const SolarSystemMobile = () => {
  const planets = useSelector((state) => state.planets.planets);
  const selectedPlanet = useSelector((state) =>
    state.planets.planets.find((p) => !!p.selected)
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(selectPlanet(null));
  };

  return (
    <View style={styles.container}>
      <SolarSystem
        planets={planets}
        onPlanetPress={(id) => dispatch(selectPlanet(id))}
      />

      {!!selectedPlanet && (
        <View style={styles.infoCard}>
          <View style={styles.header}>
            <Text style={styles.planetTitle}>{selectedPlanet.emoji} {selectedPlanet.name}</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.scrollArea}>
            <Text style={styles.description}>{selectedPlanet.description}</Text>
            
            <View style={styles.statsGrid}>
              <StatItem label="Khối lượng" value={selectedPlanet.mass} />
              <StatItem label="Nhiệt độ" value={selectedPlanet.temperature} />
              <StatItem label="Trọng lực" value={selectedPlanet.gravity} />
              <StatItem label="Mặt trăng" value={selectedPlanet.moons} />
              <StatItem label="Loại" value={selectedPlanet.type} />
              <StatItem label="Khoảng cách" value={selectedPlanet.distanceAU ? `${selectedPlanet.distanceAU} AU` : 'N/A'} />
            </View>
          </ScrollView>

          <Pressable onPress={handleClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>QUAY LẠI HỆ MẶT TRỜI</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(10, 15, 30, 0.95)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    borderTopWidth: 4,
    borderTopColor: '#00d4ff',
    elevation: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  planetTitle: { fontSize: 28, fontWeight: 'bold', color: '#00d4ff' },
  closeBtn: { padding: 10 },
  closeText: { color: '#666', fontSize: 24 },
  scrollArea: { flex: 1 },
  description: { color: '#ccc', fontSize: 15, lineHeight: 24, marginBottom: 20 },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20
  },
  statItem: { width: '48%', marginBottom: 12 },
  statLabel: { color: '#888', fontSize: 11, marginBottom: 2 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  backButton: { 
    backgroundColor: '#00d4ff22', 
    padding: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#00d4ff55' 
  },
  backButtonText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 14 }
});

export default SolarSystemMobile;
