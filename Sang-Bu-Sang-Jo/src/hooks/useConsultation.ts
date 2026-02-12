import { useState, useCallback, useEffect } from 'react';

export type AgentStatus = 'OFFLINE' | 'AVAILABLE' | 'CONSULTING';

export interface CustomerInfo {
  id: string;
  name: string;
  category: string;
  recentHistory: string;
}

// ✅ ConsultationDetail의 MOCK_DB와 ID 형식을 일치시킨 데이터셋
const WAITING_CUSTOMERS: CustomerInfo[] = [
  {
    id: "CUST_10024",
    name: "고길동",
    category: "멤버십/혜택",
    recentHistory: "VIP Platinum 등급 혜택 및 영화 예매권 사용 문의"
  },
  {
    id: "CUST_001",
    name: "김철수",
    category: "모바일/요금제",
    recentHistory: "5G 시그니처 요금제 데이터 쉐어링 설정 요청"
  },
  {
    id: "CUST_002",
    name: "이영희",
    category: "인터넷/IPTV",
    recentHistory: "장기 우수 고객 재약정 할인 및 셋톱박스 교체 문의"
  },
  {
    id: "CUST_003",
    name: "박지성",
    category: "로밍/해외",
    recentHistory: "유럽 여행용 제로 로밍 요금제 가입 및 데이터 차단 확인"
  },
  {
    id: "CUST_004",
    name: "손흥민",
    category: "신규가입",
    recentHistory: "타사 번호이동 시 결합 할인 유지 조건 확인"
  }
];

export const useConsultation = () => {
  const [status, setStatus] = useState<AgentStatus>('OFFLINE');
  const [assignedCustomer, setAssignedCustomer] = useState<CustomerInfo | null>(null);

  // ✅ 업무 상태 변경 핸들러
  const toggleWorkStatus = useCallback(() => {
    setStatus(prev => {
      const nextStatus = prev === 'OFFLINE' ? 'AVAILABLE' : 'OFFLINE';
      
      if (nextStatus === 'OFFLINE') {
        setAssignedCustomer(null);
      }
      return nextStatus;
    });
  }, []);

  // ✅ 상담 배정 시뮬레이션
  useEffect(() => {
    if (status !== 'AVAILABLE' || assignedCustomer) return;

    const randomDelay = Math.floor(Math.random() * 1700) + 800;

    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * WAITING_CUSTOMERS.length);
      setAssignedCustomer(WAITING_CUSTOMERS[randomIndex]);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [status, assignedCustomer]);

  // ✅ [중요] Dashboard에서 필요한 모든 속성을 리턴합니다.
  return {
    status,
    assignedCustomer,
    setAssignedCustomer,
    toggleWorkStatus,
    // Dashboard에서 발생하는 'waitingCount' 속성 없음 에러 해결
    waitingCount: WAITING_CUSTOMERS.length, 
  };
};