// import { apiStore, adminStore } from '../client'; 
import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] 상담 관련 API 서비스
 * * 💡 실서버 연결 방법:
 * 1. 상단 'import { apiStore, adminStore }' 주석 해제
 * 2. 각 함수에서 //  [REAL] 주석 해제
 * 3. 각 함수에서 //  [DELETE] 블록 전체 삭제
 */

// 1. 상담 목록 전체 조회 (어드민 8082 포트 사용)
export const fetchConsultations = async (): Promise<ConsultationResponse[]> => {
  try {
    //  [REAL] 실서버 연결 시 주석 해제
    // const response = await adminStore.get('/api/v1/consultations');
    // return response.data;

    // 🗑️ [DELETE] 시연용 가짜 데이터 (서버 연결 시 삭제)
    console.log("Using Mock Data: fetchConsultations");
    return [
      {
        consultation_id: 102938,
        customer_name: "김철수",
        contact_info: "010-****-5678",
        channel_type: "CALL",
        status: "DONE",
        priority: "HIGH",
        category: "요금문의",
        issue_detail: "결합 할인 미적용",
        content_preview: "5G 가족 결합 할인 누락 건 확인하여 소급 적용 안내 완료.",
        created_at: "2026-02-19T10:42:00",
      },
      {
        consultation_id: 102939,
        customer_name: "고길동",
        contact_info: "010-****-4000",
        channel_type: "CHAT",
        status: "IN_PROGRESS",
        priority: "MID",
        category: "기기변경",
        issue_detail: "단말기 파손 보상",
        content_preview: "보험 가입 여부 확인 후 보상 절차 정보 전송 중.",
        created_at: "2026-02-19T10:15:00",
      }
    ];
  } catch (err) {
    console.error("상담 목록 로드 중 에러 발생:", err);
    throw err;
  }
};

// 2. 개별 상담 상세 정보 조회 (API 8081 포트 사용)
export const getConsultationDetail = async (customerId: string): Promise<ConsultationResponse> => {
  try {
    //  [REAL] 실서버 연결 시 주석 해제
    // const response = await apiStore.get(`/api/v1/consultations/start-info/${customerId}`);
    // return response.data;

    // 🗑️ [DELETE] 시연용 가짜 데이터 (서버 연결 시 삭제)
    return {
      consultation_id: Number(customerId),
      customer_name: "고길동",
      contact_info: "010-1002-4567",
      channel_type: "CHAT",
      status: "IN_PROGRESS",
      priority: "MID",
      category: "요금문의",
      issue_detail: "가족 결합 할인 누락 건",
      content_preview: "최근 요금제 변경으로 인한 결합 할인 누락 확인 요청",
      created_at: new Date().toISOString(),
    };
  } catch (err) {
    console.warn("상세 정보 로드 실패:", err);
    throw err;
  }
};

// 3. 메시지 전송 (API 8081 포트 사용)
export const sendConsultationMessage = async (consultId: string, message: string) => {
  try {
    // [REAL] 실서버 연결 시 주석 해제
    // const response = await apiStore.post(`/api/v1/consultations/${consultId}/messages`, { message });
    // return response.data;

    //  [DELETE] 시연용 가짜 성공 처리 (서버 연결 시 삭제)
    console.log(`Mock Send: [${consultId}] ${message}`);
    return Promise.resolve({ status: "success" });
  } catch (err) {
    console.error("메시지 전송 실패:", err);
    throw err;
  }
};

// 4. 상담 종료 및 확정 (API 8081 포트 사용)
export const completeConsultation = async (consultId: string) => {
  try {
    //  [REAL] 실서버 연결 시 주석 해제
    // const response = await apiStore.post(`/api/v1/consultations/${consultId}/complete`);
    // return response.data;

    // 🗑️[DELETE] 시연용 가짜 성공 처리 (서버 연결 시 삭제)
    console.log(`Mock Complete: Consultation ${consultId} closed.`);
    return Promise.resolve({ status: "success" });
  } catch (err) {
    console.warn("상담 종료 실패:", err);
    return Promise.resolve({ status: "success" });
  }
};