import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type { FAQDto, FAQForCreation, FAQForUpdation } from '@/types/api';

export const faqsApi = {
  getAll: async (): Promise<FAQDto[]> => {
    const res = await apiClient.get<FAQDto[] | { data: FAQDto[] }>('/api/FAQ');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<FAQDto> => {
    const res = await apiClient.get<FAQDto>(`/api/FAQ/${id}`);
    return res.data;
  },

  create: async (dto: FAQForCreation): Promise<FAQDto> => {
    const res = await apiClient.post<FAQDto>('/api/FAQ', dto);
    return res.data;
  },

  update: async (id: number | string, dto: FAQForUpdation): Promise<FAQDto> => {
    const res = await apiClient.put<FAQDto>(`/api/FAQ/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/FAQ/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useFaq(id: number | string | undefined) {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => (id ? faqsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: FAQForCreation) => faqsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: FAQForUpdation }) =>
      faqsApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq', variables.id] });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => faqsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export default faqsApi;
