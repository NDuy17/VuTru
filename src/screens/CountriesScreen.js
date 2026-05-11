import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import CountriesList from '../components/CountriesList';
import { COLORS } from '../constants';

/**
 * CountriesScreen Component
 * Screen for displaying a list of countries with detailed information
 * @component
 * @returns {React.ReactNode} Countries list screen
 */
const CountriesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CountriesList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default CountriesScreen;
