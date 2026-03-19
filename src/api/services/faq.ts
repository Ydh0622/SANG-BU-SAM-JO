import { fastApiStore } from "../client"; 

export interface FaqItem {
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

    // [디버깅용] 서버에서 실제로 오는 데이터 구조를 확인하기 위해 남겨두세요.
    console.log("[API DEBUG] getSimilarFaq response data:", response.data);

    // [방어 로직 추가] 
    // 1. response.data가 아예 없거나
    // 2. response.data.faqList가 undefined/null인 경우를 모두 대비합니다.
    const rawData = response.data || {};

    return {
      answer: rawData.answer || "분석 데이터를 불러오지 못했습니다.",
      // faqList가 없으면 무조건 빈 배열 []을 반환해서 .length 에러를 원천 차단합니다.
      faqList: Array.isArray(rawData.faqList) ? rawData.faqList : []
    } as FaqAnalysisResponse;

  } catch (err) {
    console.error("QA API 연결 실패:", err);
    return {
      answer: "분석 데이터를 불러오지 못했습니다.",
      faqList: [] // 에러 발생 시에도 빈 배열을 반환하여 컴포넌트 크래시 방지
    };
  }
};