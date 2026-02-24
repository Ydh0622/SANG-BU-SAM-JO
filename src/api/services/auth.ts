import { apiStore } from '../client';

/**
 * [상부상조] 인증 관련 API 서비스
 *  서버 응답 데이터 타입 정의 
 */
export interface LoginResponse {
  accessToken: string;
  user: {
    name: string;
    email: string;
  };
}

export const authApi = {
  /**
   * [REQ-AUTH-001] 구글 로그인
   * [현재: Mock 데이터 모드]
   */
  loginWithGoogle: async (code: string): Promise<LoginResponse> => {
    //  [MOCK] 시연용 로직 (서버 연결 시 주석 해제)
    console.log("Mock: Google Login with Code ->", code, apiStore.defaults.baseURL);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: "mock-jwt-token-abcd-1234",
          user: {
            name: "고길동 상담사",
            email: "gogilldongn@uplus.co.kr"
          }
        });
      }, 800);
    });

    /*  [REAL] 백엔드 완성 시 주석 해제
    return await apiStore.post('/api/v1/auth/google', { code });
    */
  },

  /** [REQ-AUTH-002] 토큰 재발급 (Refresh Token 활용) */
  refresh: () => apiStore.post('/api/v1/auth/refresh'),

  /** [REQ-AUTH-003] 로그아웃 */
  logout: () => apiStore.post('/api/v1/auth/logout'),

  /** 내 정보 조회 (토큰 검증용) */
  getMe: () => apiStore.get<LoginResponse['user']>('/api/v1/auth/me'),
};

export default authApi;