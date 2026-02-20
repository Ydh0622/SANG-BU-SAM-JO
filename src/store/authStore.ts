import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'COUNSELOR' | 'ADMIN'; // 상담사 또는 관리자
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (userData) => set({ user: userData, isLoggedIn: true }),
      logout: () => {
        set({ user: null, isLoggedIn: false });
        localStorage.removeItem('accessToken');
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
    }
  )
);