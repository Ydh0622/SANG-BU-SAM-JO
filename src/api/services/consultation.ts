import { apiStore, adminStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스
 *  인터셉터에서 에러 및 데이터를 처리하므로 비즈니스 로직만 작성합니다.
 */

export interface ConsultationCompleteRequest {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

/** 1. 상담 목록 전체 조회 (REQ-MGMT-001) */
export const fetchConsultations = (): Promise<ConsultationResponse[]> => 
    adminStore.get('/api/v1/consultations');

/** 2. 다음 상담 고객 선점 (REQ-QUE-001) */
export const claimNextCustomer = () => 
    apiStore.post('/api/v1/consultations/queue/claim-next');

/** 3. 상담 승인 및 시작 (REQ-PRE-004) */
export const acceptConsultation = (consultationId: string | number) => 
    apiStore.post(`/api/v1/consultations/${consultationId}/accept`);

/** 4. 개별 상담 상세 정보 조회 (REQ-MGMT-002) */
export const getConsultationDetail = (consultId: string): Promise<ConsultationResponse> => 
    adminStore.get(`/api/v1/consultations/${consultId}`);

/** 5. 메시지 전송 (실시간 채팅) */
export const sendConsultationMessage = (consultId: string, message: string) => 
    apiStore.post(`/api/v1/consultations/${consultId}/messages`, { message });

/** 6. 상담 종료 및 확정 (REQ-PRE-011) */
export const completeConsultation = (consultId: string, data: ConsultationCompleteRequest) => 
    apiStore.post(`/api/v1/consultations/${consultId}/end`, data);

/** 7. 상담 컨텍스트 재조회 (REQ-PRE-004) */
export const getConsultationContext = (consultId: string | number) => 
    apiStore.get(`/api/v1/consultations/${consultId}/context`);