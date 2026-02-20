import { adminStore } from './client';

interface SearchParams {
  searchTerm?: string;
  activeFilter?: string;
  page?: number;
  size?: number;
}

export const adminApi = {
  searchHistory: (params: SearchParams) => adminStore.get('/admin/history', { params }),
  getDashboardStats: () => adminStore.get('/admin/statistics/dashboard'),
  getHistoryDetail: (consultId: string) => adminStore.get(`/admin/history/${consultId}`),
};