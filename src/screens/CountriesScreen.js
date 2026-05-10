import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CountriesList from '../components/CountriesList';

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
    backgroundColor: '#0a0e27',
  },
});

export default CountriesScreen;
