import { fastApiStore } from "../client"; 

export interface FaqItem {
  // 서버에서 내려오는 필드명으로 수정
  kbId: number | null;
  productLineCode: string | null;
  request: string;        
  answer: string;        
  customerLiked: boolean; 
}

export interface FaqAnalysisResponse {
  answer: string;
  faqList: FaqItem[];    
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
      faqList: []
    };
  }
};