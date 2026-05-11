import React, { memo, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlanet } from '../redux/slices/planetsSlice';
import SolarSystem from './SolarSystem';
import PlanetDetails from './planets/PlanetDetails';
import MoonDetails from './planets/MoonDetails';

/**
 * SolarSystemMobile Component
 * Main 3D solar system interaction component
 * Manages planet selection, moon selection, and exploration modes
 * Displays the interactive solar system with planet/moon detail panels
 * @component
 * @returns {React.ReactNode} Solar system with interactive elements
 */
const SolarSystemMobile = memo(() => {
  const planets = useSelector((state) => state.planets.planets);
  const selectedPlanet = useMemo(() => planets.find((p) => !!p.selected), [planets]);
  const [selectedMoon, setSelectedMoon] = useState(null);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [earthMapMode, setEarthMapMode] = useState(null);
  const dispatch = useDispatch();

  /**
   * Close all detail panels and reset state
   * @function
   */
  const handleClose = useCallback(() => {
    dispatch(selectPlanet(null));
    setSelectedMoon(null);
    setIsExploreMode(false);
    setEarthMapMode(null);
  }, [dispatch]);

  /**
   * Handle moon press event
   * @function
   * @param {Object} moon - Moon object data
   * @param {Object} planet - Parent planet object data
   */
  const handleMoonPress = useCallback((moon, planet) => {
    setSelectedMoon({ moon, planet });
  }, []);

  /**
   * Handle planet press event
   * @function
   * @param {number} id - Planet ID
   */
  const handlePlanetPress = useCallback((id) => {
    dispatch(selectPlanet(id));
    setSelectedMoon(null);
    setIsExploreMode(false);
    setEarthMapMode(null);
  }, [dispatch]);

  /**
   * Handle Earth map mode change
   * @function
   * @param {string|null} mode - Map mode (continents/countries/null)
   */
  const handleEarthMapModeChange = useCallback((mode) => {
    setEarthMapMode(mode);
    setIsExploreMode(!!mode);
  }, []);

  /**
   * Toggle explore mode
   * @function
   */
  const handleToggleExplore = useCallback(() => {
    setIsExploreMode((prev) => !prev);
  }, []);

  /**
   * Close the moon detail panel.
   * @function
   */
  const handleCloseMoon = useCallback(() => {
    setSelectedMoon(null);
  }, []);

  return (
    <View style={styles.container}>
      <SolarSystem
        planets={planets}
        explorationMode={isExploreMode}
        earthMapMode={earthMapMode}
        onPlanetPress={handlePlanetPress}
        onMoonPress={handleMoonPress}
      />

      {selectedMoon ? (
        <MoonDetails 
          moon={selectedMoon.moon} 
          planet={selectedMoon.planet} 
          onClose={handleCloseMoon} 
        />
      ) : (
        selectedPlanet && (
          <PlanetDetails
            planet={selectedPlanet}
            onClose={handleClose}
            isExploreMode={selectedPlanet.id === 3 ? !!earthMapMode : isExploreMode}
            earthMapMode={selectedPlanet.id === 3 ? earthMapMode : null}
            onEarthMapModeChange={handleEarthMapModeChange}
            onToggleExplore={handleToggleExplore}
          />
        )
      )}
    </View>
  );
});

SolarSystemMobile.displayName = 'SolarSystemMobile';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
});

export default SolarSystemMobile;
