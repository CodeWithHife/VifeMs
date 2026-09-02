import { apiClient } from '@/lib/api';
import {
  BusinessInfo,
  BusinessTypeData,
  EntityConfigData,
  TeamInviteData,
  ModulesData,
  OnboardingStatusResponse,
  ApiMessageResponse,
  OnboardingCompleteResponse,
} from '@/types/onboarding';

export const onboardingService = {
  /**
   * GET /api/onboarding/status
   */
  getStatus: async (): Promise<OnboardingStatusResponse> => {
    return await apiClient<OnboardingStatusResponse>('/api/onboarding/status', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/business-type
   */
  saveBusinessType: async (data: BusinessTypeData): Promise<ApiMessageResponse> => {
    return await apiClient<ApiMessageResponse>('/api/onboarding/business-type', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/business-info
   */
  saveBusinessInfo: async (data: BusinessInfo): Promise<ApiMessageResponse> => {
    return await apiClient<ApiMessageResponse>('/api/onboarding/business-info', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/entity-config
   */
  saveEntityConfig: async (data: EntityConfigData): Promise<ApiMessageResponse> => {
    return await apiClient<ApiMessageResponse>('/api/onboarding/entity-config', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * POST /api/onboarding/team
   */
  inviteTeam: async (data: TeamInviteData): Promise<ApiMessageResponse> => {
    return await apiClient<ApiMessageResponse>('/api/onboarding/team', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/modules
   */
  configureModules: async (data: ModulesData): Promise<ApiMessageResponse> => {
    return await apiClient<ApiMessageResponse>('/api/onboarding/modules', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * POST /api/onboarding/complete
   */
  completeOnboarding: async (): Promise<OnboardingCompleteResponse> => {
    return await apiClient<OnboardingCompleteResponse>('/api/onboarding/complete', {
      method: 'POST',
      requiresAuth: true,
    });
  },
};
