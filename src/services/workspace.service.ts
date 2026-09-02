import { apiClient } from '@/lib/api';
import {
  Workspace,
  DashboardStats,
  Participant,
  CreateWorkspacePayload,
  CreateParticipantPayload,
  PublicRegisterPayload,
} from '@/types/workspace';

export const workspaceService = {
  /**
   * GET /api/dashboard/stats?workspaceId=...
   */
  getDashboardStats: async (workspaceId?: string): Promise<DashboardStats> => {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<DashboardStats>(`/api/dashboard/stats${query}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * GET /api/workspaces
   */
  getWorkspaces: async (): Promise<{ workspaces: Workspace[] }> => {
    return await apiClient<{ workspaces: Workspace[] }>('/api/workspaces', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * POST /api/workspaces
   */
  createWorkspace: async (payload: CreateWorkspacePayload): Promise<{ message: string; workspace: Workspace }> => {
    return await apiClient<{ message: string; workspace: Workspace }>('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  /**
   * GET /api/workspaces/{id}
   */
  getWorkspaceById: async (id: string): Promise<{ workspace: Workspace; userRole: string }> => {
    return await apiClient<{ workspace: Workspace; userRole: string }>(`/api/workspaces/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * GET /api/participants?workspaceId=...&status=...&search=...
   */
  getParticipants: async (
    workspaceId?: string,
    status?: string,
    search?: string
  ): Promise<{ data: Participant[]; entityConfig?: any }> => {
    const params = new URLSearchParams();
    if (workspaceId) params.append('workspaceId', workspaceId);
    if (status && status !== 'ALL') params.append('status', status);
    if (search && search.trim()) params.append('search', search.trim());

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<{ data: Participant[]; entityConfig?: any }>(`/api/participants${qs}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * POST /api/participants
   */
  createParticipant: async (payload: CreateParticipantPayload): Promise<{ message: string; data: Participant }> => {
    return await apiClient<{ message: string; data: Participant }>('/api/participants', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/participants/{id}
   */
  updateParticipant: async (id: string, payload: Partial<CreateParticipantPayload>): Promise<{ message: string; data?: Participant }> => {
    return await apiClient<{ message: string; data?: Participant }>(`/api/participants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  /**
   * DELETE /api/participants/{id}
   */
  deleteParticipant: async (id: string, workspaceId: string): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/api/participants/${id}?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  /**
   * POST /api/participants/register (Public Registration)
   */
  registerParticipantPublic: async (payload: PublicRegisterPayload): Promise<{ message: string; participantId: string }> => {
    return await apiClient<{ message: string; participantId: string }>('/api/participants/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
