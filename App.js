import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/redux/store';
import SolarSystemScreen from './src/screens/SolarSystemScreen';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <SolarSystemScreen />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
});
