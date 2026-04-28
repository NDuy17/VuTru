import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SolarSystem3D from '../components/SolarSystem3D';

const SolarSystemScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Hệ Mặt Trời</Text>
      <SolarSystem3D />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default SolarSystemScreen;
