import { fastApiStore } from "../client"; 

export interface FaqItem {
  faq_id: string;
  question: string;
  answer: string;
  score: number;
}

export interface FaqAnalysisResponse {
  answer: string;
  retrieved_faqs: FaqItem[];
}

/**
 * FAQ 검색 API 호출 함수
 */
export const getSimilarFaq = async (questionText: string): Promise<FaqAnalysisResponse> => {
  try {
    const response = await fastApiStore.post('/v1/search/faq', {}, {
      params: {
        question_text: questionText
      }
    });
    return response as unknown as FaqAnalysisResponse;

  } catch (err) {
    console.error("QA API 연결 실패:", err);
    return {
      answer: "분석 데이터를 불러오지 못했습니다.",
      retrieved_faqs: []
    };
  }
};