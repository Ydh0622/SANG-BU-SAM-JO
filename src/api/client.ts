import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

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
 * 모든 스토어에 공통적으로 토큰 삽입 및 에러 처리를 적용합니다.
 */
const setInterceptors = (instance: AxiosInstance) => {
  // 1. 요청 인터셉터: 모든 요청에 Bearer 토큰 자동 부착
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token'); 
      
      if (token && config.headers) {
        // 백엔드에서 기대하는 Bearer 형식으로 토큰 주입
        config.headers.Authorization = `Bearer ${token}`;
        
        // [디버깅 로그] 어떤 토큰이 실려나가는지 콘솔에서 확인 가능합니다.
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
    (response) => {
      // response.data를 반환하여 호출부에서 .data 없이 바로 접근하게 합니다.
      return response.data;
    },
    (error) => {
      // 에러 상세 로그
      console.error(`[API Error] ${error.config?.url}:`, error.response?.status, error.response?.data || error.message);

      if (error.response?.status === 401) {
        console.warn("인증이 만료되었거나 토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.");
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        
        // 현재 페이지가 로그인이 아닐 때만 리다이렉트
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