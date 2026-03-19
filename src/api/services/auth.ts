import { apiStore } from '../client';

/**
 * [상부상조] 인증 관련 API 서비스 타입 정의
 */
export interface LoginResponse {
  token: string;         // 백엔드 응답 필드명 'token' 반영
  refreshToken: string;  // 재발급을 위해 필수 저장
  user: {
    name: string;
    email: string;
  };
}

export interface MeResponse {
  userId: number;
  email: string;
  name: string;
  role: string;
}

export const authApi = {
  /** [REQ-AUTH-001] 구글 로그인 */
  loginWithGoogle: async (idToken: string): Promise<LoginResponse> => {
   
    // 인터셉터에서 response.data.data를 반환하므로 LoginResponse로 타입을 확정합니다.
    const data = (await apiStore.post<LoginResponse>('/v1/auth/google', {
      idToken,
    })) as unknown as LoginResponse;

    
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.user?.name) {
      localStorage.setItem('userName', data.user.name);
    }

    return data;
  },

  /** [REQ-AUTH-002] 토큰 재발급 */
  refresh: () => apiStore.post<LoginResponse>('/v1/auth/refresh'),

  /** [REQ-AUTH-003] 로그아웃 */
  logout: async (): Promise<void> => {
    try {
      await apiStore.post('/v1/auth/logout');
    } catch (error) {
      console.error('로그아웃 서버 통신 실패:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      window.location.href = '/';
    }
  },

  /** [REQ-AUTH-004] 내 정보 조회 */
  getMe: () => apiStore.get<MeResponse>('/v1/users/me'),
};

export default authApi;