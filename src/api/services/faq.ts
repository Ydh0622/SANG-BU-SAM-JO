import { fastApiStore } from "../client"; 

/** 1. 서버에서 내려주는 원본 데이터 구조 */
interface RawFaqItem {
  faq_id: string;
  question: string;
  answer: string;
}

interface RawFaqResponse {
  answer: string;
  retrieved_faqs: RawFaqItem[];
}

/** 2. 프론트엔드에서 사용하는 데이터 구조 */
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
    const response = await fastApiStore.post<RawFaqResponse>('/v1/search/faq', {}, {
      params: {
        question_text: questionText
      }
    });

   
    const data = response.data || (response as unknown as RawFaqResponse);

    // [방어 로직] data가 비어있거나 retrieved_faqs가 없을 때를 대비합니다.
    const retrievedFaqs = data?.retrieved_faqs ?? [];

    const mappedFaqList: FaqItem[] = retrievedFaqs.map((item) => ({
      kbId: item.faq_id,
      request: item.question,
      answer: item.answer,
      productLineCode: null,      
      customerLiked: false
    }));

    return {
      answer: data?.answer || "분석 데이터를 불러오지 못했습니다.",
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