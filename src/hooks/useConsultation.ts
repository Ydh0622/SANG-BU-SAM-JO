import { useCallback, useState } from "react";

export interface CustomerInfo {
    id: string;
    name: string;
    category?: string;
    recentHistory: string;
    inquiryMessage: string;
}

export const useConsultation = () => {
    // 1. 상담원의 업무 상태 (AVAILABLE / OFFLINE)
    const [status, setStatus] = useState<string>("OFFLINE");
    
    // 2. 현재 나에게 배정되어 모달로 떠있는 고객 정보
    const [assignedCustomer, setAssignedCustomer] = useState<CustomerInfo | null>(null);

    // 3. 업무 상태 토글 함수
    const toggleWorkStatus = useCallback(() => {
        setStatus((prev) => (prev === "OFFLINE" ? "AVAILABLE" : "OFFLINE"));
        
        // 업무를 끌 때 모달이 떠있다면 같이 닫아주는 로직 (선택사항)
        if (status === "AVAILABLE") {
            setAssignedCustomer(null);
        }
    }, [status]);

    return { 
        status, 
        assignedCustomer, 
        setAssignedCustomer, 
        toggleWorkStatus,
    };
};