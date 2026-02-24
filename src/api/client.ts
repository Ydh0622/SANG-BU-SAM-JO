import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * [상부상조] Axios 클라이언트 설정
 * 8081: 상담 및 AI 서비스 / 8082: 관리자 서비스 / 8000: FastAPI 검색
 */

const config: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000, // AI 응답(GPT)은 시간이 걸릴 수 있어 10초로 늘리는 것을 추천해요.
};

// 인스턴스 생성 (포트는 명세서/백엔드 상황에 맞게 조절하세요!)
export const apiStore = axios.create({ baseURL: 'http://localhost:8081', ...config });
export const adminStore = axios.create({ baseURL: 'http://localhost:8082', ...config });
export const fastApiStore = axios.create({ baseURL: 'http://localhost:8000', ...config }); // ✨ FastAPI 추가

const setInterceptors = (instance: AxiosInstance) => {
  // 1. 요청 인터셉터: Bearer 토큰 자동 부착
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 2. 응답 인터셉터: 데이터 추출 및 401 인증 에러 처리
  instance.interceptors.response.use(
    (res) => res.data, 
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        // 중복 팝업 방지를 위해 alert 없이 바로 이동하거나 
        // 팝업이 꼭 필요하면 한 번만 뜨게 조절하는 게 좋습니다.
        window.location.href = '/'; 
      }
      return Promise.reject(err);
    }
  );
};

// 모든 서버 인스턴스에 적용
setInterceptors(apiStore);
setInterceptors(adminStore);
setInterceptors(fastApiStore);

// 기본값으로 apiStore 내보내기
export default apiStore;