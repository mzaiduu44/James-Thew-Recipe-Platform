import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  CategoryDto,
  CategoryForCreation,
  CategoryForUpdation,
} from '@/types/api';

export const categoriesApi = {
  getAll: async (): Promise<CategoryDto[]> => {
    const res = await apiClient.get<CategoryDto[] | { data: CategoryDto[] }>('/api/Category');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<CategoryDto> => {
    const res = await apiClient.get<CategoryDto>(`/api/Category/${id}`);
    return res.data;
  },

  create: async (dto: CategoryForCreation): Promise<CategoryDto> => {
    const res = await apiClient.post<CategoryDto>('/api/Category', dto);
    return res.data;
  },

  update: async (id: number | string, dto: CategoryForUpdation): Promise<CategoryDto> => {
    const res = await apiClient.put<CategoryDto>(`/api/Category/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Category/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategory(id: number | string | undefined) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => (id ? categoriesApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CategoryForCreation) => categoriesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: CategoryForUpdation }) =>
      categoriesApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export default categoriesApi;
