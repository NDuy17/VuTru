import React, { memo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

/**
 * SunDetails Component - Displays comprehensive information about the Sun
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.planet - Planet/Sun data object
 * @param {Function} props.onClose - Close callback
 * @param {boolean} [props.showExploreButton] - Show explore button
 * @param {boolean} [props.isExploreMode] - Exploration mode flag
 * @param {Function} [props.onToggleExplore] - Toggle explore callback
 * @returns {React.ReactNode} Sun details UI
 */
const SunDetails = memo(({ planet, onClose, showExploreButton, isExploreMode, onToggleExplore }) => (
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
    </ScrollView>

    <Pressable onPress={onClose} style={styles.backButton}>
      <Text style={styles.backButtonText}>QUAY LẠI HỆ MẶT TRỜI</Text>
    </Pressable>
  </View>
));

/**
 * StatItem Component - Displays a single statistic item
 * @component
 */
const StatItem = memo(({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value || 'N/A'}</Text>
  </View>
));

StatItem.displayName = 'StatItem';
StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SunDetails.displayName = 'SunDetails';
SunDetails.propTypes = {
  planet: PropTypes.shape({
    id: PropTypes.number,
    emoji: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    mass: PropTypes.string,
    temperature: PropTypes.string,
    gravity: PropTypes.string,
    type: PropTypes.string,
    distanceAU: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    moonsInfo: PropTypes.arrayOf(PropTypes.object),
    moons: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  showExploreButton: PropTypes.bool,
  isExploreMode: PropTypes.bool,
  onToggleExplore: PropTypes.func,
};

const styles = StyleSheet.create({
  infoCard: {
    position: 'absolute',
    backgroundColor: 'rgba(10, 15, 30, 0.95)',
    padding: 25,
    elevation: 20,
    ...Platform.select({
      web: {
        top: 14,
        right: 14,
        bottom: 14,
        width: '33%',
        minWidth: 360,
        maxWidth: 460,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#00d4ff66',
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

export default SunDetails;
