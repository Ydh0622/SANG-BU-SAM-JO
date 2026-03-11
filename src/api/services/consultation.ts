import { apiStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';
import type { AxiosResponse } from 'axios';

/**
 * [상부상조] 상담 관련 API 서비스
 */

export interface ConsultationApiResponse {
    success: boolean;
    data: {
        todayDoneCount: number;
        list: ConsultationResponse[];
    };
    error: string | null;
}

// interface ApiListResponse {
//     data?: ConsultationResponse[];
//     list?: ConsultationResponse[];
//     content?: ConsultationResponse[];
// }

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

export interface MatchOldestResponse {
    consultationId: number;
    customerName?: string | null;
    initialMessage?: string | null;
    meta?: {
        channelCode?: string | null;
        productLineCode?: string | null;
        priorityCode?: string | null;
        createdAt?: string | null;
        issueTypeId?: number | null;
    };
}

export interface AssignResponse {
    consultationId: number;
    status: string;       // IN_PROGRESS
    agentId: number;
    startedAt: string;
    version: number;
}

/** 상담 종료 요청 인터페이스 추가 */
export interface ConsultationEndRequest {
    finalResultCode: string;
}

/** 상담 종료 응답 인터페이스 추가 */
export interface ConsultationEndResponse {
    todayDoneCount: number;
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
export const fetchConsultations = async (): Promise<ConsultationResponse[]> => {
  try {
    return await apiStore.get('/v1/consultations', getAuthHeader());
  } catch (error) {
    console.error("상담 목록 로드 실패:", error);
    throw error;
  }
};

/** [POST] 신규 상담 생성 */
export const createConsultation = (data: ConsultationCreateRequest) => 
    apiStore.post<ConsultationResponse>('/v1/consultations', data, getAuthHeader());

export const matchOldestConsultation = async (): Promise<MatchOldestResponse> => {
    return await apiStore.post('/v1/consultations/match/oldest', {}, getAuthHeader());
};

export const assignConsultation = async (consultationId: string | number): Promise<AssignResponse> => {
    return await apiStore.post(`/v1/consultations/${consultationId}/assign`, {}, getAuthHeader());
};


// ---------------------------------------------------------
// 2. 대기열 및 큐 관리
// ---------------------------------------------------------

/** 대기 상담 수 조회 */
export const fetchWaitingCount = async (): Promise<{ count: number }> => {
  return await apiStore.get('/v1/consultations/waiting/count', getAuthHeader());
};

/** 대기 상담 목록 조회 */
export const fetchWaitingConsultations = async (): Promise<ConsultationResponse[]> => {
  try {
    return await apiStore.get('/v1/consultations/waiting', getAuthHeader());
  } catch (error) {
    console.error("대기 상담 목록 로드 실패:", error);
    return [];
  }
};

/** [DELETE] 대기 상담 제거  */
export const deleteWaitingConsultation = (consultationId: string | number) => 
    apiStore.delete(`/v1/consultations/waiting/${consultationId}`, getAuthHeader());

/** 다음 대기 고객 배정 요청 */
// export const claimNextCustomer = () =>
//     apiStore.post('/v1/consultations/queue/claim-next', {}, getAuthHeader());


// ---------------------------------------------------------
// 3. 상담 상세 진행 및 종료
// ---------------------------------------------------------

export const getConsultationDetail = (consultationId: string | number) => 
    apiStore.get<ConsultationResponse>(`/v1/consultations/${consultationId}`, getAuthHeader());

// export const acceptConsultation = (consultationId: string | number) =>
//     apiStore.post(`/v1/consultations/${consultationId}/accept`, {}, getAuthHeader());

export const sendConsultationMessage = (consultationId: string | number, message: string) => 
    apiStore.post(`/v1/consultations/${consultationId}/messages`, { content: message }, getAuthHeader());

// export const completeConsultation = (consultationId: string | number, data: ConsultationCompleteRequest) =>
//     apiStore.post(`/v1/consultations/${consultationId}/complete`, data, getAuthHeader());

/** * [POST] 진행 중인 상담 종료 
 * IN_PROGRESS 상태만 가능, AI 후처리 PENDING 전환, 오늘 처리 건수 반환 
 */
export const endConsultation = async (consultationId: string | number, data: ConsultationEndRequest): Promise<ConsultationEndResponse> => {
    const response = await apiStore.post<ConsultationEndResponse>(
        `/v1/consultations/${consultationId}/end`, 
        data, 
        getAuthHeader()
    );
    const result = (response as unknown as AxiosResponse<ConsultationEndResponse>).data || response;
    return result as ConsultationEndResponse;
};