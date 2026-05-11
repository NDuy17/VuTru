import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { PLANET_TEXTURES } from '../../data/textures';
import countries from '../../data/countries';
import SunDetails from './SunDetails';
import MercuryDetails from './MercuryDetails';
import VenusDetails from './VenusDetails';
import EarthDetails from './EarthDetails';
import MarsDetails from './MarsDetails';
import JupiterDetails from './JupiterDetails';
import SaturnDetails from './SaturnDetails';
import UranusDetails from './UranusDetails';
import NeptuneDetails from './NeptuneDetails';

const detailMap = {
  0: SunDetails,
  1: MercuryDetails,
  2: VenusDetails,
  3: EarthDetails,
  4: MarsDetails,
  5: JupiterDetails,
  6: SaturnDetails,
  7: UranusDetails,
  8: NeptuneDetails,
};

const CONTINENT_DATA = [
  {
    id: 'asia',
    name: 'Châu Á',
    description: 'Châu Á là lục địa lớn nhất với nhiều quốc gia và nền văn hoá đa dạng.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Asia_location_map.svg/1024px-Asia_location_map.svg.png',
    countries: [
      'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh',
      'Bhutan', 'Brunei', 'Campuchia', 'Trung Quốc', 'Georgia',
      'Ấn Độ', 'Indonesia', 'Iran', 'Iraq', 'Israel',
      'Nhật Bản', 'Jordan', 'Kazakhstan', 'Hàn Quốc', 'Kuwait',
      'Kyrgyzstan', 'Lào', 'Lebanon', 'Malaysia', 'Maldives',
      'Mông Cổ', 'Miến Điện', 'Nepal', 'Bắc Triều Tiên', 'Oman',
      'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Ả Rập Xê Út',
      'Singapore', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thái Lan',
      'Đông Timor', 'Turkmenistan', 'Các Tiểu vương quốc Ả Rập Thống nhất',
      'Uzbekistan', 'Việt Nam', 'Yemen',
    ],
  },
  {
    id: 'europe',
    name: 'Châu Âu',
    description: 'Châu Âu nổi tiếng với lịch sử lâu đời và nhiều quốc gia nhỏ xinh.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Europe_location_map.svg/1024px-Europe_location_map.svg.png',
    countries: [
      'Albania', 'Andorra', 'Áo', 'Belarus', 'Bỉ',
      'Bosnia và Hercegovina', 'Bulgaria', 'Croatia', 'Síp', 'Cộng hòa Séc',
      'Đan Mạch', 'Estonia', 'Phần Lan', 'Pháp', 'Đức',
      'Hy Lạp', 'Hungary', 'Iceland', 'Ireland', 'Ý',
      'Kazakhstan', 'Kosovo', 'Latvia', 'Liechtenstein', 'Litva',
      'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro',
      'Hà Lan', 'Bắc Macedonia', 'Na Uy', 'Ba Lan', 'Bồ Đào Nha',
      'Romania', 'Nga', 'San Marino', 'Serbia', 'Slovakia',
      'Slovenia', 'Tây Ban Nha', 'Thụy Điển', 'Thụy Sĩ', 'Ukraine',
      'Vương quốc Anh',
    ],
  },
  {
    id: 'africa',
    name: 'Châu Phi',
    description: 'Châu Phi có nhiều vùng đất hoang sơ và nền văn hoá bản địa phong phú.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Africa_location_map.svg/1024px-Africa_location_map.svg.png',
    countries: [
      'Algieria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso',
      'Burundi', 'Cabo Verde', 'Cameroon', 'Cộng hòa Trung Phi', 'Chad',
      'Comoros', 'Congo', 'Cộng hòa Dân chủ Congo', 'Bờ Biển Ngà', 'Djibouti',
      'Ai Cập', 'Guinea Xích Đạo', 'Eritrea', 'Eswatini', 'Ethiopia',
      'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau',
      'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar',
      'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco',
      'Mozambique', 'Nam Phi', 'Nam Sudan', 'Niger', 'Nigeria',
      'Rwanda', 'Sao Tome và Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
      'Somalia', 'Sudan', 'Tanzania', 'Togo', 'Tunisia',
      'Uganda', 'Zambia', 'Zimbabwe',
    ],
  },
  {
    id: 'northAmerica',
    name: 'Bắc Mỹ',
    description: 'Bắc Mỹ là lục địa rộng lớn với nhiều quốc gia phát triển.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/North_America_%28orthographic_projection%29.svg/1024px-North_America_%28orthographic_projection%29.svg.png',
    countries: [
      'Antigua và Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada',
      'Costa Rica', 'Cuba', 'Dominica', 'Cộng hòa Dominican', 'El Salvador',
      'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica',
      'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts và Nevis',
      'Saint Lucia', 'Saint Vincent và Grenadines', 'Trinidad và Tobago',
      'Hoa Kỳ',
    ],
  },
  {
    id: 'southAmerica',
    name: 'Nam Mỹ',
    description: 'Nam Mỹ nổi bật với rừng mưa Amazon và các nền văn hoá bản địa.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/South_America_location_map.svg/1024px-South_America_location_map.svg.png',
    countries: [
      'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia',
      'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname',
      'Uruguay', 'Venezuela',
    ],
  },
  {
    id: 'oceania',
    name: 'Châu Úc',
    description: 'Châu Úc bao gồm Australia và các đảo quốc Thái Bình Dương.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Oceania_location_map.svg/1024px-Oceania_location_map.svg.png',
    countries: [
      'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia',
      'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa',
      'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu',
    ],
  },
  {
    id: 'antarctica',
    name: 'Nam Cực',
    description: 'Nam Cực là lục địa băng giá, không có quốc gia chính thức.',
    mapImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Antarctica_%28orthographic_projection%29.svg/1024px-Antarctica_%28orthographic_projection%29.svg.png',
    countries: ['Không có quốc gia'],
  },
];

const COUNTRY_INFO_MAP = countries.reduce((map, country) => {
  map[country.nameVi] = country;
  map[country.nameEn] = country;
  return map;
}, {});

/**
 * EarthExplorePanel Component
 * Provides an interactive exploration interface for Earth continents and countries
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback function when user wants to return to Earth details
 * @param {Function} props.onClose - Callback function when user closes the explore panel
 * @returns {React.ReactNode} The explore panel UI
 */
const EarthExplorePanel = React.memo(({ onBack, onClose }) => {
  const [selectedContinent, setSelectedContinent] = React.useState(null);
  const [expandedCountry, setExpandedCountry] = React.useState(null);

  const continent = CONTINENT_DATA.find((item) => item.id === selectedContinent);

  React.useEffect(() => {
    setSelectedContinent(null);
    setExpandedCountry(null);
  }, []);

  const toggleCountry = (country) => {
    setExpandedCountry((current) => (current === country ? null : country));
  };

  return (
    <View style={styles.exploreContainer}>
      <View style={styles.exploreHeader}>
        <View>
          <Text style={styles.exploreTitle}>Khám phá Trái Đất</Text>
          <Text style={styles.exploreSubtitle}>Hiện bản đồ hiện giờ và chọn châu lục để xem quốc gia.</Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.mapPreviewContainer}>
        <Image
          source={{ uri: continent?.mapImage || PLANET_TEXTURES.earth }}
          style={styles.mapPreview}
        />
        <Text style={styles.mapPreviewLabel}>
          {continent ? `Bản đồ ${continent.name}` : 'Bản đồ hiện giờ'}
        </Text>
      </View>

      <ScrollView style={styles.exploreContent}>
        <Text style={styles.sectionTitle}>Các châu lục</Text>
        <View style={styles.continentList}>
          {CONTINENT_DATA.map((item) => {
            const active = item.id === selectedContinent;
            return (
              <Pressable
                key={item.id}
                style={[
                  styles.continentItem,
                  active ? styles.continentItemActive : styles.continentItemInactive,
                ]}
                onPress={() => setSelectedContinent(item.id)}
              >
                <View style={styles.continentTextGroup}>
                  <Text style={[styles.continentItemTitle, active && styles.continentItemTitleActive]}>{item.name}</Text>
                  <Text style={[styles.continentItemText, active && styles.continentItemTextActive]}>{item.countries.length} quốc gia</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {continent ? (
          <>
            <Pressable style={styles.backLink} onPress={() => setSelectedContinent(null)}>
              <Text style={styles.backLinkText}>← Quay lại các châu lục</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>{continent.name}</Text>
            <Text style={styles.sectionDescription}>{continent.description}</Text>
            <View style={styles.countryList}>
              {continent.countries.map((country) => {
                const expanded = expandedCountry === country;
                const details = COUNTRY_INFO_MAP[country];
                return (
                  <View key={country} style={styles.countryBlock}>
                    <Pressable
                      style={[
                        styles.countryItem,
                        expanded && styles.countryItemExpanded,
                      ]}
                      onPress={() => toggleCountry(country)}
                    >
                      <Text style={styles.countryText}>{country}</Text>
                      <Text style={styles.countryArrow}>{expanded ? '▲' : '▼'}</Text>
                    </Pressable>
                    {expanded && (
                      <View style={styles.countryDetailPanel}>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Tên tiếng Anh: </Text>{details?.nameEn || country}</Text>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Thủ đô: </Text>{details?.capital || 'Đang cập nhật'}</Text>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Châu lục: </Text>{details?.continent || continent.name}</Text>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Vị trí: </Text>{details?.location || continent.name}</Text>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Diện tích: </Text>{details?.area ? `${details.area.toLocaleString('vi-VN')} km²` : 'Đang cập nhật'}</Text>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Dân số: </Text>{details?.population ? details.population.toLocaleString('vi-VN') : 'Đang cập nhật'}</Text>
                        <Text style={styles.detailRow}><Text style={styles.detailLabel}>Múi giờ: </Text>{details?.timezone || 'Đang cập nhật'}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <Text style={styles.sectionDescription}>Chọn một châu lục để làm nổi bật và xem danh sách quốc gia.</Text>
        )}
      </ScrollView>

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Trở lại thông tin Trái Đất</Text>
      </Pressable>
    </View>
  );
});

EarthExplorePanel.displayName = 'EarthExplorePanel';
EarthExplorePanel.propTypes = {
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * PlanetDetails Component
 * Main component for displaying detailed information about selected planets
 * Handles routing to planet-specific detail components and Earth exploration mode
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.planet - Planet data object containing id, name, and other properties
 * @param {Function} props.onClose - Callback when closing planet details
 * @param {boolean} props.isExploreMode - Whether in Earth exploration mode
 * @param {Function} props.onToggleExplore - Callback to toggle explore mode
 * @param {string|null} props.earthMapMode - Current Earth map mode (continents/countries)
 * @param {Function} props.onEarthMapModeChange - Callback when Earth map mode changes
 * @returns {React.ReactNode} Planet details UI or null if planet not found
 */
const PlanetDetails = ({
  planet,
  onClose,
  isExploreMode,
  onToggleExplore,
  earthMapMode,
  onEarthMapModeChange,
}) => {
  const SpecificDetails = detailMap[planet.id];
  if (!SpecificDetails) return null;
  const isEarth = planet.id === 3;

  if (isEarth && isExploreMode) {
    return <EarthExplorePanel onBack={onToggleExplore} onClose={onClose} />;
  }

  return (
    <View style={styles.wrapper}>
      <SpecificDetails 
        planet={planet} 
        onClose={onClose}
        showExploreButton={true}
        isExploreMode={isExploreMode}
        onToggleExplore={onToggleExplore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  exploreContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 15, 30, 0.95)',
    padding: 20,
  },
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  exploreTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#00d4ff',
    marginBottom: 6,
  },
  exploreSubtitle: {
    color: '#abc7d6',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: '76%',
  },
  closeBtn: {
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 22,
  },
  mapPreviewContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1d6aa5',
    marginBottom: 16,
  },
  mapPreview: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  mapPreviewLabel: {
    padding: 12,
    backgroundColor: '#0a1627',
    color: '#f4fbff',
    fontWeight: '700',
    fontSize: 14,
  },
  exploreContent: {
    flex: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#e8f8ff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  sectionDescription: {
    color: '#c2d6e4',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  continentList: {
    flexDirection: 'column',
  },
  continentItem: {
    backgroundColor: 'rgba(13, 48, 74, 0.95)',
    borderWidth: 1,
    borderColor: '#1f6caa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  continentItemActive: {
    backgroundColor: 'rgba(0, 120, 255, 0.95)',
    borderColor: '#3fc0ff',
  },
  continentItemInactive: {
    opacity: 0.65,
  },
  continentItemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  continentItemTitleActive: {
    color: '#e5f7ff',
  },
  continentItemText: {
    color: '#9ec7ec',
    fontSize: 13,
  },
  continentItemTextActive: {
    color: '#d3f3ff',
  },
  continentTextGroup: {
    flex: 1,
  },

  countryList: {
    flexDirection: 'column',
  },
  countryBlock: {
    marginBottom: 10,
  },
  countryItem: {
    backgroundColor: 'rgba(0, 77, 145, 0.85)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryItemExpanded: {
    backgroundColor: 'rgba(0, 120, 220, 0.95)',
  },
  countryText: {
    color: '#f4fbff',
    fontSize: 15,
    fontWeight: '700',
  },
  countryArrow: {
    color: '#b8e7ff',
    fontSize: 14,
    fontWeight: '800',
  },
  countryDetailPanel: {
    backgroundColor: 'rgba(6, 26, 55, 0.92)',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#1470d9',
  },
  detailRow: {
    color: '#d9e9ff',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  detailLabel: {
    color: '#8dd8ff',
    fontWeight: '700',
  },
  backLink: {
    marginBottom: 12,
  },
  backLinkText: {
    color: '#8dd8ff',
    fontSize: 13,
  },
  exploreButton: {
    backgroundColor: 'rgba(0, 140, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(0, 180, 255, 0.96)',
    borderWidth: 1,
    borderColor: '#b8efff',
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  backButton: {
    backgroundColor: '#00d4ff22',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00d4ff55',
  },
  backButtonText: {
    color: '#00d4ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

PlanetDetails.propTypes = {
  planet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    selected: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  isExploreMode: PropTypes.bool,
  onToggleExplore: PropTypes.func,
  earthMapMode: PropTypes.string,
  onEarthMapModeChange: PropTypes.func,
};

PlanetDetails.defaultProps = {
  isExploreMode: false,
  onToggleExplore: () => {},
  earthMapMode: null,
  onEarthMapModeChange: () => {},
};

export default PlanetDetails;
