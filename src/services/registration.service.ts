import { apiClient } from '@/lib/api';
import {
  RegistrationLink,
  RegistrationSubmission,
  CreateRegistrationLinkPayload,
  FormField,
} from '@/types/workspace';

export const registrationService = {
  // ── Admin: Registration Links ──────────────────────────────

  getLinks: async (workspaceId?: string): Promise<{ data: RegistrationLink[] }> => {
    const q = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return await apiClient<{ data: RegistrationLink[] }>(`/api/registrations/links${q}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  createLink: async (payload: CreateRegistrationLinkPayload): Promise<{ message: string; data: RegistrationLink }> => {
    return await apiClient<{ message: string; data: RegistrationLink }>('/api/registrations/links', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: true,
    });
  },

  disableLink: async (id: string, workspaceId?: string): Promise<{ message: string; data: RegistrationLink }> => {
    return await apiClient<{ message: string; data: RegistrationLink }>(`/api/registrations/links/${id}/disable`, {
      method: 'PATCH',
      body: JSON.stringify({ workspaceId }),
      requiresAuth: true,
    });
  },

  deleteLink: async (id: string, workspaceId?: string): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/api/registrations/links/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ workspaceId }),
      requiresAuth: true,
    });
  },

  // ── Admin: Pending Submissions ─────────────────────────────

  getPendingSubmissions: async (workspaceId?: string, status = 'PENDING'): Promise<{ data: RegistrationSubmission[] }> => {
    const params = new URLSearchParams({ status });
    if (workspaceId) params.set('workspaceId', workspaceId);
    return await apiClient<{ data: RegistrationSubmission[] }>(`/api/registrations/submissions?${params}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  approveSubmission: async (id: string, workspaceId?: string): Promise<{ message: string; data: any }> => {
    return await apiClient<{ message: string; data: any }>(`/api/registrations/submissions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ workspaceId }),
      requiresAuth: true,
    });
  },

  rejectSubmission: async (id: string, workspaceId?: string, reason?: string): Promise<{ message: string }> => {
    return await apiClient<{ message: string }>(`/api/registrations/submissions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ workspaceId, reason }),
      requiresAuth: true,
    });
  },

  // ── Public (no auth) ──────────────────────────────────────

  getPublicLink: async (slug: string): Promise<{ data: any }> => {
    return await apiClient<{ data: any }>(`/api/registrations/public/${slug}`, {
      method: 'GET',
    });
  },

  submitRegistration: async (slug: string, formData: Record<string, any>): Promise<{ message: string; requiresApproval: boolean; participantId?: string }> => {
    return await apiClient<{ message: string; requiresApproval: boolean; participantId?: string }>(
      `/api/registrations/public/${slug}/submit`,
      {
        method: 'POST',
        body: JSON.stringify(formData),
      }
    );
  },
};
