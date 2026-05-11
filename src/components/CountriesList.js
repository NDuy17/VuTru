import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import PropTypes from 'prop-types';
import countries from '../data/countries';
import { COLORS, FONT_SIZES } from '../constants';

/**
 * DetailRow Component
 * Displays a single row of country detail information
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the detail row
 * @param {string} props.value - Value to display for the detail
 * @returns {React.ReactNode} Detail row UI
 */
const DetailRow = memo(({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
));

DetailRow.displayName = 'DetailRow';
DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

/**
 * CountriesList Component
 * Main list component displaying countries with expandable details
 * Uses LayoutAnimation for smooth expand/collapse transitions
 * @component
 * @returns {React.ReactNode} Countries list with FlatList
 */
const CountriesList = () => {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  /**
   * Toggle expand state for a country item
   * Triggers LayoutAnimation for smooth transition
   * @function
   * @param {number} id - Country ID to toggle
   */
  const toggleExpand = useCallback((id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((currentId) => (currentId === id ? null : id));
  }, []);

  /**
   * Render individual country item with details
   * @function
   * @param {Object} props - FlatList render props
   * @param {Object} props.item - Country item data
   * @returns {React.ReactNode} Country card UI
   */
  const renderCountry = useCallback(({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <Pressable
        onPress={() => toggleExpand(item.id)}
        style={({ pressed }) => [
          styles.countryCard,
          isExpanded && styles.countryCardExpanded,
          pressed && styles.countryCardPressed,
        ]}
        android_ripple={{ color: '#ffffff20' }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={item.nameVi}
        accessibilityHint="Nhấn để mở hoặc đóng thông tin quốc gia"
        accessibilityState={{ expanded: isExpanded }}
      >
        {/* Header - luôn hiển thị */}
        <View style={styles.countryHeader}>
          <Text style={styles.countryFlag}>{item.flag}</Text>
          <Text style={styles.countryName}>{item.nameVi}</Text>
          <Text style={styles.expandIcon}>
            {isExpanded ? '▲' : '▼'}
          </Text>
        </View>

        {/* Chi tiết - chỉ hiển thị khi expand */}
        {isExpanded && (
          <View style={styles.countryDetails}>
            <DetailRow label="Tên tiếng Anh" value={item.nameEn} />
            <DetailRow label="Thủ đô" value={item.capital} />
            <DetailRow label="Châu lục" value={item.continent} />
            <DetailRow label="Vị trí" value={item.location} />
            <DetailRow
              label="Diện tích"
              value={`${item.area.toLocaleString('vi-VN')} km²`}
            />
            <DetailRow
              label="Dân số"
              value={item.population.toLocaleString('vi-VN')}
            />
            <DetailRow label="Múi giờ" value={item.timezone} />
            <View style={styles.descriptionRow}>
              <Text style={styles.descriptionLabel}>Mô tả:</Text>
              <Text style={styles.descriptionValue}>{item.description}</Text>
            </View>
          </View>
        )}
      </Pressable>
    );
  }, [expandedId, toggleExpand]);

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Thông Tin Quốc Gia</Text>
        <Text style={styles.subtitle}>Bấm vào quốc gia để xem chi tiết</Text>
      </View>

      <FlatList
        data={countries}
        renderItem={renderCountry}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

CountriesList.displayName = 'CountriesList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#0f1535',
    borderBottomWidth: 1,
    borderBottomColor: '#1a2454',
  },
  title: {
    fontSize: FONT_SIZES.HEADING_LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_CYAN,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.CAPTION,
    color: COLORS.SECONDARY_CYAN,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  countryCard: {
    backgroundColor: '#1a2454',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2a3a7a',
    minHeight: 60,
  },
  countryCardExpanded: {
    borderColor: COLORS.PRIMARY_CYAN,
    backgroundColor: '#1f2d5a',
  },
  countryCardPressed: {
    opacity: 0.85,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  countryFlag: {
    fontSize: 28,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  expandIcon: {
    fontSize: 14,
    color: COLORS.PRIMARY_CYAN,
    fontWeight: 'bold',
  },
  countryDetails: {
    backgroundColor: '#151f45',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a3a7a',
  },
  detailRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  detailLabel: {
    color: COLORS.PRIMARY_CYAN,
    fontWeight: '600',
    fontSize: FONT_SIZES.CAPTION,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    color: '#e0e0e0',
    fontSize: FONT_SIZES.CAPTION,
    flex: 1,
    lineHeight: 18,
  },
  descriptionRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a3a7a',
  },
  descriptionLabel: {
    color: COLORS.PRIMARY_CYAN,
    fontWeight: '600',
    fontSize: FONT_SIZES.CAPTION,
    marginBottom: 4,
  },
  descriptionValue: {
    color: '#b8c5e0',
    fontSize: FONT_SIZES.BODY,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});

export default CountriesList;
