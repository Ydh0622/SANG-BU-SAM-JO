import { apiStore } from '../client';

export const aiApi = {
    /** [REQ-AI-01, 04] AI 상담 보조 요청 */
    fetchAIAssist: (consultationId: string | number, message: string) => {
        console.log(`Mock AI Assist [ID: ${consultationId}]: ${message}`, apiStore.defaults.baseURL);
        
        return Promise.resolve({ 
            suggestion: "고객님의 결합 할인 누락 건에 대해 사과드리고, 소급 적용 가능 여부를 확인하겠다고 안내하세요." 
        });
    },

    /** [HS03-19] 상담 결과 자동 요약 조회 */
    getAISummary: (consultationId: string | number) => {
        console.log(`Mock Summary Request for ID: ${consultationId}`, apiStore.defaults.baseURL);
        
        return Promise.resolve({ 
            summary_text: "가족 결합 할인 누락에 대한 불만 접수 및 처리 완료" 
        });
    }
};

export default aiApi;