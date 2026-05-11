import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

/**
 * MoonDetails Component
 * Displays detailed information about a celestial moon
 * Shows moon data, parent planet reference, and close button
 * Memoized for performance optimization
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.moon - Moon object with id, name, diameter, distance, etc.
 * @param {Object} props.planet - Parent planet object
 * @param {Function} props.onClose - Callback when user closes the panel
 * @param {boolean} [props.showExploreButton] - Whether to show explore button
 * @param {boolean} [props.isExploreMode] - Whether in exploration mode
 * @param {Function} [props.onToggleExplore] - Callback to toggle explore mode
 * @returns {React.ReactNode} Moon details UI
 */
const MoonDetails = ({ moon, planet, onClose, showExploreButton, isExploreMode, onToggleExplore }) => {
  return (<View style={styles.container}>


    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.title}>
        {moon.emoji} {moon.name}
      </Text>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Đóng"
        accessibilityHint="Đóng thông tin mặt trăng"
      >
        <Text style={styles.close}>✕</Text>
      </Pressable>
    </View>

    {/* Content (NO ScrollView nữa) */}
    <Text style={styles.sub}>
      Mặt trăng của {planet.name}
    </Text>

    <Text style={styles.desc}>
      {moon.description}
    </Text>

    {/* Stats (render thẳng, không grid phức tạp) */}
    <View style={styles.stats}>
      <Text style={styles.stat}>Đường kính: {moon.diameter || 'N/A'}</Text>
      <Text style={styles.stat}>Khoảng cách: {moon.distance || 'N/A'}</Text>
      <Text style={styles.stat}>
        Chu kỳ: {moon.orbitalPeriod ? `${moon.orbitalPeriod} ngày` : 'N/A'}
      </Text>
    </View>

    {/* Button */}
    <Pressable
      onPress={onClose}
      style={styles.btn}
      accessibilityRole="button"
      accessibilityLabel="Quay lại"
      accessibilityHint="Quay lại thông tin hành tinh"
    >
      <Text style={styles.btnText}>QUAY LẠI</Text>
    </Pressable>

  </View>

  );
};

MoonDetails.propTypes = {
  moon: PropTypes.shape({
    id: PropTypes.number,
    emoji: PropTypes.string,
    name: PropTypes.string.isRequired,
    diameter: PropTypes.string,
    distance: PropTypes.string,
    orbitalPeriod: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  planet: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  showExploreButton: PropTypes.bool,
  isExploreMode: PropTypes.bool,
  onToggleExplore: PropTypes.func,
};

MoonDetails.defaultProps = {
  showExploreButton: false,
  isExploreMode: false,
  onToggleExplore: () => {},
};

MoonDetails.displayName = 'MoonDetails';

export default React.memo(MoonDetails); // 🔥 QUAN TRỌNG

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0b0f1a',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    color: '#00d4ff',
    fontWeight: 'bold',
  },

  close: {
    fontSize: 20,
    color: '#888',
  },

  sub: {
    fontSize: 13,
    color: '#7fcfff',
    marginBottom: 10,
  },

  desc: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 15,
    lineHeight: 18,
  },

  stats: {
    marginBottom: 20,
  },

  stat: {
    fontSize: 13,
    color: '#ddd',
    marginBottom: 6,
  },

  btn: {
    padding: 12,
    backgroundColor: '#1e2a3a',
    alignItems: 'center',
    borderRadius: 8,
  },

  btnText: {
    color: '#00d4ff',
    fontWeight: 'bold',
  },
});
