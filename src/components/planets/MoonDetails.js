import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';

const MoonDetails = ({ moon, planet, onClose }) => (
  <View style={styles.infoCard}>
    <View style={styles.header}>
      <Text style={styles.planetTitle}>{moon.emoji} {moon.name}</Text>
      <Pressable onPress={onClose} style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>

    <ScrollView style={styles.scrollArea}>
      <Text style={styles.subtitle}>Mặt trăng của {planet.name}</Text>
      <Text style={styles.description}>{moon.description}</Text>

      <View style={styles.statsGrid}>
        <StatItem label="Đường kính" value={moon.diameter} />
        <StatItem label="Khoảng cách" value={moon.distance} />
        <StatItem label="Chu kỳ" value={moon.orbitalPeriod ? `${moon.orbitalPeriod} ngày` : 'N/A'} />
      </View>
    </ScrollView>

    <Pressable onPress={onClose} style={styles.backButton}>
      <Text style={styles.backButtonText}>QUAY LẠI HÀNH TINH</Text>
    </Pressable>
  </View>
);

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
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
  subtitle: { color: '#88d0ff', fontSize: 14, marginBottom: 14 },
  scrollArea: { flex: 1 },
  description: { color: '#ccc', fontSize: 15, lineHeight: 24, marginBottom: 20 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
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
    borderColor: '#00d4ff55',
  },
  backButtonText: { color: '#00d4ff', fontWeight: 'bold', fontSize: 14 },
});

export default MoonDetails;
