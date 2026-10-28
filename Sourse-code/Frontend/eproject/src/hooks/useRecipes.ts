import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/api/recipes';
import { categoriesApi } from '@/api/categories';
import type {
  RecipeDto,
  RecipeForCreation,
  RecipeForUpdation,
  RecipeQueryParams,
  CreateRecipeDto,
  UpdateRecipeDto,
} from '@/types/api';
import { useUiStore } from '@/store/uiStore';
import { normalizeImageUrl } from '@/components/shared/AppImage';

export function normalizeRecipe(dto: RecipeDto | any) {
  if (!dto) return null;
  const rawProcedure = dto.procedure;
  const procedureArray = Array.isArray(rawProcedure)
    ? rawProcedure
    : typeof rawProcedure === 'string'
    ? rawProcedure.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  const rawIngredients = dto.ingredients;
  const ingredientsArray = Array.isArray(rawIngredients)
    ? rawIngredients
    : typeof rawIngredients === 'string'
    ? rawIngredients.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  const rawImg = (dto.imagePaths && dto.imagePaths[0]) || dto.imagePath;
  const normalizedImg = normalizeImageUrl(rawImg);

  return {
    ...dto,
    id: String(dto.id),
    title: dto.title || '',
    description: dto.description || '',
    procedure: procedureArray,
    ingredients: ingredientsArray,
    imagePath: normalizedImg || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    isFree: dto.isFree !== undefined ? dto.isFree : dto.actionType === 'User' || dto.actionType === 'Both',
    actionType: dto.actionType || (dto.isFree ? 'Both' : 'Member'),
    categoryId: String(dto.categoryId || ''),
    categoryName: dto.categoryName || 'Culinary',
    createdById: String(dto.createdById || '1'),
    createdByName: dto.createdByName || '',
    createdAt: dto.createdAt || new Date().toISOString(),
    prepTimeMinutes: dto.prepTimeMinutes ?? 20,
    cookTimeMinutes: dto.cookTimeMinutes ?? 30,
    servings: dto.servings ?? 4,
    difficulty: dto.difficulty || 'Intermediate',
    averageRating: dto.averageRating || 5.0,
    ratingsCount: dto.ratingsCount || 12,
  };
}

export function useRecipes(params?: RecipeQueryParams) {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: async () => {
      const items = await recipesApi.getAll(params);
      const normalized = (Array.isArray(items) ? items : []).map(normalizeRecipe);
      
      let filtered = normalized;
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.ingredients.some((ing: string) => ing.toLowerCase().includes(q))
        );
      }
      if (params?.categoryId && params.categoryId !== 'all') {
        filtered = filtered.filter(
          (r) => String(r.categoryId) === String(params.categoryId)
        );
      }
      if (params?.isFree !== undefined) {
        filtered = filtered.filter((r) => r.isFree === params.isFree);
      }
      if (params?.createdById) {
        filtered = filtered.filter(
          (r) => String(r.createdById) === String(params.createdById)
        );
      }
      if (params?.sortBy === 'rating') {
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      }

      return {
        data: filtered,
        total: filtered.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || filtered.length,
        totalPages: 1,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useRecipe(id: string | number | undefined) {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await recipesApi.getById(id);
      const normalized = normalizeRecipe(data);

      if (normalized && (!normalized.ingredients || normalized.ingredients.length === 0)) {
        try {
          const { recipeIngredientsApi } = await import('@/api/recipeIngredients');
          const allIngredients = await recipeIngredientsApi.getAll();
          const recipeIngredients = allIngredients.filter(
            (ri) => ri.recipeName?.toLowerCase() === normalized.title.toLowerCase()
          );
          if (recipeIngredients.length > 0) {
            normalized.ingredients = recipeIngredients.map(
              (ri) => [ri.quantity, ri.ingredientName].filter(Boolean).join(' ').trim() || ri.ingredientName || ''
            );
          }
        } catch {
          // Ingredient fetch is supplementary — don't block recipe display
        }
      }

      return normalized;
    },
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const list = await categoriesApi.getAll();
      return (Array.isArray(list) ? list : []).map((c) => ({
        ...c,
        id: String(c.id),
        name: c.categoryName || (c as any).name || 'Category',
        categoryName: c.categoryName || (c as any).name || 'Category',
        profileImage: c.profileImage || '',
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async (dto: CreateRecipeDto) => {
      const payload: RecipeForCreation = {
        title: dto.title,
        description: dto.description,
        procedure: Array.isArray(dto.procedure) ? dto.procedure.join('\n') : dto.procedure,
        actionType: dto.actionType || (dto.isFree ? 'Both' : 'Member'),
        categoryId: Number(dto.categoryId) || 1,
        imagePaths: dto.imagePaths || (dto.imagePath ? [dto.imagePath] : []),
      };
      const created = await recipesApi.create(payload);
      const normalized = normalizeRecipe(created);

      // Post-create: Add ingredients to the separate RecipeIngredient table
      if (dto.ingredients && dto.ingredients.length > 0 && normalized?.title) {
        try {
          const { recipeIngredientsApi } = await import('@/api/recipeIngredients');
          await recipeIngredientsApi.create({
            recipeName: normalized.title,
            recipeitem: dto.ingredients.map((ing) => ({
              ingredientName: ing,
              quantity: '',
            })),
          });
        } catch {
          // Ingredient creation is supplementary — don't fail the recipe
        }
      }

      return normalized;
    },
    onSuccess: (newRecipe) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recipe-ingredients'] });
      addToast({
        type: 'success',
        title: 'Recipe Published',
        message: `"${newRecipe?.title || 'Recipe'}" has been successfully added.`,
      });
    },
    onError: (err: any) => {
      const is403 = err?.response?.status === 403;
      addToast({
        type: is403 ? 'warning' : 'error',
        title: is403 ? 'Executive Chef Approval Required' : 'Creation Failed',
        message: is403
          ? 'Direct catalog publishing is reserved for Executive Chefs (Admins). VIP Members can enter their formulations into Grand Prix Contests!'
          : err?.response?.data?.message || err?.message || 'Could not create recipe. Please try again.',
      });
    },
  });
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string | number; dto: UpdateRecipeDto }) => {
      const payload: RecipeForUpdation = {
        id: Number(id),
        title: dto.title,
        description: dto.description,
        procedure: Array.isArray(dto.procedure) ? dto.procedure.join('\n') : dto.procedure,
        actionType: dto.actionType || (dto.isFree ? 'Both' : 'Member'),
        categoryId: Number(dto.categoryId) || 1,
        imagePaths: dto.imagePaths || (dto.imagePath ? [dto.imagePath] : []),
      };
      const updated = await recipesApi.update(id, payload);
      return normalizeRecipe(updated);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', updated?.id] });
      addToast({
        type: 'success',
        title: 'Recipe Updated',
        message: `Changes to "${updated?.title || 'Recipe'}" were saved.`,
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: err?.response?.data?.message || 'Failed to update recipe.',
      });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (id: string | number) => recipesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'info',
        title: 'Recipe Deleted',
        message: 'The recipe has been removed.',
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: err?.response?.data?.message || 'Failed to delete recipe.',
      });
    },
  });
}
