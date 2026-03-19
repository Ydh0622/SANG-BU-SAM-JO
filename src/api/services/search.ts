import axios, { AxiosError } from 'axios';

// --- Interfaces (타입 정의) ---

/** 검색 결과 개별 항목 */
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

/** 검색 결과 응답 구조 */
export interface ConsultationSearchResponse {
    hits: ConsultationSearchHit[];
    total: number;
    page: number;
    size: number;
}

/** 검색 요청 파라미터 */
export interface ConsultationSearchRequest {
    keyword?: string;
    agent_id?: number;
    date_from?: string;
    date_to?: string;
    final_result_code?: string;
    page?: number;
    size?: number;
}

/** 메시지 상세 내역 */
export interface ConsultationMessageDetail {
    message_seq: number;
    sender_type: string;
    content: string;
}

/** 상담 상세 정보 응답 구조 */
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

// --- API Instance (FastAPI 전용 인스턴스) ---

/** * baseURL을 환경에 따라 분기하여 
 * 코드 내에서 매번 전체 주소를 적지 않도록 설정했습니다.
 */
const fastApiStore = axios.create({
    baseURL: import.meta.env.PROD ? '' : 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
});

// --- API Functions (비즈니스 로직) ---

/** * 상담 상세 조회 API
 * @param consultationId 상담 고유 ID
 */
export const getConsultationDetail = async (consultationId: string | number): Promise<ConsultationDetailResponse | null> => {
    try {
        // 제네릭 <ConsultationDetailResponse>을 사용하여 any 없이 타입 지정
        const response = await fastApiStore.get<ConsultationDetailResponse>(`/fastapi/v1/consultations/${consultationId}`);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        console.error("상담 상세 조회 실패:", err.response?.status, err.message);
        return null;
    }
};

/** * ES 기반 상담 내역 검색 API (POST)
 * @param req 검색 필터 및 페이지네이션 정보
 */
export const searchConsultations = async (req: ConsultationSearchRequest): Promise<ConsultationSearchResponse> => {
    try {
        // 제네릭 <ConsultationSearchResponse>을 사용하여 any 없이 타입 지정
        const response = await fastApiStore.post<ConsultationSearchResponse>('/fastapi/v1/search/consultations', req);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        console.error("ES 상담 검색 실패:", err.response?.status, err.message);
        return { 
            hits: [], 
            total: 0, 
            page: req.page ?? 1, 
            size: req.size ?? 10 
        };
    }
};

// --- 하위 호환 및 기타 인터페이스 유지 ---

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