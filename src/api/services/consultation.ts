import { apiStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스 (8081 api-module 통합)
 */

/** 백엔드 응답 객체 구조 정의 (any 대체) */
interface ApiListResponse {
    data?: ConsultationResponse[];
    list?: ConsultationResponse[];
    content?: ConsultationResponse[];
}

export interface ConsultationCompleteRequest {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

const isLocal = import.meta.env.DEV;

/** 1. 전체 상담 목록 조회 (api-module: 8081) */
export const fetchConsultations = async (): Promise<ConsultationResponse[]> => {
    if (isLocal) {
        try {
            const response = await apiStore.get<ConsultationResponse[] | ApiListResponse>('/v1/consultations');
            
            if (Array.isArray(response)) return response;
            
            if (response && typeof response === 'object') {
                const res = response as ApiListResponse;
                const apiData = res.data || res.list || res.content;
                if (Array.isArray(apiData)) return apiData;
                
                if ('consultation_id' in response) {
                    return [response as unknown as ConsultationResponse];
                }
            }
            return []; 
        } catch (error) {
            console.error("상담 목록 로드 실패:", error);
            return []; 
        }
    }

    const mockData: ConsultationResponse[] = [{
        consultation_id: 101,
        customer_name: "김유플",
        contact_info: "010-1234-5678", // 필수 속성
        status: "DONE", 
        priority: "HIGH", 
        category: "요금제 문의",
        issue_detail: "5G 다이렉트",
        content_preview: "5G 다이렉트 요금제 변경하고 싶어요.",
        channel_type: "CHAT",
        created_at: new Date().toISOString(), // createdAt -> created_at
    }];
    return mockData;
};

/** 8. 대기 상담 수 조회 (api-module: 8081) */
export const fetchWaitingCount = async (): Promise<{ count: number }> => {
    if (isLocal) {
        // AxiosResponse와의 타입 충돌을 피하기 위해 unknown 단언 사용
        const response = await apiStore.get('/v1/consultations/waiting/count') as unknown as { count: number };
        return response;
    }
    return { count: 0 };
};

/** 9. 대기 상담 목록 조회 (api-module: 8081) */
export const fetchWaitingConsultations = async (): Promise<ConsultationResponse[]> => {
    if (isLocal) {
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
    }

    const mockWaitingData: ConsultationResponse[] = [
        {
            consultation_id: 201,
            customer_name: "이유플",
            contact_info: "010-9876-5432", // 필수 속성
            status: "IN_PROGRESS", // WAITING 대신 허용된 Enum 값
            priority: "MID", // NORMAL 대신 허용된 Enum 값
            category: "기기변경",
            issue_detail: "아이폰 16 Pro",
            content_preview: "기기변경 혜택이 궁금해요.",
            channel_type: "CHAT",
            created_at: new Date().toISOString(), // createdAt -> created_at
        }
    ];
    return mockWaitingData;
};

/** 나머지 기능들 모두 apiStore로 통일 */
export const claimNextCustomer = () => apiStore.post('/v1/consultations/queue/claim-next');
export const acceptConsultation = (consultId: string | number) => apiStore.post(`/v1/consultations/${consultId}/accept`);
export const getConsultationDetail = (consultId: string) => apiStore.get<ConsultationResponse>(`/v1/consultations/${consultId}`);
export const sendConsultationMessage = (consultId: string, message: string) => apiStore.post(`/v1/consultations/${consultId}/messages`, { message });
export const completeConsultation = (consultId: string, data: ConsultationCompleteRequest) => apiStore.post(`/v1/consultations/${consultId}/end`, data);