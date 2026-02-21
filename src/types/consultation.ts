// src/types/consultation.ts

export interface ConsultationResponse {
  // 명세서 기준: 실제 서버에서 내려주는 필드명으로 수정
  consultation_id: number;     // ID가 숫자로 오네요
  customer_name: string;
  contact_info: string;        // mask_phone 대신 contact_info로 적혀있을 수 있습니다
  channel_type: "CALL" | "CHAT" | "APP"; 
  status: "DONE" | "IN_PROGRESS" | "CANCELED";
  priority: "LOW" | "MID" | "HIGH";
  category: string;            // 카테고리 (예: 요금문의)
  issue_detail: string;        // 상세 이슈
  content_preview: string;     // 요약 내용
  created_at: string;          // 시작 시간
}