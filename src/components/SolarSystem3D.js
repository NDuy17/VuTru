import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectPlanet } from '../redux/slices/planetsSlice';
import SolarSystem from './SolarSystem';
import SolarSystem3DThree from './SolarSystem3DThree';
import PlanetDetails from './planets/PlanetDetails';
import MoonDetails from './planets/MoonDetails';

const SolarSystemMobile = () => {
  const planets = useSelector((state) => state.planets.planets);
  const selectedPlanet = useSelector((state) =>
    state.planets.planets.find((p) => !!p.selected)
  );
  const [selectedMoon, setSelectedMoon] = useState(null);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(selectPlanet(null));
    setSelectedMoon(null);
  };

  const handleMoonPress = (moon, planet) => {
    setSelectedMoon({ moon, planet });
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <SolarSystem3DThree />
        {selectedPlanet && <PlanetDetails planet={selectedPlanet} onClose={handleClose} />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SolarSystem
        planets={planets}
        onPlanetPress={(id) => {
          dispatch(selectPlanet(id));
          setSelectedMoon(null);
        }}
        onMoonPress={handleMoonPress}
      />

      {selectedMoon ? (
        <MoonDetails moon={selectedMoon.moon} planet={selectedMoon.planet} onClose={() => setSelectedMoon(null)} />
      ) : (
        selectedPlanet && <PlanetDetails planet={selectedPlanet} onClose={handleClose} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
});

export default SolarSystemMobile;
