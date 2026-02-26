import { apiStore } from '../client';

/**
 * [상부상조] 인증 관련 API 서비스
 */
export interface LoginResponse {
  accessToken: string;
  user: {
    name: string;
    email: string;
  };
}

export const authApi = {
  /** [REQ-AUTH-001] 구글 로그인 */
  loginWithGoogle: async (idToken: string): Promise<LoginResponse> => {
    return await apiStore.post<LoginResponse, LoginResponse>('/v1/auth/google', { idToken });
  },

  /** [REQ-AUTH-002] 토큰 재발급 */
  refresh: () => apiStore.post<LoginResponse, LoginResponse>('/v1/auth/refresh'),

  /** [REQ-AUTH-003] 로그아웃 */
  logout: () => apiStore.post('/v1/auth/logout'),

  /** [REQ-AUTH-004] 내 정보 조회 (토큰 검증용) 
   * 팀원이 확인해달라고 한 엔드포인트입니다.
   */
  getMe: () => apiStore.get<LoginResponse['user']>('/v1/users/me'),
};

export default authApi;