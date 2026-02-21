import { apiStore } from '../client';

//  서버 응답 데이터 타입 정의 
export interface LoginResponse {
  accessToken: string;
  user: {
    name: string;
    email: string;
  };
}

export const authApi = {
  /**
   * 구글 인가 코드를 서버로 전송하여 서비스 토큰을 획득합니다.
   * [현재: Mock 데이터 모드]
   */
  loginWithGoogle: async (code: string): Promise<LoginResponse> => {
    console.log("서버로 전달될 인가 코드:", code);

    //  [MOCK] 서버 개발 중 임시 응답 로직
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: "mock-jwt-token-abcd-1234",
          user: {
            name: "고길동 상담사",
            email: "deokhyeon@example.com"
          }
        });
      }, 1000);
    });

    /* 🚀[REAL] 백엔드 완성 시 아래 주석을 해제하고 위 Mock 로직을 지우세요.
    // response.data가 아닌 response인 이유는 client.ts의 인터셉터가 res.data를 반환하기 때문입니다.
    return await apiStore.post('/api/v1/auth/google', { code });
    */
  },
  
  // 로그아웃 (명세서 1번)
  logout: () => apiStore.post('/auth/logout'),
  
  // 내 정보 조회 (인터셉터로 부착된 토큰 활용)
  getMe: () => apiStore.get<LoginResponse['user']>('/auth/me'),
};