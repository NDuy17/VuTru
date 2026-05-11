import React, { memo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

/**
 * StatItem Component
 * Displays a single statistic item with label and value
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {string|number} props.value - Value to display
 * @returns {React.ReactNode} Stat item UI
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
StatItem.defaultProps = {
  value: null,
};

/**
 * EarthDetails Component
 * Displays comprehensive information about Earth
 * Shows planet statistics, moons, and explore functionality
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.planet - Planet data object
 * @param {Function} props.onClose - Close callback
 * @param {boolean} [props.showExploreButton] - Show explore button
 * @param {boolean} [props.isExploreMode] - Exploration mode flag
 * @param {Function} [props.onToggleExplore] - Toggle explore mode callback
 * @returns {React.ReactNode} Earth details UI
 */
const EarthDetails = memo(({ planet, onClose, showExploreButton, isExploreMode, onToggleExplore }) => (
  <View style={styles.infoCard}>
    <View style={styles.header}>
      <Text style={styles.planetTitle}>{planet.emoji} {planet.name}</Text>
      <Pressable 
        onPress={onClose} 
        style={styles.closeBtn}
        accessibilityRole="button"
        accessibilityLabel="Đóng"
        accessibilityHint="Đóng thông tin chi tiết của Trái Đất"
      >
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
              <View style={styles.moonDetailsGrid}>
                <Text style={styles.moonDetail}>Đường kính: {moon.diameter}</Text>
                <Text style={styles.moonDetail}>Khoảng cách: {moon.distance}</Text>
                <Text style={styles.moonDetail}>Chu kỳ quỹ đạo: {moon.orbitalPeriod}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>

    {showExploreButton && (
      <Pressable 
        style={styles.exploreButton} 
        onPress={onToggleExplore}
        accessibilityRole="button"
        accessibilityLabel={isExploreMode ? 'Thoát khám phá' : 'Khám phá'}
        accessibilityHint="Bật hoặc tắt chế độ khám phá các châu lục"
      >
        <Text style={styles.exploreButtonText}>{isExploreMode ? 'Thoát khám phá' : 'Khám phá'}</Text>
      </Pressable>
    )}

    <Pressable 
      onPress={onClose} 
      style={styles.backButton}
      accessibilityRole="button"
      accessibilityLabel="Quay lại"
      accessibilityHint="Quay lại màn hình hệ mặt trời"
    >
      <Text style={styles.backButtonText}>QUAY LẠI HỆ MẶT TRỜI</Text>
    </Pressable>
  </View>
));



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
  moonDetailsGrid: { marginTop: 10, paddingLeft: 10 },
  moonDetail: { color: '#ccc', fontSize: 12, marginTop: 4 },
  exploreButton: {
    backgroundColor: 'rgba(0, 140, 255, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
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

EarthDetails.displayName = 'EarthDetails';
EarthDetails.propTypes = {
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

EarthDetails.defaultProps = {
  showExploreButton: false,
  isExploreMode: false,
  onToggleExplore: () => {},
};

export default EarthDetails;
