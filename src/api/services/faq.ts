import { fastApiStore } from "../client";

/** 1. 서버 원본 데이터 구조 정의 */
interface RawFaqItem {
  faq_id: string;
  question: string;
  answer: string;
}

interface RawFaqResponse {
  answer: string;
  retrieved_faqs: RawFaqItem[];
}

/** 2. 프론트엔드 컴포넌트용 데이터 구조 정의 */
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
    // 1. 요청을 보냅니다.
    const response = await fastApiStore.post<RawFaqResponse>('/v1/search/faq', {}, {
      params: { question_text: questionText }
    });

    const data = (response as unknown as { data: RawFaqResponse }).data 
      ? (response as unknown as { data: RawFaqResponse }).data 
      : (response as unknown as RawFaqResponse);

    const retrievedFaqs = data?.retrieved_faqs ?? [];

    const mappedFaqList: FaqItem[] = retrievedFaqs.map((item) => ({
      kbId: item.faq_id,      
      request: item.question, 
      answer: item.answer,
      productLineCode: null,
      customerLiked: false
    }));

    return {
      answer: data?.answer ?? "분석 데이터를 불러오지 못했습니다.",
      faqList: mappedFaqList
    };

  } catch (err) {
    console.error("QA API 연결 실패:", err);
    return {
      answer: "시스템 오류가 발생했습니다.",
      faqList: []
    };
  }
};