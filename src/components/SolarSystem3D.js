import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlanet } from '../redux/slices/planetsSlice';
import SolarSystem from './SolarSystem';
import PlanetDetails from './planets/PlanetDetails';
import MoonDetails from './planets/MoonDetails';

const SolarSystemMobile = () => {
  const planets = useSelector((state) => state.planets.planets);
  const selectedPlanet = useSelector((state) =>
    state.planets.planets.find((p) => !!p.selected)
  );
  const [selectedMoon, setSelectedMoon] = useState(null);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [earthMapMode, setEarthMapMode] = useState(null);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(selectPlanet(null));
    setSelectedMoon(null);
    setIsExploreMode(false);
    setEarthMapMode(null);
  };

  const handleMoonPress = (moon, planet) => {
    setSelectedMoon({ moon, planet });
  };

  return (
    <View style={styles.container}>
      <SolarSystem
        planets={planets}
        explorationMode={isExploreMode}
        earthMapMode={earthMapMode}
        onPlanetPress={(id) => {
          dispatch(selectPlanet(id));
          setSelectedMoon(null);
          setIsExploreMode(false);
          setEarthMapMode(null);
        }}
        onMoonPress={handleMoonPress}
      />

      {selectedMoon ? (
        <MoonDetails moon={selectedMoon.moon} planet={selectedMoon.planet} onClose={() => setSelectedMoon(null)} />
      ) : (
        selectedPlanet && (
          <PlanetDetails
            planet={selectedPlanet}
            onClose={handleClose}
            isExploreMode={selectedPlanet.id === 3 ? !!earthMapMode : isExploreMode}
            earthMapMode={selectedPlanet.id === 3 ? earthMapMode : null}
            onEarthMapModeChange={(mode) => {
              setEarthMapMode(mode);
              setIsExploreMode(!!mode);
            }}
            onToggleExplore={() => setIsExploreMode((prev) => !prev)}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
});

export default SolarSystemMobile;
