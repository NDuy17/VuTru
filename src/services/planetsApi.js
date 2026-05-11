import { API_URLS } from '../constants';

/**
 * Resolve the backend base URL for planet API calls.
 * @returns {string} Backend API base URL
 */
const getBaseUrl = () => {
  return API_URLS.BASE_URL;
};

/**
 * Fetch planets from the backend API.
 * @async
 * @returns {Promise<Array>} Planet objects from the backend response
 * @throws {Error} Throws when the backend response is not successful
 */
export const getPlanetsFromApi = async () => {
  const response = await fetch(`${getBaseUrl()}/api/planets`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.planets || [];
};
