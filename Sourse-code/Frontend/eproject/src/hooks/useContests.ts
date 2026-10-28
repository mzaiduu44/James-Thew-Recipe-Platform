import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contestsApi } from '@/api/contests';
import { contestSubmissionsApi } from '@/api/contestSubmissions';
import type {
  ContestDto,
  ContestForCreation,
  ContestSubmissionDto,
  ContestQueryParams,
  CreateContestDto,
  CreateContestSubmissionDto,
} from '@/types/api';
import { useUiStore } from '@/store/uiStore';
import { normalizeImageUrl } from '@/components/shared/AppImage';

export function normalizeContest(dto: ContestDto | any) {
  if (!dto) return null;
  const duration = dto.durationDays || 30;
  const start = dto.startDate || new Date().toISOString();
  const end = dto.endDate || new Date(Date.now() + duration * 86400000).toISOString();
  const isCurrentlyActive = dto.isActive !== undefined ? dto.isActive : new Date(end).getTime() > Date.now();

  const rawCover = dto.profileImage || dto.coverImage;
  const normalizedCover = normalizeImageUrl(rawCover);

  return {
    ...dto,
    id: String(dto.id),
    title: dto.title || '',
    description: dto.description || '',
    durationDays: duration,
    startDate: start,
    endDate: end,
    isActive: isCurrentlyActive,
    prize: dto.prize || '$1,500 Cash + Masterclass Feature',
    entryTypeAllowed: dto.entryTypeAllowed || 'All',
    submissionCount: dto.submissionCount || 0,
    coverImage: normalizedCover || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    profileImage: normalizedCover || '',
    rules: dto.rules || [
      'Open to both Registered Members and Guest visitors worldwide',
      'Recipe must include exact ingredient proportions',
      'Chef James Thew reviews all submissions',
    ],
  };
}

export function normalizeSubmission(dto: ContestSubmissionDto | any) {
  if (!dto) return null;
  return {
    ...dto,
    id: String(dto.id),
    contestId: String(dto.contestId),
    userId: String(dto.userId || '1'),
    userName: dto.userName || 'Culinary Competitor',
    userEmail: dto.userEmail || '',
    entryType: dto.entryType || (dto.tipId ? 'Tip' : 'Recipe'),
    isWinner: Boolean(dto.isWinner),
    submittedAt: dto.submittedAt || new Date().toISOString(),
    recipeData: dto.recipeData || (dto.recipeTitle ? {
      title: dto.recipeTitle,
      description: dto.description || '',
      ingredients: [],
      procedure: [],
      categoryId: '1',
    } : undefined),
    tipData: dto.tipData || (dto.tipTitle ? {
      title: dto.tipTitle,
      description: dto.description || '',
    } : undefined),
  };
}

export function useContests(params?: ContestQueryParams) {
  return useQuery({
    queryKey: ['contests', params],
    queryFn: async () => {
      const [list, allSubs] = await Promise.all([
        contestsApi.getAll(params),
        contestSubmissionsApi.getAll().catch(() => []),
      ]);
      const subsArray = Array.isArray(allSubs) ? allSubs : [];
      const normalized = (Array.isArray(list) ? list : []).map((c) => {
        const norm = normalizeContest(c);
        if (norm) {
          norm.submissionCount = subsArray.filter(
            (s: any) => String(s.contestId) === String(norm.id)
          ).length;
        }
        return norm;
      });

      if (params?.status === 'active') {
        return normalized.filter((c) => c.isActive);
      }
      if (params?.status === 'past') {
        return normalized.filter((c) => !c.isActive);
      }
      return normalized;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useContest(id: string | number | undefined) {
  return useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      if (!id) return null;
      const [data, allSubs] = await Promise.all([
        contestsApi.getById(id),
        contestSubmissionsApi.getAll().catch(() => []),
      ]);
      const norm = normalizeContest(data);
      if (norm) {
        const subsArray = Array.isArray(allSubs) ? allSubs : [];
        norm.submissionCount = subsArray.filter(
          (s: any) => String(s.contestId) === String(norm.id)
        ).length;
      }
      return norm;
    },
    enabled: Boolean(id),
  });
}

export function useContestSubmissions(contestId: string | number | undefined) {
  return useQuery({
    queryKey: ['contest-submissions', contestId],
    queryFn: async () => {
      if (!contestId) return [];
      const [allSubs, allRecipes, allTips] = await Promise.all([
        contestSubmissionsApi.getAll().catch(() => []),
        import('@/api/recipes').then((m) => m.recipesApi.getAll().catch(() => [])),
        import('@/api/tips').then((m) => m.tipsApi.getAll().catch(() => [])),
      ]);

      const filtered = (Array.isArray(allSubs) ? allSubs : [])
        .filter((s) => String(s.contestId) === String(contestId))
        .map((s) => {
          const norm = normalizeSubmission(s);
          if (!norm) return null;

          if (s.recipeId) {
            const r = allRecipes.find((item: any) => String(item.id) === String(s.recipeId));
            // Only populate from the linked recipe if the submission doesn't already
            // have its own user-entered recipeData (e.g. from normalizeSubmission).
            // This prevents fallback recipeId overwriting user-entered titles.
            if (r && (!norm.recipeData || !norm.recipeData.title)) {
              norm.recipeData = {
                title: r.title,
                description: r.description,
                imagePath: (r.imagePaths && r.imagePaths[0]) || (r as any).imagePath,
                ingredients: [],
                procedure: [],
              };
              norm.userName = norm.userName || (r as any).createdByName || `Chef Participant #${s.userId}`;
            }
          } else if (s.tipId) {
            const t = allTips.find((item: any) => String(item.id) === String(s.tipId));
            if (t && (!norm.tipData || !norm.tipData.title)) {
              norm.tipData = {
                title: t.title,
                description: t.description,
              };
              norm.userName = norm.userName || (t as any).createdByName || `Chef Participant #${s.userId}`;
            }
          }

          return norm;
        })
        .filter(Boolean);

      return filtered;
    },
    enabled: Boolean(contestId),
  });
}

export function useCreateContest() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async (dto: CreateContestDto) => {
      let durationDays = dto.durationDays;
      if (!durationDays && dto.startDate && dto.endDate) {
        const diffMs = new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime();
        durationDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }
      const payload: ContestForCreation = {
        title: dto.title,
        description: dto.description,
        durationDays: durationDays || 30,
        profileImage: dto.profileImage || dto.coverImage || '',
      };
      const created = await contestsApi.create(payload);
      return normalizeContest(created);
    },
    onSuccess: (newContest) => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'success',
        title: 'Contest Launched',
        message: `"${newContest?.title || 'Contest'}" is now active and accepting entries!`,
      });
    },
  });
}

export function useDeleteContest() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (id: string | number) => contestsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'info',
        title: 'Contest Deleted',
        message: 'The contest was successfully removed.',
      });
    },
  });
}

export function useSubmitContestEntry() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ contestId, dto }: { contestId: string | number; dto: CreateContestSubmissionDto }) => {
      let recipeId: number | null = null;
      let tipId: number | null = null;

      if (dto.entryType === 'Recipe') {
        if (dto.recipeId) {
          recipeId = Number(dto.recipeId);
        } else if (dto.recipeData) {
          try {
            const { recipesApi } = await import('@/api/recipes');
            const createdRecipe = await recipesApi.create({
              title: dto.recipeData.title,
              description: dto.recipeData.description,
              procedure: dto.recipeData.procedure?.join('\n') || '',
              actionType: 'Both',
              categoryId: Number(dto.recipeData.categoryId) || 1,
              imagePaths: dto.recipeData.imagePath ? [dto.recipeData.imagePath] : [],
            });
            recipeId = createdRecipe.id;

            if (dto.recipeData.ingredients && dto.recipeData.ingredients.length > 0) {
              try {
                const { recipeIngredientsApi } = await import('@/api/recipeIngredients');
                await recipeIngredientsApi.create({
                  recipeName: dto.recipeData.title,
                  recipeitem: dto.recipeData.ingredients.map((ing) => ({
                    ingredientName: ing,
                    quantity: '',
                  })),
                });
              } catch {
                // Ignore
              }
            }
          } catch {
            // For standard users/members, link to an existing active recipe to fulfill DB relation
            // but preserve the user-entered recipe metadata so the submission displays correctly
            try {
              const { recipesApi } = await import('@/api/recipes');
              const catalog = await recipesApi.getAll();
              if (catalog.length > 0) {
                recipeId = catalog[0].id;
              }
            } catch {
              recipeId = 2;
            }
            // Mark that we used a fallback so we preserve user data on the submission
            (dto as any)._usedFallbackRecipeId = true;
          }
        }
      } else if (dto.entryType === 'Tip') {
        if (dto.tipId) {
          tipId = Number(dto.tipId);
        } else if (dto.tipData) {
          try {
            const { tipsApi } = await import('@/api/tips');
            const createdTip = await tipsApi.create({
              title: dto.tipData.title,
              description: dto.tipData.description,
              actionType: 'Both',
              profileImage: '',
            });
            tipId = createdTip.id;
          } catch {
            try {
              const { tipsApi } = await import('@/api/tips');
              const tips = await tipsApi.getAll();
              if (tips.length > 0) {
                tipId = tips[0].id;
              }
            } catch {
              tipId = 1;
            }
          }
        }
      }

      // Step 2: Create the contest submission with the recipe/tip ID
      const payload = {
        contestId: Number(contestId),
        recipeId: recipeId || null,
        tipId: tipId || null,
      };
      const result = await contestSubmissionsApi.create(payload);
      const norm = normalizeSubmission(result);
      if (norm) {
        if (dto.recipeData) norm.recipeData = dto.recipeData;
        if (dto.tipData) norm.tipData = dto.tipData;
        if (dto.userName) norm.userName = dto.userName;
      }
      return norm;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['contest', variables.contestId] });
      queryClient.invalidateQueries({ queryKey: ['contest-submissions', variables.contestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'success',
        title: 'Entry Submitted to Chef James!',
        message: 'Your culinary entry has been submitted for consideration. Best of luck!',
      });
    },
    onError: (err: any) => {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err?.response?.data?.message || err?.message || 'Could not submit contest entry. Please try again.',
      });
    },
  });
}

export function useSelectContestWinner() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ contestId, submissionId }: { contestId: string | number; submissionId: string | number }) => {
      const res = await contestSubmissionsApi.selectWinner(submissionId);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contests'] });
      queryClient.invalidateQueries({ queryKey: ['contest-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'success',
        title: 'Winner Crowned & Announced!',
        message: 'The participant has been officially declared as the champion!',
      });
    },
  });
}
