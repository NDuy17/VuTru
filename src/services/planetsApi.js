import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return 'http://192.168.0.124:5000';
};

export const getPlanetsFromApi = async () => {
  const response = await fetch(`${getBaseUrl()}/api/planets`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.planets || [];
};
