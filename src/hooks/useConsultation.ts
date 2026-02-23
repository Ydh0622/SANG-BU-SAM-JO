import { useCallback, useEffect, useState } from "react";

export interface CustomerInfo {
    id: string;
    name: string;
    category: string;
    recentHistory: string;
    inquiryMessage: string;
}

export const useConsultation = () => {
    const [status, setStatus] = useState<string>("OFFLINE");
    const [assignedCustomer, setAssignedCustomer] = useState<CustomerInfo | null>(null);

    // ✨ 실시간 대기 인원을 시뮬레이션하기 위한 상태 (예: 기본 5명)
    const [waitingCount] = useState(5);

    useEffect(() => {
        if (status !== "AVAILABLE" || assignedCustomer) return;

        const checkCustomerInquiry = () => {
            const savedInquiry = localStorage.getItem("customerInquiry");
            
            if (savedInquiry) {
                const data = JSON.parse(savedInquiry);
                setAssignedCustomer({
                    id: "CUST_REAL_TIME",
                    name: "신규 고객",
                    category: data.category || "일반 문의",
                    inquiryMessage: data.message,
                    recentHistory: "실시간 웹 시연 문의"
                });
                localStorage.removeItem("customerInquiry");
            }
        };

        const timer = setInterval(checkCustomerInquiry, 1000);
        return () => clearInterval(timer);
    }, [status, assignedCustomer]);

    const toggleWorkStatus = useCallback(() => {
        setStatus((prev) => (prev === "OFFLINE" ? "AVAILABLE" : "OFFLINE"));
    }, []);

    return { 
        status, 
        assignedCustomer, 
        setAssignedCustomer, 
        toggleWorkStatus,
        waitingCount 
    };
};