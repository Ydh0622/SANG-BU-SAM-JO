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
      // 서버 응답 구조에 따라 데이터 추출 (data.data 또는 data)
      return response.data?.data !== undefined ? response.data.data : response.data;
    },
    async (error) => {
      const originalRequest = error.config;

      // [핵심 수정] 401 에러 발생 시 재발급 로직
      // originalRequest._retry가 없을 때만 재발급을 시도하여 무한 루프 방지
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.warn("인증 만료 감지: 토큰 재발급(Refresh) 시도 중...");
          
          // [수정] instance를 사용하여 baseURL(/api)이 적용된 상태로 요청을 보냄
          // 이렇게 해야 프록시 설정(/api -> 8081)이 올바르게 적용됩니다.
          const res = await axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
          
          const newToken = res.data?.data?.accessToken || res.data?.accessToken;

          if (newToken) {
            console.log("토큰 재발급 성공! 요청을 재시도합니다.");
            localStorage.setItem('token', newToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            // 원래 시도했던 요청 다시 보내기
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // 재발급 API 자체가 실패한 경우 (진짜 세션 만료)
          console.error("토큰 재발급 실패: 세션이 완전히 만료되었습니다.");
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          
          if (window.location.pathname !== '/') {
            window.location.href = '/'; 
          }
          return Promise.reject(refreshError);
        }
      }

      // [수정] 재발급 시도 중이 아닐 때 발생하는 401 외의 에러는 그대로 reject
      // 여기서 window.location.href를 무분별하게 호출하면 튕김 현상이 발생함
      return Promise.reject(error);
    }
  );
};

// 모든 인스턴스에 인터셉터 적용
setInterceptors(apiStore);
setInterceptors(adminStore);
setInterceptors(fastApiStore);

export default apiStore;