import { apiStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';
import type { AxiosResponse } from 'axios';

/**
 * [상부상조] 상담 관련 API 서비스
 */

// ⭐ 명세서 기반 전체 응답 타입 정의 (any 제거)
export interface ConsultationApiResponse {
    success: boolean;
    data: {
        todayDoneCount: number;
        list: ConsultationResponse[];
    };
    error: string | null;
}

interface ApiListResponse {
    data?: ConsultationResponse[];
    list?: ConsultationResponse[];
    content?: ConsultationResponse[];
}

export interface ConsultationCreateRequest {
    customer_name: string;
    contact_info: string;
    category: string;
    issue_detail: string;
    channel_type: 'CHAT' | 'PHONE' | 'WEB';
    priority?: 'LOW' | 'MID' | 'HIGH';
}

export interface ConsultationCompleteRequest {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

const getAuthHeader = () => {
    const token = localStorage.getItem("token"); 
    const userId = localStorage.getItem("userId"); 
    
    return {
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(userId ? { 'X-USER-ID': userId } : {})
        }
    };
};

// ---------------------------------------------------------
// 1. 기본 상담 관리
// ---------------------------------------------------------

/** [GET] 전체 상담 목록 조회 */
export const fetchConsultations = async (): Promise<ConsultationApiResponse> => {
    try {
        const response = await apiStore.get<ConsultationApiResponse>('/v1/consultations', getAuthHeader());
        
        // ⭐ Dashboard에서 res.data.todayDoneCount로 읽을 수 있도록 
        // AxiosResponse에서 data(본문)만 정확히 추출해 반환합니다.
        const result = (response as unknown as AxiosResponse<ConsultationApiResponse>).data || response;
        return result as ConsultationApiResponse;
        
    } catch (error) {
        console.error("상담 목록 로드 실패:", error);
        throw error;
    }
};

/** [POST] 신규 상담 생성 */
export const createConsultation = (data: ConsultationCreateRequest) => 
    apiStore.post<ConsultationResponse>('/v1/consultations', data, getAuthHeader());

/** [POST] 특정 상담 배정 */
export const assignConsultation = (consultationId: string | number) => 
    apiStore.post(`/v1/consultations/${consultationId}/assign`, {}, getAuthHeader());


// ---------------------------------------------------------
// 2. 대기열 및 큐 관리
// ---------------------------------------------------------

/** 대기 상담 수 조회 */
export const fetchWaitingCount = async (): Promise<{ count: number }> => {
    const response = await apiStore.get<{ count: number }>('/v1/consultations/waiting/count', getAuthHeader());
    const result = (response as unknown as AxiosResponse<{ count: number }>).data || response;
    return result as { count: number };
};

/** 대기 상담 목록 조회 */
export const fetchWaitingConsultations = async (): Promise<ConsultationResponse[]> => {
    try {
        const response = await apiStore.get<ConsultationResponse[] | ApiListResponse>('/v1/consultations/waiting', getAuthHeader());
        const actualData = (response as unknown as AxiosResponse<ConsultationResponse[] | ApiListResponse>).data || response;

        if (Array.isArray(actualData)) return actualData;
        
        const res = actualData as ApiListResponse;
        return res.data || res.list || res.content || [];
        
    } catch (error) {
        console.error("대기 상담 목록 로드 실패:", error);
        return [];
    }
};

/** 다음 대기 고객 배정 요청 */
export const claimNextCustomer = () => 
    apiStore.post('/v1/consultations/queue/claim-next', {}, getAuthHeader());


// ---------------------------------------------------------
// 3. 상담 상세 진행 및 종료
// ---------------------------------------------------------

export const getConsultationDetail = (consultationId: string | number) => 
    apiStore.get<ConsultationResponse>(`/v1/consultations/${consultationId}`, getAuthHeader());

export const acceptConsultation = (consultationId: string | number) => 
    apiStore.post(`/v1/consultations/${consultationId}/accept`, {}, getAuthHeader());

export const sendConsultationMessage = (consultationId: string | number, message: string) => 
    apiStore.post(`/v1/consultations/${consultationId}/messages`, { content: message }, getAuthHeader());

export const completeConsultation = (consultationId: string | number, data: ConsultationCompleteRequest) => 
    apiStore.post(`/v1/consultations/${consultationId}/complete`, data, getAuthHeader());