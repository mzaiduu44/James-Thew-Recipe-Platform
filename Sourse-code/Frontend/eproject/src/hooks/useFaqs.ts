import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqsApi } from '@/api/faq';
import type {
  FAQDto,
  FAQForCreation,
  FAQForUpdation,
  CreateFaqDto,
  UpdateFaqDto,
} from '@/types/api';
import { useUiStore } from '@/store/uiStore';

export function normalizeFaq(dto: FAQDto | any) {
  if (!dto) return null;
  return {
    ...dto,
    id: String(dto.id),
    question: dto.question || '',
    answer: dto.answer || '',
    category: dto.category || 'General',
    order: dto.order || 0,
  };
}

export function useFaqs() {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const list = await faqsApi.getAll();
      return (Array.isArray(list) ? list : []).map(normalizeFaq);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFaq(id: string | number | undefined) {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await faqsApi.getById(id);
      return normalizeFaq(data);
    },
    enabled: Boolean(id),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async (dto: CreateFaqDto) => {
      const payload: FAQForCreation = {
        question: dto.question,
        answer: dto.answer,
        category: dto.category,
      };
      const created = await faqsApi.create(payload);
      return normalizeFaq(created);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      addToast({
        type: 'success',
        title: 'FAQ Added',
        message: 'New question and answer has been added to FAQ repository.',
      });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string | number; dto: UpdateFaqDto }) => {
      const payload: FAQForUpdation = {
        id: Number(id),
        question: dto.question,
        answer: dto.answer,
        category: dto.category,
      };
      const updated = await faqsApi.update(id, payload);
      return normalizeFaq(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      addToast({
        type: 'success',
        title: 'FAQ Updated',
        message: 'FAQ entry updated successfully.',
      });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (id: string | number) => faqsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      addToast({
        type: 'info',
        title: 'FAQ Deleted',
        message: 'FAQ entry was removed.',
      });
    },
  });
}
