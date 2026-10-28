import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { RoleDto, RoleForCreation, RoleForUpdation } from '@/types/api';

export const rolesApi = {
  getAll: async (): Promise<RoleDto[]> => {
    const res = await apiClient.get<RoleDto[] | { data: RoleDto[] }>('/api/Role');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<RoleDto> => {
    const res = await apiClient.get<RoleDto>(`/api/Role/${id}`);
    return res.data;
  },

  create: async (dto: RoleForCreation): Promise<boolean> => {
    const res = await apiClient.post<boolean>('/api/Role', dto);
    return Boolean(res.data);
  },

  update: async (id: number | string, dto: RoleForUpdation): Promise<boolean> => {
    const res = await apiClient.put<boolean>(`/api/Role/${id}`, dto);
    return Boolean(res.data);
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete<boolean>(`/api/Role/${id}`);
    return Boolean(res.data);
  },
};

export function useRolesQuery() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getAll(),
    staleTime: 1000 * 60 * 30, 
  });
}

export const useRoles = useRolesQuery;

export function useRole(id: number | string | undefined) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => (id ? rolesApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RoleForCreation) => rolesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: RoleForUpdation }) =>
      rolesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export default rolesApi;
