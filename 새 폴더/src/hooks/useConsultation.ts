import { useState, useCallback } from 'react';

export type AgentStatus = 'OFFLINE' | 'AVAILABLE' | 'CONSULTING';

export interface CustomerInfo {
  id: string | number;
  name?: string;
  category?: string;
  recentHistory?: string;
  inquiryMessage?: string;
}

export const useConsultation = () => {
  const [status, setStatus] = useState<AgentStatus>('OFFLINE');
  const [assignedCustomer, setAssignedCustomer] = useState<CustomerInfo | null>(null);

  const toggleWorkStatus = useCallback(() => {
    setStatus(prev => {
      const nextStatus = prev === 'OFFLINE' ? 'AVAILABLE' : 'OFFLINE';
      if (nextStatus === 'OFFLINE') {
        setAssignedCustomer(null);
      }
      return nextStatus;
    });
  }, []);

  return {
    status,
    assignedCustomer,
    setAssignedCustomer,
    toggleWorkStatus,
    setStatus,
  };
};