import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  IngredientDto,
  IngredientForCreation,
  IngredientForUpdation,
} from '@/types/api';

export const ingredientsApi = {
  getAll: async (): Promise<IngredientDto[]> => {
    const res = await apiClient.get<IngredientDto[] | { data: IngredientDto[] }>('/api/Ingredient');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<IngredientDto> => {
    const res = await apiClient.get<IngredientDto>(`/api/Ingredient/${id}`);
    return res.data;
  },

  create: async (dto: IngredientForCreation): Promise<IngredientDto> => {
    const res = await apiClient.post<IngredientDto>('/api/Ingredient', dto);
    return res.data;
  },

  update: async (id: number | string, dto: IngredientForUpdation): Promise<IngredientDto> => {
    const res = await apiClient.put<IngredientDto>(`/api/Ingredient/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Ingredient/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useIngredients() {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: () => ingredientsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useIngredient(id: number | string | undefined) {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: () => (id ? ingredientsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: IngredientForCreation) => ingredientsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: IngredientForUpdation }) =>
      ingredientsApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['ingredient', variables.id] });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => ingredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });
}

export default ingredientsApi;
