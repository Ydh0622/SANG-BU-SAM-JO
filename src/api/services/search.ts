import { fastApiStore } from "../client"; 

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

/** ES 상담 검색 API (FAQ.ts 방식 적용) */
export const searchConsultations = async (req: ConsultationSearchRequest): Promise<ConsultationSearchResponse> => {
    try {
        const response = await fastApiStore.post('/v1/search/consultations', {}, {
            params: req
        });
        // FAQ.ts 처럼 response 자체를 형변환하여 리턴
        return response as unknown as ConsultationSearchResponse;
    } catch (err) {
        console.error("검색 API 에러:", err);
        return { hits: [], total: 0, page: 1, size: 10 };
    }
};