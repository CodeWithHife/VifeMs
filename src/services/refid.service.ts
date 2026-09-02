import { apiClient } from '@/lib/api';
import { RefIdConfig } from '@/types/workspace';

export const refIdService = {
  getConfig: async (workspaceId?: string): Promise<{ data: RefIdConfig | null }> => {
    const q = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ data: RefIdConfig | null }>(`/api/ref-id${q}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  saveConfig: async (config: {
    workspaceId?: string;
    prefix: string;
    separator: string;
    padding: number;
    startingNumber: number;
    useYear: boolean;
  }): Promise<{ message: string; data: RefIdConfig }> => {
    return await apiClient<{ message: string; data: RefIdConfig }>('/api/ref-id', {
      method: 'PUT',
      body: JSON.stringify(config),
      requiresAuth: true,
    });
  },
};
