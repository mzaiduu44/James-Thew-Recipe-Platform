import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tipsApi } from '@/api/tips';
import type {
  TipDto,
  TipForCreation,
  TipForUpdation,
  TipQueryParams,
  CreateTipDto,
  UpdateTipDto,
} from '@/types/api';
import { useUiStore } from '@/store/uiStore';

export function normalizeTip(dto: TipDto | any) {
  if (!dto) return null;
  return {
    ...dto,
    id: String(dto.id),
    title: dto.title || '',
    // NOTE(access-control): Deliberate derivation from ActionType ('User' | 'Both' -> free).
    // TipDto from the backend has no native isFree property; do NOT "simplify" this
    // to dto.isFree or every tip's lock state will break.
    // See also backend TipController TODO(security) regarding frontend-only gating.
    isFree: dto.isFree !== undefined ? dto.isFree : dto.actionType === 'User' || dto.actionType === 'Both',
    actionType: dto.actionType || (dto.isFree ? 'Both' : 'Member'),
    categoryId: String(dto.categoryId || ''),
    categoryName: dto.categoryName || 'Culinary Technique',
    createdById: String(dto.createdById || '1'),
    createdByName: dto.createdByName || 'Chef James Thew',
    createdAt: dto.createdAt || new Date().toISOString(),
    tags: Array.isArray(dto.tags) ? dto.tags : typeof dto.tags === 'string' ? dto.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : ['Technique', 'Gastronomy'],
    likesCount: dto.likesCount || 15,
  };
}

export function useTips(params?: TipQueryParams) {
  return useQuery({
    queryKey: ['tips', params],
    queryFn: async () => {
      const list = await tipsApi.getAll(params);
      const normalized = (Array.isArray(list) ? list : []).map(normalizeTip);

      let filtered = normalized;
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
        );
      }
      if (params?.isFree !== undefined) {
        filtered = filtered.filter((t) => t.isFree === params.isFree);
      }
      if (params?.createdById) {
        filtered = filtered.filter(
          (t) => String(t.createdById) === String(params.createdById)
        );
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

export function useTip(id: string | number | undefined) {
  return useQuery({
    queryKey: ['tip', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await tipsApi.getById(id);
      return normalizeTip(data);
    },
    enabled: Boolean(id),
  });
}

export function useCreateTip() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async (dto: CreateTipDto) => {
      const payload: TipForCreation = {
        title: dto.title,
        description: dto.description,
        actionType: dto.actionType || (dto.isFree ? 'Both' : 'Member'),
        profileImage: dto.profileImage || '',
      };
      const created = await tipsApi.create(payload);
      return normalizeTip(created);
    },
    onSuccess: (newTip) => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'success',
        title: 'Culinary Tip Published',
        message: `"${newTip?.title || 'Tip'}" is now live.`,
      });
    },
    onError: (err: any) => {
      const is403 = err?.response?.status === 403;
      addToast({
        type: is403 ? 'warning' : 'error',
        title: is403 ? 'Executive Chef Approval Required' : 'Failed to Post Tip',
        message: is403
          ? 'Direct catalog publishing is reserved for Executive Chefs (Admins). VIP Members can participate in Grand Prix Contests and discussions!'
          : err?.response?.data?.message || err?.message || 'Error posting tip.',
      });
    },
  });
}

export function useUpdateTip() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string | number; dto: UpdateTipDto }) => {
      const payload: TipForUpdation = {
        id: Number(id),
        title: dto.title,
        description: dto.description,
        actionType: dto.actionType || (dto.isFree ? 'Both' : 'Member'),
        createdById: 1,
        profileImage: dto.profileImage || '',
      };
      const updated = await tipsApi.update(id, payload);
      return normalizeTip(updated);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['tip', updated?.id] });
      addToast({
        type: 'success',
        title: 'Tip Updated',
        message: `Updated "${updated?.title || 'Tip'}".`,
      });
    },
  });
}

export function useDeleteTip() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (id: string | number) => tipsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tips'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      addToast({
        type: 'info',
        title: 'Tip Removed',
        message: 'The tip was removed from the database.',
      });
    },
  });
}
