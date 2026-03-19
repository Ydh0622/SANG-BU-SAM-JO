import { fastApiStore } from "../client"; 

/** 1. 서버에서 실제로 내려주는 데이터의 구조를 정의합니다 (Raw Data) */
interface RawFaqItem {
  faq_id: string;
  question: string;
  answer: string;
}

interface RawFaqResponse {
  answer: string;
  retrieved_faqs: RawFaqItem[];
}

/** 2. 우리 프론트엔드 컴포넌트(CustomerQA)가 사용하는 데이터 구조입니다 */
export interface FaqItem {
  kbId: string;           
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
    // Axios의 제네릭을 활용하여 any 없이 타입을 지정합니다.
    const response = await fastApiStore.post<RawFaqResponse>('/v1/search/faq', {}, {
      params: {
        question_text: questionText
      }
    });

    const data = response.data;

    // [핵심] 서버 데이터(RawFaqItem)를 우리 타입(FaqItem)으로 변환합니다.
    const mappedFaqList: FaqItem[] = (data.retrieved_faqs ?? []).map((item) => ({
      kbId: item.faq_id,          // faq_id를 kbId로 매칭
      request: item.question,     // question을 request로 매칭
      answer: item.answer,
      productLineCode: null,      
      customerLiked: false
    }));

    return {
      answer: data.answer || "분석 데이터를 불러오지 못했습니다.",
      faqList: mappedFaqList
    };

  } catch (err) {
    console.error("QA API 연결 실패:", err);
    return {
      answer: "분석 데이터를 불러오지 못했습니다.",
      faqList: []
    };
  }
};