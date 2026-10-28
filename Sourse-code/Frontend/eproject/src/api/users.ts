import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { UserDto, UserForCreation, UserForUpdation } from '@/types/api';

export const usersApi = {
  getAll: async (): Promise<UserDto[]> => {
    const res = await apiClient.get<UserDto[] | { data: UserDto[] }>('/api/User');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<UserDto> => {
    const res = await apiClient.get<UserDto>(`/api/User/${id}`);
    return res.data;
  },

  create: async (dto: UserForCreation): Promise<UserDto> => {
    const res = await apiClient.post<UserDto>('/api/User', dto);
    return res.data;
  },

  update: async (id: number | string, dto: UserForUpdation): Promise<UserDto> => {
    const res = await apiClient.put<UserDto>(`/api/User/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/User/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUser(id: number | string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? usersApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UserForCreation) => usersApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: UserForUpdation }) =>
      usersApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export default usersApi;
