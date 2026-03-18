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
export const fastApiStore = axios.create({ baseURL: '/fastapi', ...config });

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

      if (import.meta.env.DEV) {
        // 실제 백엔드로 나가는 요청 로깅
        console.log(
          '[API REQUEST]',
          instance.defaults.baseURL,
          config.url,
          config.method,
          config.params ?? '',
          config.data ?? ''
        );
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

      //  401 에러 발생 시 재발급 로직
      // originalRequest._retry가 없을 때만 재발급을 시도하여 무한 루프 방지
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

       try {
          console.warn("인증 만료 감지: 토큰 재발급(Refresh) 시도 중...");
          
          // 1. 로컬 스토리지에서 Refresh Token 가져오기
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            throw new Error("Refresh token이 없습니다. 다시 로그인해야 합니다.");
          }

          // 2. [핵심 수정] 백엔드가 요구하는 Body({ refreshToken: "..." }) 형식으로 전송
          const res = await axios.post('/api/v1/auth/refresh', {
            refreshToken: refreshToken // 바디에 리프레시 토큰 추가!
          }, { withCredentials: true });
          
          const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;
          const newRefreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;

          if (newAccessToken) {
            console.log("토큰 재발급 성공! 요청을 재시도합니다.");
            
            // 3. 새로 발급받은 토큰들로 로컬 스토리지 갱신
            localStorage.setItem('token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            
            // 4. 원래 시도했던 요청 다시 보내기
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
      return Promise.reject(error);
    }
  );
};

// 모든 인스턴스에 인터셉터 적용
setInterceptors(apiStore);
setInterceptors(adminStore);
setInterceptors(fastApiStore);

export default apiStore;