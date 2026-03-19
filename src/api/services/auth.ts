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

export interface MeResponse {
  userId: number;
  email: string;
  role: string;
}

// 로컬 환경인지 확인 (Vite에서 제공하는 환경 변수)
const isLocal = import.meta.env.DEV;

export const authApi = {
  /** [REQ-AUTH-001] 구글 로그인 */
  loginWithGoogle: async (idToken: string): Promise<LoginResponse> => {
    // 1. 로컬 환경일 때: 실제 백엔드 서버와 통신
    if (isLocal) {
      return await apiStore.post<LoginResponse, LoginResponse>('/v1/auth/google', { idToken });
    }

    // 2. Vercel 배포 환경일 때: 멘토링용 가짜 데이터 반환
    console.warn("시연용 모드: 백엔드 없이 로그인을 승인합니다.");
    
    // 가짜 딜레이를 주어 실제 통신하는 느낌을 줍니다 (선택 사항)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockResponse: LoginResponse = {
      accessToken: 'mentoring-sample-token-12345',
      user: {
        name: '고길동(시연용)',
        email: 'test@example.com'
      }
    };

    // 로컬 스토리지에 가짜 토큰 저장 (로그인 유지 효과)
    localStorage.setItem('token', mockResponse.accessToken);
    localStorage.setItem('userName', mockResponse.user.name);

    return mockResponse;
  },

  /** [REQ-AUTH-002] 토큰 재발급 */
  refresh: () => apiStore.post<LoginResponse, LoginResponse>('/v1/auth/refresh'),

  /** [REQ-AUTH-003] 로그아웃 */
  logout: () => {
    if (!isLocal) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      window.location.href = '/';
      return Promise.resolve();
    }
    return apiStore.post('/v1/auth/logout');
  },

  /** [REQ-AUTH-004] 내 정보 조회 (토큰 검증용) */
  getMe: async () => {
    if (isLocal) {
      return await apiStore.get<MeResponse>('/v1/users/me');
    }
    // 시연용 가짜 정보 반환
    return { name: '상담사(시연용)', email: 'test@example.com' };
  },
};

export default authApi;