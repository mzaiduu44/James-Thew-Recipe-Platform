import { useMutation } from '@tanstack/react-query';
import { apiClient } from './client';
import type { MediaUploadResponse } from '@/types/api';

export const mediaApi = {
  upload: async (file: File | Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('ImagePath', file);

    const res = await apiClient.post<any>('/api/Media', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });

    const data = res.data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return parsed.fileName || parsed.path || parsed.url || parsed.imagePath || data;
      } catch {
        return data;
      }
    }
    if (data && typeof data === 'object') {
      return data.fileName || data.path || data.url || data.imagePath || '';
    }
    return '';
  },
};

export function useUploadMedia() {
  return useMutation({
    mutationFn: (file: File | Blob) => mediaApi.upload(file),
  });
}

export default mediaApi;
