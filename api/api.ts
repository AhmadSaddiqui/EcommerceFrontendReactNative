import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set the base URL for the backend API
const api = axios.create({
  baseURL: 'http://10.0.2.2:3000', // Change this to your server address
});

// Attach token from AsyncStorage to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
