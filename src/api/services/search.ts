import { apiStore } from '../client';

/** Swagger JSON 기반 실제 데이터 타입 정의 */
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

/** 전체 API 응답 구조 정의 */
export interface SearchApiResponse {
    success: boolean;
    data: ApiConsultationItem[];
    error: unknown; 
}

/** [API-113] 상담 관리 화면 목록 조회 */
export const fetchSearchList = async (tab: 'ALL' | 'MY' = 'ALL'): Promise<SearchApiResponse> => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // 1. API 호출
        const response = await apiStore.get<unknown>(
            `/v1/admin/consultations?tab=${tab}`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-USER-ID': userId || '',
                    'Content-Type': 'application/json'
                }
            }
        );
        
        //  타입 가드: 객체인지 확인
        const isObject = (res: unknown): res is Record<string, unknown> => 
            typeof res === 'object' && res !== null;

        let finalResponse: SearchApiResponse = { success: false, data: [], error: null };

        if (isObject(response)) {
            if ('success' in response && 'data' in response) {
                finalResponse = (response as unknown) as SearchApiResponse;
            } 
            // 만약 인터셉터가 배열([...])만 바로 던져준 경우 대응
            else if (Array.isArray(response)) {
                finalResponse = { success: true, data: response as ApiConsultationItem[], error: null };
            }
            // 기존 Case 1 (Axios 원본이 올 경우 대비)
            else if ('data' in response && isObject(response.data)) {
                const axiosBody = response.data;
                if ('success' in axiosBody && 'data' in axiosBody) {
                    finalResponse = (axiosBody as unknown) as SearchApiResponse;
                }
            }
        }

        // 2. 최종 반환 (배열 여부 강제 검증)
        return {
            success: finalResponse.success ?? false,
            data: Array.isArray(finalResponse.data) ? finalResponse.data : [],
            error: finalResponse.error ?? null
        };
        
    } catch (error) {
        console.error("Search 리스트 로드 실패:", error);
        return {
            success: false,
            data: [],
            error: error
        };
    }
};