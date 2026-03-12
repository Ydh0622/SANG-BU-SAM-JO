import { apiStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스
 */

// 1. 요청 인터페이스
export interface CreateConsultationRequest {
    customerName: string; 
    phone: string;        
    channel: "CHAT";
    productLineCode: "MOBILE" | "INTERNET" | "IPTV" | "TELEPHONE" | "ETC";
    issueTypeId: number;
    priority: "LOW" | "MID" | "HIGH";
    initialMessage: string;
}

// 2. 실제 데이터 알맹이 인터페이스
export interface ConsultationData {
    consultationId: number;
    status: string;
    createdAt: string;
}

// 3. 서버 전체 응답 구조
export interface CreateConsultationResponse {
    success: boolean;
    data: ConsultationData;
    error: string | null;
}

export interface ConsultationApiResponse {
    success: boolean;
    data: {
        todayDoneCount: number;
        list: ConsultationResponse[];
    };
    error: string | null;
}

export interface ConsultationCompleteRequest {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

export interface ConsultationEndRequest {
    finalResultCode: string;
}

export interface ConsultationEndResponse {
    todayDoneCount: number;
}

// 공통 헤더 설정
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
    const response = await apiStore.get<ConsultationApiResponse>('/v1/consultations', getAuthHeader());
    return response as unknown as ConsultationApiResponse;
};

/** [POST] 신규 상담 생성 
 */
export const createConsultation = async (data: CreateConsultationRequest): Promise<CreateConsultationResponse> => {
    // 401 Unauthorized 방지를 위해 세 번째 인자(헤더)를 비워둡니다.
    const response = await apiStore.post<unknown>('/v1/consultations', data);
    
    // 인터셉터를 거친 response를 안전하게 타입 단언
    const result = response as unknown as CreateConsultationResponse;
    
    // 인터셉터가 data.data(알맹이)만 반환했을 경우를 위한 방어 로직
    const isDirectData = response as unknown as ConsultationData;
    if (result.success === undefined && isDirectData.consultationId) {
        return {
            success: true,
            data: isDirectData,
            error: null
        };
    }

    if (result.success === false) {
        throw new Error(result.error || "상담 생성에 실패했습니다.");
    }
    
    return result;
};

/** [POST] 특정 상담 배정 */
export const assignConsultation = (consultationId: string | number) => 
    apiStore.post(`/v1/consultations/${consultationId}/assign`, {}, getAuthHeader());


// ---------------------------------------------------------
// 2. 대기열 및 큐 관리
// ---------------------------------------------------------

/** 대기 상담 수 조회 */
export const fetchWaitingCount = async (): Promise<{ count: number }> => {
    const response = await apiStore.get<{ count: number }>('/v1/consultations/waiting/count', getAuthHeader());
    return response as unknown as { count: number };
};

/** 대기 상담 목록 조회 */
export const fetchWaitingConsultations = async (): Promise<ConsultationResponse[]> => {
    try {
        const response = await apiStore.get<ConsultationResponse[]>('/v1/consultations/waiting', getAuthHeader());
        return response as unknown as ConsultationResponse[];
    } catch (error) {
        console.error("대기 상담 목록 로드 실패:", error);
        return [];
    }
};

/** [DELETE] 대기 상담 제거  */
export const deleteWaitingConsultation = (consultationId: string | number) => 
    apiStore.delete(`/v1/consultations/waiting/${consultationId}`, getAuthHeader());

/** 다음 대기 고객 배정 요청 */
export const claimNextCustomer = () => 
    apiStore.post('/v1/consultations/queue/claim-next', {}, getAuthHeader());


// ---------------------------------------------------------
// 3. 상담 상세 진행 및 종료
// ---------------------------------------------------------

export const getConsultationDetail = (consultationId: string | number) => 
    apiStore.get<ConsultationResponse>(`/v1/consultations/${consultationId}`, getAuthHeader())
        .then(res => res as unknown as ConsultationResponse);

export const acceptConsultation = (consultationId: string | number) => 
    apiStore.post(`/v1/consultations/${consultationId}/accept`, {}, getAuthHeader());

export const sendConsultationMessage = (consultationId: string | number, message: string) => 
    apiStore.post(`/v1/consultations/${consultationId}/messages`, { content: message }, getAuthHeader());

export const completeConsultation = (consultationId: string | number, data: ConsultationCompleteRequest) => 
    apiStore.post(`/v1/consultations/${consultationId}/complete`, data, getAuthHeader());

/** [POST] 진행 중인 상담 종료 */
export const endConsultation = async (consultationId: string | number, data: ConsultationEndRequest): Promise<ConsultationEndResponse> => {
    const response = await apiStore.post<ConsultationEndResponse>(
        `/v1/consultations/${consultationId}/end`, 
        data, 
        getAuthHeader()
    );
    return response as unknown as ConsultationEndResponse;
};