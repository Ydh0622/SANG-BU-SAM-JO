import { apiStore } from './client';

export const authApi = {
  // 구글 로그인 URL 가져오기
  getGoogleLoginUrl: () => apiStore.get('/auth/google'),
  
  // 로그아웃
  logout: () => apiStore.post('/auth/logout'),
  
  // 현재 로그인한 사용자 정보 가져오기
  getMe: () => apiStore.get('/auth/me'),
};