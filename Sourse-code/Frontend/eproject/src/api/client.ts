import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { ApiProblemDetails } from '@/types/api';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://jamesthewrecipe.runasp.net';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export function isValidJwt(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const trimmed = token.trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
  if (trimmed.startsWith('demo-') || trimmed.startsWith('mock-')) return false;
  const parts = trimmed.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && typeof payload.exp === 'number') {
      if (Date.now() >= (payload.exp - 10) * 1000) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

let guestTokenPromise: Promise<string | null> | null = null;

export async function getGuestToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem('james_thew_guest_token');
  if (isValidJwt(cached)) return cached;

  if (guestTokenPromise) return guestTokenPromise;

  guestTokenPromise = (async () => {
    try {
      const guestEmail = import.meta.env.VITE_GUEST_EMAIL;
      const guestPassword = import.meta.env.VITE_GUEST_PASSWORD;
      if (!guestEmail || !guestPassword) {
        console.warn(
          'Guest token credentials not configured. Set VITE_GUEST_EMAIL and VITE_GUEST_PASSWORD in .env'
        );
        return null;
      }
      const res = await axios.post(
        `${API_BASE_URL}/api/Auth`,
        { email: guestEmail, password: guestPassword },
        { timeout: 8000 }
      );
      const raw = typeof res.data === 'string' ? res.data : (res.data as any)?.token;
      const cleanToken = raw ? String(raw).replace(/"/g, '').trim() : '';
      if (isValidJwt(cleanToken)) {
        localStorage.setItem('james_thew_guest_token', cleanToken);
        return cleanToken;
      }
    } catch {
    } finally {
      guestTokenPromise = null;
    }
    return null;
  })();

  return guestTokenPromise;
}

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      let token = useAuthStore.getState().token;

      if (!token && typeof window !== 'undefined') {
        const storedAuth = localStorage.getItem('james_thew_auth');
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          token = parsed?.state?.token || null;
        }
      }

      if (token && !isValidJwt(token)) {
        useAuthStore.getState().logout();
        token = null;
      }

      if (!token && config.method?.toLowerCase() === 'get' && !config.url?.includes('/api/Auth')) {
        token = await getGuestToken();
      }

      if (token && isValidJwt(token)) {
        const cleanBearer = token.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim();
        config.headers.Authorization = `Bearer ${cleanBearer}`;
      }
    } catch {
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiProblemDetails | string>) => {
    if (error.response?.status === 401) {
      try {
        const currentToken = useAuthStore.getState().token;
        if (currentToken) {
          useAuthStore.getState().logout();
        }
        if (typeof window !== 'undefined') {
          localStorage.removeItem('james_thew_guest_token');
        }
      } catch {
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected server error occurred. Please try again.'
): string {
  if (!error) return fallbackMessage;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data && typeof data === 'object') {
      const problem = data as ApiProblemDetails;

      if (problem.errors && typeof problem.errors === 'object') {
        const errorEntries = Object.values(problem.errors);
        if (errorEntries.length > 0) {
          const firstError = errorEntries[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            return firstError[0];
          }
          if (typeof firstError === 'string') {
            return firstError;
          }
        }
      }

      if (problem.detail && typeof problem.detail === 'string') {
        return problem.detail;
      }

      if (
        'message' in problem &&
        typeof (problem as any).message === 'string' &&
        (problem as any).message
      ) {
        return (problem as any).message;
      }

      if (problem.title && typeof problem.title === 'string') {
        return problem.title;
      }
    }

    if (error.message) {
      if (error.code === 'ECONNABORTED') {
        return 'Request timed out. Please check your internet connection.';
      }
      if (error.message === 'Network Error') {
        return 'Unable to reach backend server. Please verify network connectivity.';
      }
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export default apiClient;