import { apiStore, adminStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스
 */

export interface ConsultationCompleteRequest {
    customer_request: string;
    agent_action: string;
    summary_text: string;
    issue_type_code: string;
    resolution_code: string;
}

// 로컬 환경인지 확인
const isLocal = import.meta.env.DEV;

/** 1. 상담 목록 전체 조회 (REQ-MGMT-001) */
export const fetchConsultations = async (): Promise<ConsultationResponse[]> => {
    if (isLocal) {
        return await adminStore.get('/api/v1/consultations');
    }

    // Vercel 시연용 Mock 데이터 (Dashboard.tsx의 렌더링 필드명에 맞춤)
    console.warn("시연용 모드: 가짜 상담 목록을 반환합니다.");
    
    const mockData = [
        {
            consultation_id: 101,
            customer_name: "김유플",
            status: "DONE", // Dashboard에서 '처리완료'로 표시됨
            priority: "HIGH",
            category: "요금제 문의",
            issue_detail: "5G 다이렉트",
            content_preview: "5G 다이렉트 요금제 변경하고 싶어요.",
            channel_type: "CHAT",
            createdAt: new Date().toISOString(),
        },
        {
            consultation_id: 102,
            customer_name: "이엘지",
            status: "PROGRESS", // Dashboard에서 '상담중'으로 표시됨
            priority: "MEDIUM",
            category: "기기 결합",
            issue_detail: "가족 무한 결합",
            content_preview: "인터넷이랑 결합하면 얼마나 할인되나요?",
            channel_type: "CALL",
            createdAt: new Date().toISOString(),
        },
        {
            consultation_id: 103,
            customer_name: "박Eureka",
            status: "PROGRESS",
            priority: "LOW",
            category: "분실 신고",
            issue_detail: "정지 요청",
            content_preview: "핸드폰을 잃어버렸어요. 정지 부탁드립니다.",
            channel_type: "CHAT",
            createdAt: new Date().toISOString(),
        }
    ];

    // 타입을 강제로 맞추어 에러를 방지합니다.
    return mockData as unknown as ConsultationResponse[];
};

/** 2. 다음 상담 고객 선점 (REQ-QUE-001) */
export const claimNextCustomer = () => {
    if (isLocal) return apiStore.post('/api/v1/consultations/queue/claim-next');
    return Promise.resolve({ data: { message: "시연용: 고객 선점 성공" } });
};

/** 3. 상담 승인 및 시작 (REQ-PRE-004) */
export const acceptConsultation = (consultationId: string | number) => {
    if (isLocal) return apiStore.post(`/api/v1/consultations/${consultationId}/accept`);
    return Promise.resolve({ data: { success: true } });
};

/** 4. 개별 상담 상세 정보 조회 (REQ-MGMT-002) */
export const getConsultationDetail = async (consultId: string): Promise<ConsultationResponse> => {
    if (isLocal) return await adminStore.get(`/api/v1/consultations/${consultId}`);

    // 시연용 상세 데이터 (상세 페이지에서도 snake_case를 쓸 확률이 높음)
    const detailData = {
        consultation_id: Number(consultId),
        customer_name: "김유플",
        status: "PROGRESS",
        priority: "HIGH",
        category: "요금제 문의",
        issue_detail: "5G 다이렉트",
        content_preview: "5G 다이렉트 요금제 변경하고 싶어요. 지금 쓰고 있는 요금제보다 저렴한 게 있을까요?",
        channel_type: "CHAT",
        createdAt: new Date().toISOString(),
    };

    return detailData as unknown as ConsultationResponse;
};

/** 5. 메시지 전송 (실시간 채팅) */
export const sendConsultationMessage = (consultId: string, message: string) => {
    if (isLocal) return apiStore.post(`/api/v1/consultations/${consultId}/messages`, { message });
    return Promise.resolve({ data: { sentMessage: message } });
};

/** 6. 상담 종료 및 확정 (REQ-PRE-011) */
export const completeConsultation = (consultId: string, data: ConsultationCompleteRequest) => {
    if (isLocal) return apiStore.post(`/api/v1/consultations/${consultId}/end`, data);
    return Promise.resolve({ data: { success: true } });
};

/** 7. 상담 컨텍스트 재조회 (REQ-PRE-004) */
export const getConsultationContext = (consultId: string | number) => {
    if (isLocal) return apiStore.get(`/api/v1/consultations/${consultId}/context`);
    return Promise.resolve({ data: { context: "시연용 상담 컨텍스트입니다." } });
};