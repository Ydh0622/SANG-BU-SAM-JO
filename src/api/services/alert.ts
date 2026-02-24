import { apiStore } from '../client';

/**
 * [상부상조] 시스템 알림 서비스 (8081 포트)
 */

export const alertApi = {
    /** 긴급 알림 배너 조회 (CRITICAL/HIGH) */
    fetchActiveAlerts: () => {
        // [REAL] return apiStore.get('/api/v1/alerts/active');
        console.log("Mock Active Alerts", apiStore.defaults.baseURL);
        return Promise.resolve([
            { id: 1, level: "CRITICAL", message: "수도권 지역 IPTV 인증 서버 부하로 인한 접속 지연 발생 중" }
        ]);
    }
};

export default alertApi;