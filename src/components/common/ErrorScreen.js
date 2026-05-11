import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PropTypes from 'prop-types';

/**
 * ErrorScreen Component
 * Displays an error message with a retry button on a cosmic dark background.
 * Used when fetching planet data from the API fails.
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {Function} props.onRetry - Callback to execute when retry button is pressed
 * @returns {React.ReactNode} Error screen UI
 */
const ErrorScreen = React.memo(({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorText}>{message || 'Có lỗi xảy ra khi tải dữ liệu'}</Text>
      <Pressable 
        style={styles.retryButton} 
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Thử lại"
        accessibilityHint="Nhấn để thử tải lại dữ liệu hành tinh"
      >
        <Text style={styles.retryButtonText}>Thử lại</Text>
      </Pressable>
    </View>
  );
});

ErrorScreen.displayName = 'ErrorScreen';
ErrorScreen.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27', // Cosmic dark background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#0a0e27',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorScreen;
