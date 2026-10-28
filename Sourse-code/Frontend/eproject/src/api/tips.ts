import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  TipDto,
  TipForCreation,
  TipForUpdation,
  TipQueryParams,
} from '@/types/api';

export const tipsApi = {
  getAll: async (params?: TipQueryParams): Promise<TipDto[]> => {
    const res = await apiClient.get<TipDto[] | { data: TipDto[] }>('/api/Tip', { params });
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<TipDto> => {
    const res = await apiClient.get<TipDto>(`/api/Tip/${id}`);
    return res.data;
  },

  create: async (dto: TipForCreation): Promise<TipDto> => {
    const res = await apiClient.post<any>('/api/Tip', dto);
    if (res.data && typeof res.data === 'object' && res.data.id) {
      return res.data;
    }
    try {
      const all = await tipsApi.getAll();
      const match = all.find((t) => t.title?.trim().toLowerCase() === dto.title?.trim().toLowerCase());
      if (match) return match;
      if (all.length > 0) return all[all.length - 1];
    } catch {
      // Fallback
    }

    return {
      id: Date.now(),
      title: dto.title,
      description: dto.description,
      actionType: dto.actionType,
      profileImage: dto.profileImage,
    } as TipDto;
  },

  update: async (id: number | string, dto: TipForUpdation): Promise<TipDto> => {
    const res = await apiClient.put<any>(`/api/Tip/${id}`, dto);
    if (res.data && typeof res.data === 'object' && res.data.id) {
      return res.data;
    }
    return {
      id: Number(id),
      title: dto.title,
      description: dto.description,
      actionType: dto.actionType,
      profileImage: dto.profileImage,
    } as TipDto;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Tip/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useTips(params?: TipQueryParams) {
  return useQuery({
    queryKey: ['tips', params],
    queryFn: () => tipsApi.getAll(params),
    staleTime: 1000 * 60 * 3,
  });
}

export function useTip(id: number | string | undefined) {
  return useQuery({
    queryKey: ['tip', id],
    queryFn: () => (id ? tipsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: TipForCreation) => tipsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
    },
  });
}

export function useUpdateTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: TipForUpdation }) =>
      tipsApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['tip', variables.id] });
    },
  });
}

export function useDeleteTip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => tipsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
    },
  });
}

export default tipsApi;
