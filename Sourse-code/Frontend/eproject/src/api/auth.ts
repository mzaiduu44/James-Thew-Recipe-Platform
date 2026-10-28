import { useMutation } from '@tanstack/react-query';
import { apiClient } from './client';
import type { LoginsRequest, LoginResponse } from '@/types/api';

export const authApi = {
  login: async (credentials: LoginsRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse | string>('/api/Auth', credentials);
    if (typeof response.data === 'string') {
      return { token: response.data };
    }
    return response.data;
  },
};

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginsRequest) => authApi.login(credentials),
  });
}

export default authApi;
