import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/**
 * [상부상조] 각 모듈별 베이스 URL 설정
 * 로컬 환경(.env) 및 Vercel 환경 변수에 등록된 주소를 읽어옵니다.
 * 등록되지 않았을 경우, 기본적으로 상대 경로(/api 등)를 사용합니다.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';    // Swagger 8081 대응
const ADMIN_BASE = import.meta.env.VITE_ADMIN_BASE_URL || ''; // Swagger 8082 대응
const FAST_BASE = import.meta.env.VITE_FAST_BASE_URL || '';   // Swagger 8083 대응

const config: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000, 
};

/**
 * 각 도메인별 스토어 생성
 * 이제 각 스토어는 독립적인 백엔드 서버 주소를 바라보게 됩니다.
 */
// 1. 일반 API 서버 (로그인, 게시판 등)
export const apiStore = axios.create({ 
  baseURL: API_BASE ? `${API_BASE}/api` : '/api', 
  ...config 
});

// 2. 관리자 서버
export const adminStore = axios.create({ 
  baseURL: ADMIN_BASE ? `${ADMIN_BASE}/admin` : '/admin', 
  ...config 
});

// 3. Worker/FastAPI 서버
export const fastApiStore = axios.create({ 
  baseURL: FAST_BASE ? `${FAST_BASE}/fast` : '/fast', 
  ...config 
});

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
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. 응답 인터셉터: 데이터 추출 및 공통 에러(401) 처리
  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      console.error(`[API Error] ${error.config?.url}:`, error.response || error.message);

      if (error.response?.status === 401) {
        console.warn("인증이 만료되었습니다. 로그인 페이지로 이동합니다.");
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