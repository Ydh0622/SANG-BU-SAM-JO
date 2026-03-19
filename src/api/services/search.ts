import { AxiosError } from 'axios';
import { fastApiStore } from "../client"; 

// --- Interfaces (타입 정의) ---
export interface ConsultationSearchHit {
    consultation_id: number;
    summary_text: string;
    customer_id: number | null;
    customer_name: string | null;
    agent_id: number | null;
    agent_name: string | null;
    product_line_code: string | null;
    final_result_code: string | null;
    started_at: string | null;
    ended_at: string | null;
}

export interface ConsultationSearchResponse {
    hits: ConsultationSearchHit[];
    total: number;
    page: number;
    size: number;
}

export interface ConsultationSearchRequest {
    keyword?: string;
    agent_id?: number;
    date_from?: string;
    date_to?: string;
    final_result_code?: string;
    page?: number;
    size?: number;
}

export interface ConsultationDetailResponse {
    consultation_id: number;
    started_at: string | null;
    ended_at: string | null;
    customer_id: number | null;
    customer_name: string | null;
    phone_mask: string | null;
    agent_id: number | null;
    agent_name: string | null;
    product_line_code: string | null;
    final_result_code: string | null;
    summary_text: string | null;
    customer_request: string | null;
    agent_action: string | null;
    messages: {
        message_seq: number;
        sender_type: string;
        content: string;
    }[];
}

/**
 * 상담 상세 조회 API
 */
export const getConsultationDetail = async (consultationId: string | number): Promise<ConsultationDetailResponse | null> => {
    try {
        const response = await fastApiStore.get<ConsultationDetailResponse>(`/v1/consultations/${consultationId}`);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        console.error("상세 조회 실패:", err.response?.status);
        return null;
    }
};

/**
 * 상담 내역 검색 API (FAQ 방식과 동일하게 params로 전달)
 */
export const searchConsultations = async (req: ConsultationSearchRequest): Promise<ConsultationSearchResponse> => {
    try {
        // FAQ.ts 방식 반영: POST 요청이지만 데이터는 params(쿼리 스트링)로 전달
        const response = await fastApiStore.post<ConsultationSearchResponse>(
            '/v1/search/consultations', 
            {}, // Request Body는 비워둠
            { 
                params: req // 필터 조건들을 URL 파라미터로 전송
            }
        );
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        console.error("ES 상담 검색 실패:", err.response?.status);
        
        // 에러 발생 시 UI가 깨지지 않도록 기본 구조 반환
        return { 
            hits: [], 
            total: 0, 
            page: req.page ?? 1, 
            size: req.size ?? 10 
        };
    }
};

// 하위 호환용 인터페이스 (기존 코드 유지)
export interface ApiConsultationItem {
    consultationId: number;
    customerName: string;
    consultationCategory: string;
    summaryText: string | null;
    agentId: number | null;
    statusCode: "WAITING" | "DONE" | "IN_PROGRESS";
    startedAt: string | null;
    endedAt: string | null;
}