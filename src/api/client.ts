import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * [상부상조] Axios 클라이언트 설정
 * 8081: 상담 및 AI 서비스 / 8082: 관리자 서비스
 */

const config: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // 구글 로그인 세션 및 쿠키 공유를 위해 유지
  timeout: 5000,
};

// 인스턴스 생성
export const apiStore = axios.create({ baseURL: 'http://localhost:8081', ...config });
export const adminStore = axios.create({ baseURL: 'http://localhost:8082', ...config });

const setInterceptors = (instance: AxiosInstance) => {
  // 1. 요청 인터셉터: 모든 API 호출 시 Bearer 토큰 자동 부착 (명세서 1번)
  instance.interceptors.request.use((config) => {
    // 💡 LoginPage에서 저장한 키 이름 'token'으로 통일합니다.
    const token = localStorage.getItem('token'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 2. 응답 인터셉터: 데이터 추출 및 인증 에러 처리 (명세서 1번)
  instance.interceptors.response.use(
    (res) => res.data, // 서비스 코드에서 .data를 생략할 수 있게 해줍니다.
    (err) => {
      // 401 에러(토큰 만료 등) 발생 시 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        localStorage.removeItem('token'); // 만료된 토큰 삭제
        window.location.href = '/'; // 상부상조 로그인 페이지로 이동
      }
      return Promise.reject(err);
    }
  );
};

// 두 서버 모두에 적용
setInterceptors(apiStore);
setInterceptors(adminStore);

// 기본적으로 apiStore를 내보냅니다.
export default apiStore;