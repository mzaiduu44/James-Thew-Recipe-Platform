import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  SiteFeedbackDto,
  SiteFeedbackForCreation,
  SiteFeedbackForUpdation,
} from '@/types/api';

export const siteFeedbackApi = {
  getAll: async (): Promise<SiteFeedbackDto[]> => {
    const res = await apiClient.get<SiteFeedbackDto[] | { data: SiteFeedbackDto[] }>(
      '/api/SiteFeedback'
    );
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<SiteFeedbackDto> => {
    const res = await apiClient.get<SiteFeedbackDto>(`/api/SiteFeedback/${id}`);
    return res.data;
  },

  create: async (dto: SiteFeedbackForCreation): Promise<SiteFeedbackDto> => {
    const res = await apiClient.post<SiteFeedbackDto>('/api/SiteFeedback', dto);
    return res.data;
  },

  update: async (id: number | string, dto: SiteFeedbackForUpdation): Promise<SiteFeedbackDto> => {
    const res = await apiClient.put<SiteFeedbackDto>(`/api/SiteFeedback/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/SiteFeedback/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useSiteFeedback() {
  return useQuery({
    queryKey: ['site-feedback'],
    queryFn: () => siteFeedbackApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSiteFeedbackItem(id: number | string | undefined) {
  return useQuery({
    queryKey: ['site-feedback-item', id],
    queryFn: () => (id ? siteFeedbackApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateSiteFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SiteFeedbackForCreation) => siteFeedbackApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-feedback'] });
    },
  });
}

export function useUpdateSiteFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: SiteFeedbackForUpdation }) =>
      siteFeedbackApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-feedback'] });
    },
  });
}

export function useDeleteSiteFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => siteFeedbackApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-feedback'] });
    },
  });
}

export default siteFeedbackApi;
