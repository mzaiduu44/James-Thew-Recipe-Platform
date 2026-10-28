import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types/entities';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | 'Guest';

  setAuth: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: 'Guest',

      setAuth: (token: string, user: User) => {
        set({
          user,
          token,
          isAuthenticated: true,
          role: user.role || 'User',
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: 'Guest',
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = { ...currentUser, ...updates };
        set({ user: updated, role: updated.role || get().role });
      },
    }),
    {
      name: 'james_thew_auth',
    }
  )
);

