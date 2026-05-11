import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { PLANET_TEXTURES } from '../data/textures';

const mapConfig = {
  continents: {
    title: 'Ban do chau luc',
    subtitle: 'Chi hien cac chau luc, khong hien ranh gioi quoc gia',
  },
  countries: {
    title: 'Ban do quoc gia',
    subtitle: 'Xem ranh gioi va ten quoc gia ro hon',
    bbox: '-180,-58,180,83',
  },
};

/**
 * EarthMapPanel Component
 * Displays the web-only Earth map overlay for continent and country modes.
 * @component
 * @param {Object} props - Component props
 * @param {string} props.mode - Active map mode
 * @param {Function} props.onModeChange - Callback when the map mode changes
 * @param {Function} props.onClose - Callback when the panel closes
 * @returns {React.ReactNode} Earth map panel UI
 */
const EarthMapPanel = memo(({ mode, onModeChange, onClose }) => {
  const config = useMemo(() => mapConfig[mode] || mapConfig.continents, [mode]);
  const mapUrl = useMemo(
    () => mode === 'countries'
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(config.bbox)}&layer=mapnik`
      : null,
    [config.bbox, mode]
  );

  const handleContinentsMode = useCallback(() => {
    onModeChange?.('continents');
  }, [onModeChange]);

  const handleCountriesMode = useCallback(() => {
    onModeChange?.('countries');
  }, [onModeChange]);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <View>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            style={[styles.modeButton, mode === 'continents' && styles.modeButtonActive]}
            onPress={handleContinentsMode}
            accessibilityRole="button"
            accessibilityLabel="Chau luc"
            accessibilityHint="Chuyen sang ban do chau luc"
          >
            <Text style={styles.modeButtonText}>Chau luc</Text>
          </Pressable>
          <Pressable
            style={[styles.modeButton, mode === 'countries' && styles.modeButtonActive]}
            onPress={handleCountriesMode}
            accessibilityRole="button"
            accessibilityLabel="Quoc gia"
            accessibilityHint="Chuyen sang ban do quoc gia"
          >
            <Text style={styles.modeButtonText}>Quoc gia</Text>
          </Pressable>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Dong"
            accessibilityHint="Dong bang dieu khien ban do"
          >
            <Text style={styles.closeText}>Dong</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.mapShell}>
        {mode === 'continents' ? (
          <View style={styles.continentMap}>
            <img
              alt="World map without country borders"
              src={PLANET_TEXTURES.earth}
              style={styles.continentImage}
            />
            <Text style={[styles.continentLabel, styles.northAmerica]}>Bac My</Text>
            <Text style={[styles.continentLabel, styles.southAmerica]}>Nam My</Text>
            <Text style={[styles.continentLabel, styles.europe]}>Chau Au</Text>
            <Text style={[styles.continentLabel, styles.africa]}>Chau Phi</Text>
            <Text style={[styles.continentLabel, styles.asia]}>Chau A</Text>
            <Text style={[styles.continentLabel, styles.oceania]}>Chau Uc</Text>
            <Text style={[styles.continentLabel, styles.antarctica]}>Nam Cuc</Text>
          </View>
        ) : (
          <iframe
            title={config.title}
            src={mapUrl}
            style={styles.iframe}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
      </View>
    </View>
  );
});

EarthMapPanel.displayName = 'EarthMapPanel';
EarthMapPanel.propTypes = {
  mode: PropTypes.string.isRequired,
  onModeChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 400,
    zIndex: 35,
    backgroundColor: '#07111c',
    padding: 24,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    color: '#f4fbff',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#abc7d6',
    fontSize: 13,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeButton: {
    backgroundColor: '#173247',
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginLeft: 8,
  },
  modeButtonActive: {
    backgroundColor: '#148fe2',
  },
  modeButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  closeButton: {
    backgroundColor: '#263241',
    borderRadius: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginLeft: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  mapShell: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a88b7',
    backgroundColor: '#d8e0e6',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 0,
  },
  continentMap: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#16364f',
  },
  continentImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  continentLabel: {
    position: 'absolute',
    color: '#102030',
    fontSize: 20,
    fontWeight: '900',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
  },
  northAmerica: { left: '16%', top: '30%' },
  southAmerica: { left: '28%', top: '62%' },
  europe: { left: '48%', top: '27%' },
  africa: { left: '50%', top: '52%' },
  asia: { left: '66%', top: '34%' },
  oceania: { left: '76%', top: '68%' },
  antarctica: { left: '49%', top: '88%' },
});

export default EarthMapPanel;
