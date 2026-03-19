import { apiStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스
 */

// --- Interfaces ---

export interface CreateConsultationRequest {
    customerName: string;
    phone: string;
    channel: "CHAT";
    productLineCode: "MOBILE" | "INTERNET" | "IPTV" | "TELEPHONE" | "ETC";
    issueTypeId: number;
    priority: "HIGH" | "MID" | "LOW";
    initialMessage: string;
    faqSessionId?: string;
}

export interface CreateConsultationResponse {
    success: boolean;
    data: {
        consultationId: number;
        status: string;
        createdAt: string;
    };
    error?: string | null;
}

/** 매칭 응답 인터페이스 (SnakeCase 방어 로직 포함) */
export interface MatchOldestResponse {
    consultationId: number;
    consultation_id: number;
    customerName: string;
    customer_name: string;
    initialMessage: string;
    statusCode: string;
    contact_info?: string; 
    channel_type?: 'CHAT' | 'PHONE' | 'WEB';
    priority?: 'LOW' | 'MID' | 'HIGH';
    category?: string;
    issue_detail?: string;
    channelCode?: string;
    productLineCode?: string;
    priorityCode?: string;
    created_at?: string;
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
    status: string;
    agentId: number;
    startedAt: string;
    version: number;
}

export interface ConsultationEndRequest {
    finalResultCode: string;
}

export interface ConsultationEndResponse {
    todayDoneCount: number;
}

// --- Auth Helper ---
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
// API 호출 함수들 (FAQ.ts 스타일 적용)
// ---------------------------------------------------------

/** [POST] 신규 상담 생성 */
export const createConsultation = async (data: CreateConsultationRequest): Promise<CreateConsultationResponse> => {
    const response = await apiStore.post('/v1/consultations', data);
    return response as unknown as CreateConsultationResponse;
};

/** [GET] 상담 목록 조회 */
export const fetchConsultations = async (agentId?: number | string): Promise<ConsultationResponse[]> => {
    const params = agentId ? `?agentId=${agentId}` : '';
    const response = await apiStore.get(`/v1/consultations${params}`, getAuthHeader());
    return response as unknown as ConsultationResponse[];
};

/** [DELETE] 대기 상담 제거 */
export const deleteWaitingConsultation = (consultationId: string | number) => 
    apiStore.delete(`/v1/consultations/waiting/${consultationId}`, getAuthHeader());

/** 가장 오래된 대기 상담 매칭 */
export const matchOldestConsultation = async (): Promise<MatchOldestResponse> => {
    const response = await apiStore.post('/v1/consultations/match/oldest', {}, getAuthHeader());
    return response as unknown as MatchOldestResponse;
};

/** 상담 배정 */
export const assignConsultation = async (consultationId: string | number): Promise<AssignResponse> => {
    const response = await apiStore.post(`/v1/consultations/${consultationId}/assign`, {}, getAuthHeader());
    return response as unknown as AssignResponse;
};

/** 대기 상담 수 조회 */
export const fetchWaitingCount = async (): Promise<{ count: number }> => {
    const response = await apiStore.get('/v1/consultations/waiting/count', getAuthHeader());
    return response as unknown as { count: number };
};

/** 대기 상담 목록 조회 */
export const fetchWaitingConsultations = async (): Promise<ConsultationResponse[]> => {
    try {
        const response = await apiStore.get('/v1/consultations/waiting', getAuthHeader());
        return response as unknown as ConsultationResponse[];
    } catch (error) {
        console.error("대기 상담 목록 로드 실패:", error);
        return [];
    }
};

/** 상담 상세 조회 */
export const getConsultationDetail = async (consultationId: string | number): Promise<ConsultationResponse> => {
    const response = await apiStore.get(`/v1/consultations/${consultationId}`, getAuthHeader());
    return response as unknown as ConsultationResponse;
};

/** 상담 컨텍스트 조회 (캐시) */
export const getConsultationContext = async (consultationId: string | number) => {
    const response = await apiStore.get(`/v1/consultations/${consultationId}/context`, getAuthHeader());
    return response; // 컨텍스트는 구조에 따라 unknown 변환 추가 가능
};

/** 상담 메시지 전송 */
export const sendConsultationMessage = async (consultationId: string | number, message: string, senderType?: string) => {
    return await apiStore.post(`/v1/consultations/${consultationId}/messages`, 
        { content: message, ...(senderType ? { senderType } : {}) }, 
        getAuthHeader()
    );
};

/** 상담 종료 */
export const endConsultation = async (consultationId: string | number, data: ConsultationEndRequest): Promise<ConsultationEndResponse> => {
    const response = await apiStore.post(`/v1/consultations/${consultationId}/end`, data, getAuthHeader());
    return response as unknown as ConsultationEndResponse;
};

export interface FaqFeedbackItem {
    question: string;
    answer: string;
    liked: boolean | null;
}

/** FAQ 세션 저장 */
export const storeFaqSession = async (sessionId: string, faqs: FaqFeedbackItem[], aiAnswer?: string, aiAnswerLiked?: boolean | null): Promise<void> => {
    await apiStore.post(`/v1/consultations/faq-sessions`, { sessionId, faqs, aiAnswer, aiAnswerLiked });
};