import axios from "axios";

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
 * 405 Method Not Allowed 에러 해결을 위해 POST -> GET으로 변경
 */
export const getSimilarFaq = async (questionText: string): Promise<FaqAnalysisResponse> => {
  try {
    // 백엔드 서버가 GET 방식을 허용하므로 axios.get을 사용합니다.
    // 데이터는 params 객체에 담아 전달하면 자동으로 URL 뒤에 ?question_text=... 형태로 붙습니다.
    const response = await axios.get('/fastapi/v1/search/faq', {
      params: {
        question_text: questionText
      }
    });
    
    return response.data;
  } catch (err) {
    console.error("QA API 연결 실패:", err);
    return {
      answer: "분석 데이터를 불러오지 못했습니다.",
      retrieved_faqs: []
    };
  }
};