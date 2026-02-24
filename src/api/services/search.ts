import { fastApiStore } from '../client';

/**
 * [상부상조] 통합 검색 서비스 (FastAPI - 8000 포트)
 * 💡 JIRA: HS03-27 (유사 사례 검색)
 * 💡 REQ-AI-03, REQ-AI-04 관련
 */

export const searchApi = {
    /** [REQ-AI-03] 상담 이력 통합 검색 (하이브리드 검색) */
    searchHistory: (query: string) => {
        // ✨ query 변수를 로그에 찍어서 '미사용' 에러 방지
        console.log(`Mock Search FastAPI [Query: ${query}]`, fastApiStore.defaults.baseURL);
        
        // [REAL] return fastApiStore.get('/api/v1/search/histories', { params: { query } });
        return Promise.resolve([]);
    },

    /** [REQ-AI-04] 유사 FAQ 검색 (벡터 유사도 기반) */
    searchSimilarFAQ: (text: string) => {
        // ✨ text 변수를 로그에 찍어서 '미사용' 에러 방지
        console.log(`Mock FAQ Vector Search [Input: ${text}]`, fastApiStore.defaults.baseURL);
        
        // [REAL] return fastApiStore.get('/api/v1/search/faq', { params: { text } });
        return Promise.resolve([]);
    }
};

export default searchApi;