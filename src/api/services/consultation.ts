import { apiStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스
 * Mock 데이터를 제거하고 실제 백엔드 API(8081) 연동에 집중한 코드입니다.
 */

/** 백엔드 응답 객체 구조 정의 */
interface ApiListResponse {
    data?: ConsultationResponse[];
    list?: ConsultationResponse[];
    content?: ConsultationResponse[];
}

/** 상담 생성 요청 데이터 구조 */
export interface ConsultationCreateRequest {
    customer_name: string;
    contact_info: string;
    category: string;
    issue_detail: string;
    channel_type: 'CHAT' | 'PHONE' | 'WEB';
    priority?: 'LOW' | 'MID' | 'HIGH';
}

/** 상담 완료 요청 데이터 구조 */
export interface ConsultationCompleteRequest {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

// ---------------------------------------------------------
// 1. 기본 상담 관리 (Swagger 이미지 명세 기능)
// ---------------------------------------------------------

/** [GET] 전체 상담 목록 조회 */
export const fetchConsultations = async (): Promise<ConsultationResponse[]> => {
    try {
        const response = await apiStore.get<ConsultationResponse[] | ApiListResponse>('/v1/consultations');
        
        // 배열인 경우 그대로 반환
        if (Array.isArray(response)) return response;
        
        // 객체 내부에 데이터가 포함된 경우 (data, list, content 등)
        if (response && typeof response === 'object') {
            const res = response as ApiListResponse;
            const apiData = res.data || res.list || res.content;
            if (Array.isArray(apiData)) return apiData;
            
            // 단일 객체 응답인 경우 배열로 감싸서 반환
            if ('consultation_id' in response) {
                return [response as unknown as ConsultationResponse];
            }
        }
        return []; 
    } catch (error) {
        console.error("상담 목록 로드 실패:", error);
        throw error; // 에러 처리를 호출부로 위임
    }
};

/** [POST] 신규 상담 생성 */
export const createConsultation = (data: ConsultationCreateRequest) => 
    apiStore.post<ConsultationResponse>('/v1/consultations', data);

/** [POST] 특정 상담 배정 */
export const assignConsultation = (consultId: string | number) => 
    apiStore.post(`/v1/consultations/${consultId}/assign`);


// ---------------------------------------------------------
// 2. 대기열 및 큐 관리
// ---------------------------------------------------------

/** 대기 상담 수 조회 */
export const fetchWaitingCount = async (): Promise<{ count: number }> => {
    const response = await apiStore.get('/v1/consultations/waiting/count') as unknown as { count: number };
    return response;
};

/** 대기 상담 목록 조회 */
export const fetchWaitingConsultations = async (): Promise<ConsultationResponse[]> => {
    try {
        const response = await apiStore.get<ConsultationResponse[] | ApiListResponse>('/v1/consultations/waiting');
        if (Array.isArray(response)) return response;
        if (response && typeof response === 'object') {
            const res = response as ApiListResponse;
            const apiData = res.data || res.list || res.content;
            if (Array.isArray(apiData)) return apiData;
        }
        return [];
    } catch (error) {
        console.error("대기 상담 목록 로드 실패:", error);
        return [];
    }
};

/** 다음 대기 고객 배정 요청 */
export const claimNextCustomer = () => 
    apiStore.post('/v1/consultations/queue/claim-next');


// ---------------------------------------------------------
// 3. 상담 상세 진행 및 종료
// ---------------------------------------------------------

/** 상담 상세 정보 조회 */
export const getConsultationDetail = (consultId: string) => 
    apiStore.get<ConsultationResponse>(`/v1/consultations/${consultId}`);

/** 상담 수락 */
export const acceptConsultation = (consultId: string | number) => 
    apiStore.post(`/v1/consultations/${consultId}/accept`);

/** 상담 메시지 전송 */
export const sendConsultationMessage = (consultId: string, message: string) => 
    apiStore.post(`/v1/consultations/${consultId}/messages`, { message });

/** 상담 종료 및 기록 저장 */
export const completeConsultation = (consultId: string, data: ConsultationCompleteRequest) => 
    apiStore.post(`/v1/consultations/${consultId}/end`, data);