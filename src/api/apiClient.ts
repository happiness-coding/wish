// src/api/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.get(url, config).then((response: AxiosResponse<T>) => response.data);
};

export const post = <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.post(url, data, config).then((response: AxiosResponse<T>) => response.data);
};

export const put = <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.put(url, data, config).then((response: AxiosResponse<T>) => response.data);
};

export const patch = <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.patch(url, data, config).then((response: AxiosResponse<T>) => response.data);
};

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.delete(url, config).then((response: AxiosResponse<T>) => response.data);
};

export default apiClient;