import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

/**
 * LoadingScreen Component
 * Displays a full-screen loading spinner with a cosmic dark background.
 * Used when fetching planet data from the API.
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.color='#00d4ff'] - Color of the loading spinner
 * @returns {React.ReactNode} Loading screen UI
 */
const LoadingScreen = React.memo(({ color = '#00d4ff' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
});

LoadingScreen.displayName = 'LoadingScreen';
LoadingScreen.propTypes = {
  color: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27', // Cosmic dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
