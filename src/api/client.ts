import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 5000,
};

export const apiStore = axios.create({ baseURL: 'http://localhost:8081', ...config });
export const adminStore = axios.create({ baseURL: 'http://localhost:8082', ...config });

const setInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res.data,
    (err) => {
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
};

setInterceptors(apiStore);
setInterceptors(adminStore);

export default apiStore;