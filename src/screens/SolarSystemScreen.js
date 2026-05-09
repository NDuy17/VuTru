import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import SolarSystem3D from '../components/SolarSystem3D';
import { fetchPlanets } from '../redux/slices/planetsSlice';

const SolarSystemScreen = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.planets.status);
  const error = useSelector((state) => state.planets.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPlanets());
    }
  }, [dispatch, status]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>Hệ Mặt Trời</Text>
      {status === 'loading' ? (
        <Text style={styles.subtitleText}>Đang tải dữ liệu từ MongoDB...</Text>
      ) : null}
      {status === 'failed' ? (
        <Text style={styles.warningText}>
          Không kết nối được API MongoDB, đang dùng dữ liệu local. ({error})
        </Text>
      ) : null}
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
  subtitleText: {
    color: '#9fd6ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    color: '#ffc266',
    textAlign: 'center',
    marginBottom: 8,
    marginHorizontal: 12,
    fontSize: 12,
  },
});

export default SolarSystemScreen;
