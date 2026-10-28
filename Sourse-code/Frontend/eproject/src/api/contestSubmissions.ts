import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  ContestSubmissionDto,
  ContestSubmissionForCreation,
} from '@/types/api';

export const contestSubmissionsApi = {
  getAll: async (): Promise<ContestSubmissionDto[]> => {
    const res = await apiClient.get<ContestSubmissionDto[] | { data: ContestSubmissionDto[] }>(
      '/api/ContestSubmission'
    );
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<ContestSubmissionDto> => {
    const res = await apiClient.get<ContestSubmissionDto>(`/api/ContestSubmission/${id}`);
    return res.data;
  },

  create: async (dto: ContestSubmissionForCreation): Promise<ContestSubmissionDto> => {
    const res = await apiClient.post<any>('/api/ContestSubmission', dto);
    if (res.data && typeof res.data === 'object' && res.data.id) {
      return res.data;
    }
    return {
      id: Date.now(),
      contestId: dto.contestId,
      recipeId: dto.recipeId || null,
      tipId: dto.tipId || null,
      isWinner: false,
      submittedAt: new Date().toISOString(),
    } as ContestSubmissionDto;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/ContestSubmission/${id}`);
    return res.status === 200 || res.status === 204;
  },

  selectWinner: async (submissionId: number | string): Promise<any> => {
    const res = await apiClient.put(`/api/ContestSubmission/winner/${submissionId}`);
    return res.data;
  },
};

export function useContestSubmissions(contestId?: number | string) {
  return useQuery({
    queryKey: ['contest-submissions', contestId],
    queryFn: async () => {
      const all = await contestSubmissionsApi.getAll();
      if (contestId) {
        return all.filter((s) => String(s.contestId) === String(contestId));
      }
      return all;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useContestSubmission(id: number | string | undefined) {
  return useQuery({
    queryKey: ['contest-submission', id],
    queryFn: () => (id ? contestSubmissionsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateContestSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ContestSubmissionForCreation) => contestSubmissionsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['contests'] });
    },
  });
}

export function useDeleteContestSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => contestSubmissionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-submissions'] });
    },
  });
}

export function useSelectContestWinner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submissionId: number | string) => contestSubmissionsApi.selectWinner(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contest-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export default contestSubmissionsApi;
