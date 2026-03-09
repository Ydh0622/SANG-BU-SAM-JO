import { apiStore } from '../client';
import type { AxiosResponse } from 'axios';

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
    error: string | null;
}

/** [API-113] 상담 관리 화면 목록 조회 */
export const fetchSearchList = async (tab: 'ALL' | 'MY' = 'ALL'): Promise<SearchApiResponse> => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-USER-ID': userId || '',
            }
        };

    
        const response = await apiStore.get<SearchApiResponse>(
            `/v1/admin/consultations?tab=${tab}`, 
            config
        );
        
        const result = (response as unknown as AxiosResponse<SearchApiResponse>).data || response;
        return result as SearchApiResponse;
        
    } catch (error) {
        console.error("Search 리스트 로드 실패:", error);
        throw error;
    }
};