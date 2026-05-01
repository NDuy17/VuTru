import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';

const JupiterDetails = ({ planet, onClose }) => (
  <View style={styles.infoCard}>
    <View style={styles.header}>
      <Text style={styles.planetTitle}>{planet.emoji} {planet.name}</Text>
      <Pressable onPress={onClose} style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>

    <ScrollView style={styles.scrollArea}>
      <Text style={styles.description}>{planet.description}</Text>

      <View style={styles.statsGrid}>
        <StatItem label="Khối lượng" value={planet.mass} />
        <StatItem label="Nhiệt độ" value={planet.temperature} />
        <StatItem label="Trọng lực" value={planet.gravity} />
        <StatItem label="Mặt trăng" value={planet.moonsInfo?.length ?? planet.moons ?? 0} />
        <StatItem label="Loại" value={planet.type} />
        <StatItem label="Khoảng cách" value={planet.distanceAU ? `${planet.distanceAU} AU` : 'N/A'} />
      </View>

      {planet.moonsInfo?.length > 0 && (
        <View style={styles.moonSection}>
          <Text style={styles.moonSectionTitle}>Thông tin mặt trăng</Text>
          {planet.moonsInfo.map((moon) => (
            <View key={moon.id} style={styles.moonItem}>
              <Text style={styles.moonName}>{moon.emoji} {moon.name}</Text>
              <Text style={styles.moonDescription}>{moon.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>

    <Pressable onPress={onClose} style={styles.backButton}>
      <Text style={styles.backButtonText}>QUAY LẠI HỆ MẶT TRỜI</Text>
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
    backgroundColor: 'rgba(10, 15, 30, 0.95)',
    padding: 25,
    elevation: 20,
    ...Platform.select({
      web: {
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        borderTopWidth: 4,
        borderTopColor: '#00d4ff',
      },
      default: {
        top: 0,
        right: 0,
        bottom: 0,
        width: '42%',
        borderLeftWidth: 4,
        borderLeftColor: '#00d4ff',
      }
    })
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
    marginBottom: 20,
  },
  statItem: { width: '48%', marginBottom: 12 },
  statLabel: { color: '#888', fontSize: 11, marginBottom: 2 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  moonSection: {
    marginTop: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
  },
  moonSectionTitle: {
    color: '#00d4ff',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 14,
  },
  moonItem: { marginBottom: 12 },
  moonName: { color: '#fff', fontWeight: '700', fontSize: 13 },
  moonDescription: { color: '#ccc', fontSize: 12, marginTop: 2, lineHeight: 18 },
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

export default JupiterDetails;
