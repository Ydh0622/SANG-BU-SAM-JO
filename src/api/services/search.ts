import { fastApiStore } from "../client"; 

// --- Interfaces ---
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

/** 상담 상세 정보 인터페이스 (빌드 에러 방지를 위해 추가) */
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

/** ES 상담 검색 API */
export const searchConsultations = async (req: ConsultationSearchRequest): Promise<ConsultationSearchResponse> => {
    try {
        const response = await fastApiStore.post('/v1/search/consultations', {}, {
            params: req
        });
        return response as unknown as ConsultationSearchResponse;
    } catch (err) {
        console.error("검색 API 에러:", err);
        return { hits: [], total: 0, page: req.page ?? 1, size: req.size ?? 10 };
    }
};

/** 상담 상세 조회 API */
export const getConsultationDetail = async (consultationId: string | number): Promise<ConsultationDetailResponse | null> => {
    try {
        const response = await fastApiStore.get(`/v1/consultations/${consultationId}`);
        return response as unknown as ConsultationDetailResponse;
    } catch (err) {
        console.error("상세 조회 API 연결 실패:", err);
        return null;
    }
};