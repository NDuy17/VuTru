import React, { memo, useEffect, useCallback } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import SolarSystem3D from '../components/SolarSystem3D';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorScreen from '../components/common/ErrorScreen';
import { fetchPlanets } from '../redux/slices/planetsSlice';
import { COLORS, FONT_SIZES, MESSAGES, FETCH_STATUS } from '../constants';

/**
 * SolarSystemScreen Component
 * Main screen displaying the 3D solar system with loading and error states
 * Fetches planet data from Redux store and displays with appropriate UI feedback
 * @component
 * @returns {React.ReactNode} Solar system screen with loading/error handling
 */
const SolarSystemScreen = memo(() => {
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

  if (status === FETCH_STATUS.LOADING) {
    return <LoadingScreen color={COLORS.PRIMARY_CYAN} />;
  }

  if (status === FETCH_STATUS.FAILED) {
    return <ErrorScreen message={error} onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>{MESSAGES.SOLAR_SYSTEM_TITLE}</Text>
      <SolarSystem3D />
    </SafeAreaView>
  );
});

SolarSystemScreen.displayName = 'SolarSystemScreen';

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
});

export default SolarSystemScreen;
