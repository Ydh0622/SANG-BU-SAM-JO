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

export interface ConsultationApiResponse {
    success: boolean;
    data: {
        todayDoneCount: number;
        list: ConsultationResponse[];
    };
    error: string | null;
}

/** 메시지 전송 요청 인터페이스 */
export interface SendMessageRequest {
    content: string;         // 메시지 내용
    senderType: "AGENT" | "CUSTOMER"; // 발신자 타입 구분
}

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
// API 호출 함수들
// ---------------------------------------------------------

/** [POST] 신규 상담 생성 */
export const createConsultation = async (data: CreateConsultationRequest): Promise<CreateConsultationResponse> => {
    return await apiStore.post('/v1/consultations', data);
};

/** [GET] 전체 상담 목록 조회 */
export const fetchConsultations = async (): Promise<ConsultationResponse[]> => {
    return await apiStore.get('/v1/consultations', getAuthHeader());
};

/** [DELETE] 대기 상담 제거 */
export const deleteWaitingConsultation = (consultationId: string | number) => 
    apiStore.delete(`/v1/consultations/waiting/${consultationId}`, getAuthHeader());

/** 가장 오래된 대기 상담 매칭 */
export const matchOldestConsultation = async (): Promise<MatchOldestResponse> => {
    return await apiStore.post('/v1/consultations/match/oldest', {}, getAuthHeader());
};

/** 상담 배정 */
export const assignConsultation = async (consultationId: string | number): Promise<AssignResponse> => {
    return await apiStore.post(`/v1/consultations/${consultationId}/assign`, {}, getAuthHeader());
};

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

/** 상담 상세 조회 */
export const getConsultationDetail = (consultationId: string | number) => 
    apiStore.get<ConsultationResponse>(`/v1/consultations/${consultationId}`, getAuthHeader());

/** 상담 컨텍스트 조회 (캐시) */
export const getConsultationContext = (consultationId: string | number) =>
    apiStore.get(`/v1/consultations/${consultationId}/context`, getAuthHeader());

/** 상담 메시지 전송 */
export const sendConsultationMessage = (consultationId: string | number, message: string, senderType?: string) =>
    apiStore.post(`/v1/consultations/${consultationId}/messages`, { content: message, ...(senderType ? { senderType } : {}) }, getAuthHeader());

/** 상담 종료 */
export const endConsultation = async (consultationId: string | number, data: ConsultationEndRequest): Promise<ConsultationEndResponse> => {
    return await apiStore.post(`/v1/consultations/${consultationId}/end`, data, getAuthHeader());
};

export interface FaqFeedbackItem {
    question: string;
    answer: string;
    liked: boolean | null;
}

/** FAQ 세션 저장 (상담 신청 전 ES 결과 + 고객 피드백을 Redis에 미리 저장) */
export const storeFaqSession = async (sessionId: string, faqs: FaqFeedbackItem[], aiAnswer?: string, aiAnswerLiked?: boolean | null): Promise<void> => {
    await apiStore.post(`/v1/consultations/faq-sessions`, { sessionId, faqs, aiAnswer, aiAnswerLiked });
};