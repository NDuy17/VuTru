import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, ActivityIndicator, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import SolarSystem3D from '../components/SolarSystem3D';
import { fetchPlanets } from '../redux/slices/planetsSlice';
import { COLORS, FONT_SIZES, MESSAGES, FETCH_STATUS } from '../constants';

/**
 * SolarSystemScreen Component
 * Main screen displaying the 3D solar system with loading and error states
 * Fetches planet data from Redux store and displays with appropriate UI feedback
 * @component
 * @returns {React.ReactNode} Solar system screen with loading/error handling
 */
const SolarSystemScreen = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.planets.status);
  const error = useSelector((state) => state.planets.error);

  useEffect(() => {
    if (status === FETCH_STATUS.IDLE) {
      dispatch(fetchPlanets());
    }
  }, [dispatch, status]);

  /**
   * Retry fetching planets
   * @function
   */
  const handleRetry = useCallback(() => {
    dispatch(fetchPlanets());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>{MESSAGES.SOLAR_SYSTEM_TITLE}</Text>
      {status === FETCH_STATUS.LOADING ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY_CYAN} />
          <Text style={styles.subtitleText}>{MESSAGES.LOADING_DATA}</Text>
        </View>
      ) : null}
      {status === FETCH_STATUS.FAILED ? (
        <View style={styles.errorContainer}>
          <Text style={styles.warningText}>
            {MESSAGES.API_ERROR}
          </Text>
          {error && <Text style={styles.errorDetails}>({error})</Text>}
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>{MESSAGES.RETRY}</Text>
          </Pressable>
        </View>
      ) : null}
      <SolarSystem3D />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  titleText: {
    fontSize: FONT_SIZES.HEADING,
    fontWeight: 'bold',
    color: COLORS.PRIMARY_CYAN,
    textAlign: 'center',
    marginVertical: 12,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  subtitleText: {
    color: COLORS.SECONDARY_CYAN,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 12,
    fontSize: FONT_SIZES.BODY,
  },
  warningText: {
    color: COLORS.WARNING_ORANGE,
    textAlign: 'center',
    marginBottom: 8,
    marginHorizontal: 12,
    fontSize: FONT_SIZES.CAPTION,
  },
  errorDetails: {
    color: COLORS.ERROR_RED,
    textAlign: 'center',
    marginBottom: 12,
    fontSize: FONT_SIZES.CAPTION,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY_CYAN,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.BODY,
  },
});

export default SolarSystemScreen;
