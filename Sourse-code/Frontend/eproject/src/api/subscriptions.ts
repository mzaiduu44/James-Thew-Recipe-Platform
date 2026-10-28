import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  SubscriptionDto,
  SubscriptionForCreation,
  SubscriptionForUpdation,
} from '@/types/api';

export const subscriptionsApi = {
  getAll: async (): Promise<SubscriptionDto[]> => {
    const res = await apiClient.get<SubscriptionDto[] | { data: SubscriptionDto[] }>(
      '/api/Subscription'
    );
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<SubscriptionDto> => {
    const res = await apiClient.get<SubscriptionDto>(`/api/Subscription/${id}`);
    return res.data;
  },

  create: async (dto: SubscriptionForCreation): Promise<SubscriptionDto> => {
    const res = await apiClient.post<SubscriptionDto>('/api/Subscription', dto);
    return res.data;
  },


  update: async (id: number | string, dto: SubscriptionForUpdation): Promise<SubscriptionDto> => {
    const payload: SubscriptionForUpdation = {
      planType: dto.planType,
      amount: dto.amount,
    };
    const res = await apiClient.put<SubscriptionDto>(`/api/Subscription/${id}`, payload);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Subscription/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => subscriptionsApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubscription(id: number | string | undefined) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => (id ? subscriptionsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: SubscriptionForCreation) => subscriptionsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: SubscriptionForUpdation }) =>
      subscriptionsApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => subscriptionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

export default subscriptionsApi;
