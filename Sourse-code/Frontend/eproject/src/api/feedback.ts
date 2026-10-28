import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { FeedbackDto, FeedbackForCreation, FeedbackForUpdation } from '@/types/api';

export const feedbackApi = {
  getAll: async (recipeId?: number | string): Promise<FeedbackDto[]> => {
    const res = await apiClient.get<FeedbackDto[] | { data: FeedbackDto[] }>('/api/Feedback', {
      params: recipeId ? { recipeId } : undefined,
    });
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<FeedbackDto> => {
    const res = await apiClient.get<FeedbackDto>(`/api/Feedback/${id}`);
    return res.data;
  },

  create: async (dto: FeedbackForCreation): Promise<FeedbackDto> => {
    const res = await apiClient.post<FeedbackDto>('/api/Feedback', dto);
    return res.data;
  },

  update: async (id: number | string, dto: FeedbackForUpdation): Promise<FeedbackDto> => {
    const res = await apiClient.put<FeedbackDto>(`/api/Feedback/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Feedback/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useFeedback(recipeId?: number | string) {
  return useQuery({
    queryKey: ['feedback', recipeId],
    queryFn: () => feedbackApi.getAll(recipeId),
    staleTime: 1000 * 60 * 3,
  });
}

export function useFeedbackItem(id: number | string | undefined) {
  return useQuery({
    queryKey: ['feedback-item', id],
    queryFn: () => (id ? feedbackApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: FeedbackForCreation) => feedbackApi.create(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      if (variables.recipeId) {
        queryClient.invalidateQueries({ queryKey: ['recipe', variables.recipeId] });
      }
    },
  });
}

export function useUpdateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: FeedbackForUpdation }) =>
      feedbackApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => feedbackApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

export default feedbackApi;
