import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/api/announcements';
import type {
  AnnouncementDto,
  AnnouncementForCreation,
  AnnouncementForUpdation,
  CreateAnnouncementDto,
} from '@/types/api';
import { useUiStore } from '@/store/uiStore';

export function normalizeAnnouncement(dto: AnnouncementDto | any) {
  if (!dto) return null;
  return {
    ...dto,
    id: String(dto.id),
    title: dto.title || '',
    description: dto.description || '',
    contestId: dto.contestId ? String(dto.contestId) : undefined,
    contestTitle: dto.contestTitle || '',
    winnerSubmissionId: dto.winnerSubmissionId ? String(dto.winnerSubmissionId) : undefined,
    winnerName: dto.winnerName || '',
    winningEntryTitle: dto.winningEntryTitle || dto.recipeTitle || dto.tipTitle || '',
    winningEntryType: dto.winningEntryType || (dto.recipeTitle ? 'Recipe' : dto.tipTitle ? 'Tip' : undefined),
    createdById: String(dto.createdById || '1'),
    createdByName: dto.createdByName || 'Chef James Thew',
    createdAt: dto.createdAt || new Date().toISOString(),
    type: dto.type || (dto.winnerName ? 'ContestWinner' : 'General'),
    badgeText: dto.badgeText || (dto.type === 'ContestWinner' ? 'Contest Champion' : 'Studio Update'),
  };
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const list = await announcementsApi.getAll();
      return (Array.isArray(list) ? list : []).map(normalizeAnnouncement);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useAnnouncement(id: string | number | undefined) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await announcementsApi.getById(id);
      return normalizeAnnouncement(data);
    },
    enabled: Boolean(id),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async (dto: CreateAnnouncementDto) => {
      const payload: AnnouncementForCreation = {
        title: dto.title,
        description: dto.description,
        contestId: dto.contestId ? Number(dto.contestId) : null,
        winnerSubmissionId: dto.winnerSubmissionId ? Number(dto.winnerSubmissionId) : null,
      };
      const created = await announcementsApi.create(payload);
      return normalizeAnnouncement(created);
    },
    onSuccess: (ann) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      addToast({
        type: 'success',
        title: 'Announcement Published',
        message: `"${ann?.title || 'Announcement'}" is now visible to the public.`,
      });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: async ({ id, dto }: { id: string | number; dto: Partial<AnnouncementForCreation> }) => {
      const payload: AnnouncementForUpdation = {
        id: Number(id),
        title: dto.title,
        description: dto.description,
        contestId: dto.contestId ? Number(dto.contestId) : null,
        winnerSubmissionId: dto.winnerSubmissionId ? Number(dto.winnerSubmissionId) : null,
      };
      const updated = await announcementsApi.update(id, payload);
      return normalizeAnnouncement(updated);
    },
    onSuccess: (ann) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      addToast({
        type: 'success',
        title: 'Announcement Updated',
        message: `"${ann?.title || 'Announcement'}" was updated.`,
      });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { addToast } = useUiStore();

  return useMutation({
    mutationFn: (id: string | number) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      addToast({
        type: 'info',
        title: 'Announcement Deleted',
        message: 'The announcement was removed.',
      });
    },
  });
}
