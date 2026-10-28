import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  ContestDto,
  ContestForCreation,
  ContestForUpdation,
  ContestQueryParams,
} from '@/types/api';

export const contestsApi = {
  getAll: async (params?: ContestQueryParams): Promise<ContestDto[]> => {
    const res = await apiClient.get<ContestDto[] | { data: ContestDto[] }>('/api/Contest', { params });
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<ContestDto> => {
    const res = await apiClient.get<ContestDto>(`/api/Contest/${id}`);
    return res.data;
  },

  create: async (dto: ContestForCreation): Promise<ContestDto> => {
    const res = await apiClient.post<ContestDto>('/api/Contest', dto);
    return res.data;
  },

  update: async (id: number | string, dto: ContestForUpdation): Promise<ContestDto> => {
    const res = await apiClient.put<ContestDto>(`/api/Contest/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Contest/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useContests(params?: ContestQueryParams) {
  return useQuery({
    queryKey: ['contests', params],
    queryFn: () => contestsApi.getAll(params),
    staleTime: 1000 * 60 * 3,
  });
}

export function useContest(id: number | string | undefined) {
  return useQuery({
    queryKey: ['contest', id],
    queryFn: () => (id ? contestsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateContest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ContestForCreation) => contestsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
    },
  });
}

export function useUpdateContest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: ContestForUpdation }) =>
      contestsApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['contest', variables.id] });
    },
  });
}

export function useDeleteContest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => contestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
    },
  });
}

export default contestsApi;
