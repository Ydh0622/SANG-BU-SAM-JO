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

export const getSimilarFaq = async (questionText: string): Promise<FaqAnalysisResponse> => {
  try {
    // 422 에러 해결을 위한 구조: 
    // POST 요청이지만 데이터를 Body가 아닌 URL 파라미터(params)로 보냅니다.
    const response = await axios.post('/fastapi/v1/search/faq', null, {
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