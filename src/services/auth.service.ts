import { apiClient, API_BASE_URL, tokenStorage } from '@/lib/api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  ResendVerificationData,
  RefreshTokenData,
  ApiMessageResponse,
  User,
} from '@/types/auth';

export const authService = {
  /**
   * Returns the direct URL to initiate Google OAuth login.
   */
  getGoogleAuthUrl: (): string => {
    return `${API_BASE_URL}/api/auth/google`;
  },

  /**
   * Registers a new account.
   * POST /api/auth/register
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const token = response.token || response.accessToken;
    if (token) {
      tokenStorage.setToken(token);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    if (response.user) {
      tokenStorage.setUser(response.user);
    }

    return response;
  },

  /**
   * Logs into an existing account.
   * POST /api/auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const token = response.token || response.accessToken;
    if (token) {
      tokenStorage.setToken(token);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }
    if (response.user) {
      tokenStorage.setUser(response.user);
    }

    return response;
  },

  /**
   * Verifies an email address using the provided token.
   * POST /api/auth/verify-email
   */
  verifyEmail: async (token: string): Promise<ApiMessageResponse> => {
    const body: VerifyEmailData = { token };
    return apiClient<ApiMessageResponse>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Resends verification email to the user's address.
   * POST /api/auth/resend-verification
   */
  resendVerification: async (email: string): Promise<ApiMessageResponse> => {
    const body: ResendVerificationData = { email };
    return apiClient<ApiMessageResponse>('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Requests a password reset link.
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<ApiMessageResponse> => {
    const body: ForgotPasswordData = { email };
    return apiClient<ApiMessageResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Resets user password using reset token and new passwords.
   * POST /api/auth/reset-password
   */
  resetPassword: async (data: ResetPasswordData): Promise<ApiMessageResponse> => {
    return apiClient<ApiMessageResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Refreshes JWT access token using refresh token.
   * POST /api/auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const body: RefreshTokenData = { refreshToken };
    const response = await apiClient<AuthResponse>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const token = response.token || response.accessToken;
    if (token) {
      tokenStorage.setToken(token);
    }
    if (response.refreshToken) {
      tokenStorage.setRefreshToken(response.refreshToken);
    }

    return response;
  },

  /**
   * Retrieves the current authenticated user's profile.
   * GET /api/auth/me
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient<any>('/api/auth/me', {
      method: 'GET',
      requiresAuth: true,
    });

    const user = response?.user || response;
    if (user && user.id) {
      tokenStorage.setUser(user);
      return user;
    }
    return response as User;
  },

  /**
   * Logs out the user and clears stored credentials.
   */
  logout: (): void => {
    tokenStorage.clear();
  },

  /**
   * Saves OAuth login tokens/user manually (e.g. from callback URL params).
   */
  setSession: (token: string, refreshToken?: string, user?: User): void => {
    tokenStorage.setToken(token);
    if (refreshToken) tokenStorage.setRefreshToken(refreshToken);
    if (user) tokenStorage.setUser(user);
  }
};
