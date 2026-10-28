import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

export interface UiState {
  toasts: ToastItem[];
  isDarkMode: boolean;
  isMobileNavOpen: boolean;
  isTransitioningTheme: boolean;
  quickViewRecipeId: string | null;

  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  setQuickViewRecipeId: (id: string | null) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      toasts: [],
      isDarkMode: false,
      isMobileNavOpen: false,
      isTransitioningTheme: false,
      quickViewRecipeId: null,

      addToast: (toast) => {
        const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
        const newToast: ToastItem = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));

        const duration = toast.duration ?? 4500;
        if (duration > 0) {
          setTimeout(() => {
            set((state) => ({
              toasts: state.toasts.filter((t) => t.id !== id),
            }));
          }, duration);
        }

        return id;
      },

      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      toggleDarkMode: () => {
        if (get().isTransitioningTheme) return;

        set({ isTransitioningTheme: true });
        const next = !get().isDarkMode;

        setTimeout(() => {
          if (typeof document !== 'undefined') {
            if (next) {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
            }
          }
          set({ isDarkMode: next });
        }, 950);

        setTimeout(() => {
          set({ isTransitioningTheme: false });
        }, 2000);
      },

      setDarkMode: (enabled: boolean) => {
        if (typeof document !== 'undefined') {
          if (enabled) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          }
        }
        set({ isDarkMode: enabled });
      },

      setMobileNavOpen: (open: boolean) => {
        set({ isMobileNavOpen: open });
      },

      setQuickViewRecipeId: (id: string | null) => {
        set({ quickViewRecipeId: id });
      },
    }),
    {
      name: 'james_thew_ui_settings',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);
