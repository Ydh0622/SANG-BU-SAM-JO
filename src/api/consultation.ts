import { apiStore } from './client';

export const consultationApi = {
  // 상담 시작 화면용 데이터 조회
  getStartInfo: (customerId: string) => apiStore.get(`/consultations/start-info/${customerId}`),
  
  // 메시지 저장 (상담 진행)
  sendMessage: (consultId: string, message: string) => 
    apiStore.post(`/consultations/${consultId}/messages`, { message }),
    
  // 상담 종료/확정
  completeConsultation: (consultId: string) => 
    apiStore.post(`/consultations/${consultId}/complete`),
};