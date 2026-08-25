import { apiClient } from '@/lib/api';
import {
  BusinessInfo,
  BusinessTypeData,
  TeamInviteData,
  ModulesData,
  OnboardingStatusResponse,
  ApiMessageResponse,
} from '@/types/onboarding';

export const onboardingService = {
  /**
   * GET /api/onboarding/status
   * Retrieves current onboarding status and business details
   */
  getStatus: async (): Promise<OnboardingStatusResponse> => {
    return apiClient<OnboardingStatusResponse>('/api/onboarding/status', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/business-info
   * Saves business details (Name, Email, Phone, Address, Country, State, Website, Currency, TimeZone)
   */
  saveBusinessInfo: async (data: BusinessInfo): Promise<ApiMessageResponse> => {
    return apiClient<ApiMessageResponse>('/api/onboarding/business-info', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/business-type
   * Selects business type (e.g. TRAINING, ACADEMY, ENTERPRISE, CORPORATE, CONSULTING)
   */
  saveBusinessType: async (data: BusinessTypeData): Promise<ApiMessageResponse> => {
    return apiClient<ApiMessageResponse>('/api/onboarding/business-type', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * POST /api/onboarding/team
   * Invites team members with emails and roles
   */
  inviteTeam: async (data: TeamInviteData): Promise<ApiMessageResponse> => {
    return apiClient<ApiMessageResponse>('/api/onboarding/team', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * PUT /api/onboarding/modules
   * Configures active platform modules
   */
  configureModules: async (data: ModulesData): Promise<ApiMessageResponse> => {
    return apiClient<ApiMessageResponse>('/api/onboarding/modules', {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * POST /api/onboarding/complete
   * Finalizes onboarding setup
   */
  completeOnboarding: async (): Promise<ApiMessageResponse> => {
    return apiClient<ApiMessageResponse>('/api/onboarding/complete', {
      method: 'POST',
      requiresAuth: true,
    });
  },
};
