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
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiStore = axios.create({ 
  baseURL: `${BASE_URL}/api`, 
  ...config 
});

export const adminStore = axios.create({ 
  baseURL: `${BASE_URL}/admin`, 
  ...config 
});

export const fastApiStore = axios.create({ 
  baseURL: `${BASE_URL}/fast`, 
  ...config 
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 로깅을 디버그 플래그와 무관하게 항상 켭니다.
const shouldLogApi = true;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return (
    value !== null &&
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
};

const redactPayload = (payload: unknown) => {
  if (!isPlainObject(payload)) return payload;

  // 토큰/idToken 등 민감값은 마스킹해서 출력
  const redacted = { ...payload } as Record<string, unknown>;
  ["idToken", "refreshToken", "token", "accessToken", "Authorization", "authorization"].forEach(
    (key) => {
      if (key in redacted) redacted[key] = "[redacted]";
    }
  );
  return redacted;
};

/**
 * 인터셉터 설정 함수
 */
const setInterceptors = (instance: AxiosInstance) => {
  type AxiosRequestConfigWithMeta = InternalAxiosRequestConfig & { __requestStartAt?: number };

  // 1. 요청 인터셉터: 모든 요청에 Bearer 토큰 자동 부착
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');

      const requestUrl = `${instance.defaults.baseURL ?? ""}${config.url ?? ""}`;
      const isGoogleAuth = Boolean(config.url?.includes("/auth/google"));

      (config as AxiosRequestConfigWithMeta).__requestStartAt = Date.now();

      if (!isGoogleAuth && token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (shouldLogApi) {
        console.log(
          "[API REQUEST]",
          requestUrl,
          "method=",
          config.method,
          "hasToken=",
          !isGoogleAuth && Boolean(token),
          "params=",
          config.params ?? "",
          "data=",
          redactPayload(config.data)
        );
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. 응답 인터셉터: 데이터 추출 및 공통 에러(401) 처리
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (shouldLogApi) {
        const startAt = (response.config as AxiosRequestConfigWithMeta).__requestStartAt;
        const durationMs = startAt ? Date.now() - startAt : undefined;
        const requestUrl = `${instance.defaults.baseURL ?? ""}${response.config.url ?? ""}`;
        console.log("[API RESPONSE]", requestUrl, "status=", response.status, durationMs ? `(${durationMs}ms)` : "");
      }
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

          if (shouldLogApi) {
            console.log(
              "[API REFRESH]",
              "/api/v1/auth/refresh",
              "body=",
              redactPayload({ refreshToken })
            );
          }

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
            if (shouldLogApi) {
              const requestUrl = `${instance.defaults.baseURL ?? ""}${originalRequest.url ?? ""}`;
              console.log("[API RETRY]", requestUrl);
            }
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