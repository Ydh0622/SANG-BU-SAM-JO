import axios from 'axios';

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

export interface ConsultationMessageDetail {
    message_seq: number;
    sender_type: string;
    content: string;
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
    messages: ConsultationMessageDetail[];
}

export const getConsultationDetail = async (consultationId: string | number): Promise<ConsultationDetailResponse | null> => {
    try {
        const response = await axios.get(`/fastapi/v1/consultations/${consultationId}`);
        return response.data;
    } catch (error) {
        console.error("상담 상세 조회 실패:", error);
        return null;
    }
};

export const searchConsultations = async (req: ConsultationSearchRequest): Promise<ConsultationSearchResponse> => {
    try {
        const response = await axios.post('/fastapi/v1/search/consultations', req, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("ES 상담 검색 실패:", error);
        return { hits: [], total: 0, page: req.page ?? 1, size: req.size ?? 10 };
    }
};

// 하위 호환용 - 기존 코드에서 사용하던 타입들 유지
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

export interface SearchApiResponse {
    success: boolean;
    data: ApiConsultationItem[];
    error: unknown;
}
