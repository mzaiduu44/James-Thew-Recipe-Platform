import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  RecipeIngredientDto,
  RecIngredientForCreation,
  RecIngredientForUpdation,
} from '@/types/api';

export const recipeIngredientsApi = {
  getAll: async (): Promise<RecipeIngredientDto[]> => {
    const res = await apiClient.get<RecipeIngredientDto[] | { data: RecipeIngredientDto[] }>(
      '/api/RecipeIngredient'
    );
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<RecipeIngredientDto> => {
    const res = await apiClient.get<RecipeIngredientDto>(`/api/RecipeIngredient/${id}`);
    return res.data;
  },

  create: async (dto: RecIngredientForCreation): Promise<any> => {
    const res = await apiClient.post('/api/RecipeIngredient', dto);
    return res.data;
  },

  update: async (id: number | string, dto: RecIngredientForUpdation): Promise<any> => {
    const res = await apiClient.put(`/api/RecipeIngredient/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/RecipeIngredient/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useRecipeIngredients(recipeName?: string) {
  return useQuery({
    queryKey: ['recipe-ingredients', recipeName],
    queryFn: async () => {
      const all = await recipeIngredientsApi.getAll();
      if (recipeName) {
        return all.filter((i) => i.recipeName?.toLowerCase() === recipeName.toLowerCase());
      }
      return all;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecipeIngredient(id: number | string | undefined) {
  return useQuery({
    queryKey: ['recipe-ingredient', id],
    queryFn: () => (id ? recipeIngredientsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateRecipeIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: RecIngredientForCreation) => recipeIngredientsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useUpdateRecipeIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: RecIngredientForUpdation }) =>
      recipeIngredientsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-ingredients'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
}

export function useDeleteRecipeIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => recipeIngredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipe-ingredients'] });
    },
  });
}

export default recipeIngredientsApi;
