import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackApi } from '@/api/feedback';
import { siteFeedbackApi } from '@/api/siteFeedback';
import type { FeedbackDto, SiteFeedbackDto, CreateFeedbackDto } from '@/types/api';
import { useUiStore } from '@/store/uiStore';

export function normalizeFeedback(dto: FeedbackDto | SiteFeedbackDto | any) {
  if (!dto) return null;
  return {
    ...dto,
    id: String(dto.id),
    recipeId: dto.recipeId ? String(dto.recipeId) : undefined,
    recipeTitle: dto.recipeTitle || '',
    userId: dto.userId ? String(dto.userId) : undefined,
    userName: dto.userName || 'Culinary Connoisseur',
    userEmail: dto.userEmail || '',
    comment: dto.comment || '',
    rating: Number(dto.rating) || 5,
    feedbackType: dto.recipeId ? 'Recipe' : 'General',
    createdAt: dto.createdAt || new Date().toISOString(),
    userAvatar: dto.userAvatar || '',
  };
}

export function useFeedback(recipeId?: string | number) {
  return useQuery({
    queryKey: ['feedback', recipeId],
    queryFn: async () => {
      if (recipeId) {
        // Fetch feedback, then ensure client-side filtering by recipeId
        // in case the backend doesn't support query-string filtering
        const list = await feedbackApi.getAll(recipeId);
        const normalized = (Array.isArray(list) ? list : []).map(normalizeFeedback);
        return normalized.filter(
          (fb) => fb && fb.recipeId && String(fb.recipeId) === String(recipeId)
        );
      }
      const [recipeFb, siteFb] = await Promise.all([
        feedbackApi.getAll().catch(() => []),
        siteFeedbackApi.getAll().catch(() => []),
      ]);
      const combined = [
        ...(Array.isArray(recipeFb) ? recipeFb : []),
        ...(Array.isArray(siteFb) ? siteFb : []),
      ].map(normalizeFeedback);
      return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async (dto: CreateFeedbackDto) => {
      if (dto.recipeId && dto.feedbackType !== 'General') {
        const res = await feedbackApi.create({
          recipeId: Number(dto.recipeId),
          comment: dto.comment,
          rating: dto.rating,
        });
        return normalizeFeedback(res);
      } else {
        const res = await siteFeedbackApi.create({
          comment: dto.comment,
          rating: dto.rating,
        });
        return normalizeFeedback(res);
      }
    },
    onSuccess: (fb) => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['site-feedback'] });
      if (fb?.recipeId) {
        queryClient.invalidateQueries({ queryKey: ['recipe', fb.recipeId] });
        queryClient.invalidateQueries({ queryKey: ['recipes'] });
      }
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'success',
        title: 'Feedback Received',
        message: 'Thank you for your valuable culinary review and rating!',
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Review Submission Failed',
        message: err?.response?.data?.message || 'Could not post feedback.',
      });
    },
  });
}

export function useDeleteFeedback() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ id, isSiteFeedback }: { id: string | number; isSiteFeedback?: boolean }) => {
      if (isSiteFeedback) {
        return siteFeedbackApi.delete(id);
      }
      return feedbackApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['site-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'info',
        title: 'Feedback Removed',
        message: 'The feedback record was removed.',
      });
    },
  });
}
