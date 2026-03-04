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

/**
 * 인터셉터 설정 함수
 */
const setInterceptors = (instance: AxiosInstance) => {
  // 1. 요청 인터셉터: 모든 요청에 Bearer 토큰 자동 부착
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token'); 
      
      if (config.url?.includes('/auth/google')) {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} (인증 전 요청)`);
        return config;
      }
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`[Auth Header] ${config.headers.Authorization.substring(0, 20)}...`);
      } else {
        console.warn(`[API Request] ${config.url} - 토큰이 LocalStorage에 없습니다!`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. 응답 인터셉터: 데이터 추출 및 공통 에러(401) 처리
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 💡 [수정] 서버의 공통 응답 구조({ success, data, error })를 고려하여 
      // 실제 유저 정보가 들어있는 response.data.data를 우선적으로 반환하도록 시도합니다.
      // 만약 .data.data가 없다면(단순 구조라면) response.data를 반환합니다.
      return response.data?.data !== undefined ? response.data.data : response.data;
    },
    async (error) => {
      const originalRequest = error.config;

      console.error(`[API Error] ${error.config?.url}:`, error.response?.status, error.response?.data || error.message);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.warn("인증 만료 감지: 토큰 재발급(Refresh) 시도 중...");
          
          const res = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
          // 재발급 시에도 데이터 계층 구조 확인
          const newToken = res.data?.data?.accessToken || res.data?.accessToken;

          if (newToken) {
            console.log("토큰 재발급 성공! 요청을 재시도합니다.");
            localStorage.setItem('token', newToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return instance(originalRequest);
          }
        } catch (refreshError) {
          console.error("토큰 재발급 실패: 세션이 완전히 만료되었습니다.");
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          
          if (window.location.pathname !== '/') {
            window.location.href = '/'; 
          }
          return Promise.reject(refreshError);
        }
      }

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        if (window.location.pathname !== '/') {
          window.location.href = '/'; 
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