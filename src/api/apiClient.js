import axios from 'axios';
import {
  handleRateLimitError,
  handleUnauthorizedError,
  handleServerError,
  handleNetworkError,
} from '../utils/api-error-handlers';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 429) {
        handleRateLimitError(error);
      } else if (status === 401) {
        handleUnauthorizedError();
      } else {
        handleServerError(error);
      }
    } else {
      handleNetworkError(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
