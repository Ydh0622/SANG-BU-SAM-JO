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

    // 2. [핵심] any 없이 데이터 위치 파악 (Type Guard)
    // response 자체가 RawFaqResponse인지, 아니면 .data 안에 들어있는지 체크합니다.
    const data = (response as unknown as { data: RawFaqResponse }).data 
      ? (response as unknown as { data: RawFaqResponse }).data 
      : (response as unknown as RawFaqResponse);

    // 3. 데이터가 비어있을 경우를 대비한 안전장치
    const retrievedFaqs = data?.retrieved_faqs ?? [];

    // 4. 서버 필드명을 프론트엔드 필드명으로 매핑
    const mappedFaqList: FaqItem[] = retrievedFaqs.map((item) => ({
      kbId: item.faq_id,      // faq_id -> kbId
      request: item.question, // question -> request
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