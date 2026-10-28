import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  AnnouncementDto,
  AnnouncementForCreation,
  AnnouncementForUpdation,
} from '@/types/api';

export const announcementsApi = {
  getAll: async (): Promise<AnnouncementDto[]> => {
    const res = await apiClient.get<AnnouncementDto[] | { data: AnnouncementDto[] }>('/api/Announcement');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray((res.data as any).data)) return (res.data as any).data;
    return [];
  },

  getById: async (id: number | string): Promise<AnnouncementDto> => {
    const res = await apiClient.get<AnnouncementDto>(`/api/Announcement/${id}`);
    return res.data;
  },

  create: async (dto: AnnouncementForCreation): Promise<AnnouncementDto> => {
    const res = await apiClient.post<AnnouncementDto>('/api/Announcement', dto);
    return res.data;
  },

  update: async (id: number | string, dto: AnnouncementForUpdation): Promise<AnnouncementDto> => {
    const res = await apiClient.put<AnnouncementDto>(`/api/Announcement/${id}`, dto);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await apiClient.delete(`/api/Announcement/${id}`);
    return res.status === 200 || res.status === 204;
  },
};

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsApi.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useAnnouncement(id: number | string | undefined) {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => (id ? announcementsApi.getById(id) : null),
    enabled: Boolean(id),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AnnouncementForCreation) => announcementsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number | string; dto: AnnouncementForUpdation }) =>
      announcementsApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement', variables.id] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export default announcementsApi;
