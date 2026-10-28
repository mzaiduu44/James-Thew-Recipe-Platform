import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  RecipeDto,
  RecipeForCreation,
  RecipeForUpdation,
  RecipeQueryParams,
} from '@/types/api';

export type { RecipeDto, RecipeForCreation, RecipeForUpdation, RecipeQueryParams };


export const recipesApi = {
  getAll: async (params?: RecipeQueryParams): Promise<RecipeDto[]> => {
    const res = await apiClient.get<RecipeDto[] | { data: RecipeDto[] }>('/api/Recipe', { params });
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<RecipeDto> => {
    const res = await apiClient.get<RecipeDto>(`/api/Recipe/${id}`);
    return res.data;
  },

  create: async (dto: RecipeForCreation): Promise<RecipeDto> => {
    const res = await apiClient.post<any>('/api/Recipe', dto);
    if (res.data && typeof res.data === 'object' && res.data.id) {
      return res.data;
    }
    try {
      const all = await recipesApi.getAll();
      const match = all.find((r) => r.title?.trim().toLowerCase() === dto.title?.trim().toLowerCase());
      if (match) return match;
      if (all.length > 0) return all[all.length - 1];
    } catch {
      // Fallback
    }

    return {
      id: Date.now(),
      title: dto.title,
      description: dto.description,
      procedure: dto.procedure,
      actionType: dto.actionType,
      categoryId: dto.categoryId,
      imagePaths: dto.imagePaths,
    } as RecipeDto;
  },

  update: async (id: number | string, dto: RecipeForUpdation): Promise<RecipeDto> => {
    const res = await apiClient.put<any>(`/api/Recipe/${id}`, dto);
    if (res.data && typeof res.data === 'object' && res.data.id) {
      return res.data;
    }
    return {
      id: Number(id),
      title: dto.title,
      description: dto.description,
      procedure: dto.procedure,
      actionType: dto.actionType,
      categoryId: dto.categoryId,
      imagePaths: dto.imagePaths,
    } as RecipeDto;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Recipe/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useRecipes(params?: RecipeQueryParams) {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => recipesApi.getAll(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useRecipe(id: number | string | undefined) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => (id ? recipesApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RecipeForCreation) => recipesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: RecipeForUpdation }) =>
      recipesApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', variables.id] });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => recipesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export default recipesApi;
