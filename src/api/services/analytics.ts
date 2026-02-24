import { apiStore } from '../client';

/**
 * [상부상조] 고객 데이터 분석 서비스 (8081 포트)
 *  JIRA: HS03-32 (고객 성향 분석)
 */

export const analyticsApi = {
    /** [REQ-PRE-006] 상담 빈도 분석 조회 (7일/30일 상담 횟수) */
    getCustomerFrequency: (customerId: string | number) => {
    
        console.log(`Mock Frequency Info for Customer: ${customerId}`, apiStore.defaults.baseURL);
        
        // [REAL] 백엔드 연결 시 아래 주석 해제
        // return apiStore.get(`/api/v1/customers/${customerId}/insights/frequency`);
        
        return Promise.resolve({ 
            total_count: 5, 
            repeat_issue_count: 2 
        });
    },

    /** [REQ-PRE-005, 013] 고객 성향/페르소나/감정 정보 조회 */
    getCustomerPersona: (customerId: string | number) => {
       
        console.log(`Mock Persona Info for Customer: ${customerId}`, apiStore.defaults.baseURL);
        
        // [REAL] 백엔드 연결 시 아래 주석 해제
        // return apiStore.get(`/api/v1/customers/${customerId}/insights/persona`);
        
        return Promise.resolve({ 
            persona: "꼼꼼하고 논리적인 스타일", 
            emotion: "NEUTRAL" 
        });
    }
};

export default analyticsApi;