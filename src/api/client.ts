import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * [상부상조] 공통 Axios 설정
 */
const config: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000, 
};

// 각 도메인별 스토어 생성
export const apiStore = axios.create({ baseURL: '/api', ...config });
export const adminStore = axios.create({ baseURL: '/admin', ...config });
export const fastApiStore = axios.create({ baseURL: '/fast', ...config });

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * 인터셉터 설정 함수
 */
const setInterceptors = (instance: AxiosInstance) => {
  // 1. 요청 인터셉터: 모든 요청에 Bearer 토큰 자동 부착
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');

      if (config.url?.includes('/auth/google')) {
        return config;
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. 응답 인터셉터: 데이터 추출 및 공통 에러(401) 처리
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data?.data !== undefined ? response.data.data : response.data;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        }

        isRefreshing = true;

        try {
          console.warn("인증 만료 감지: 토큰 재발급(Refresh) 시도 중...");
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error("Refresh token이 없습니다.");

          const res = await axios.post('/api/v1/auth/refresh', { refreshToken }, { withCredentials: true });
          const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;
          const newRefreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;

          if (newAccessToken) {
            console.log("토큰 재발급 성공! 요청을 재시도합니다.");
            localStorage.setItem('token', newAccessToken);
            if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

            refreshSubscribers.forEach(cb => cb(newAccessToken));
            refreshSubscribers = [];

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("토큰 재발급 실패: 세션이 완전히 만료되었습니다.");
          refreshSubscribers = [];
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          if (window.location.pathname !== '/') window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};

// 모든 인스턴스에 인터셉터 적용
setInterceptors(apiStore);
setInterceptors(adminStore);
setInterceptors(fastApiStore);

export default apiStore;