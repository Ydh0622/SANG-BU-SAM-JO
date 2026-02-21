// import { apiStore } from '../client';
// import type { ConsultationResponse } from '../../types/consultation';

/**
 * [상부상조] FAQ 관련 API 서비스
 * 명세서 11번: 유사 FAQ 검색 (Bearer 토큰 필수)
 */

// 유사 FAQ 검색 (Agent용)
export const getSimilarFaq = async (query: string) => {
  try {
    // [REAL] 실서버 연결 시 주석 해제
    // const response = await apiStore.get('/api/v1/search/faq', {
    //   params: { query } // 고객의 질문 의도를 쿼리 파라미터로 전달
    // });
    // return response.data;

    //  [MOCK] 시연용 가짜 데이터 (서버 연결 시 삭제)
    console.log(`Using Mock Data: getSimilarFaq (${query})`);
    return [
      {
        id: 101,
        question: "가족 결합 할인 조건이 어떻게 되나요?",
        answer: "LG유플러스 가족 결합은 모바일 2회선 이상부터 가능하며, 가족 관계 증명서가 필요합니다.",
        score: 0.95 // 유사도 점수
      },
      {
        id: 102,
        question: "5G 요금제 변경 시 유의사항",
        answer: "요금제 변경 시 기존 결합 혜택이 유지되는지 반드시 확인해야 합니다.",
        score: 0.82
      }
    ];
  } catch (err) {
    console.error("유사 FAQ 검색 실패:", err);
    return [];
  }
};