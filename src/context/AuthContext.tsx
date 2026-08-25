'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, LoginCredentials, RegisterData, ResetPasswordData, AuthResponse, ApiMessageResponse } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { tokenStorage } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  refreshProfile: () => Promise<User | null>;
  verifyEmail: (token: string) => Promise<ApiMessageResponse>;
  resendVerification: (email: string) => Promise<ApiMessageResponse>;
  forgotPassword: (email: string) => Promise<ApiMessageResponse>;
  resetPassword: (data: ResetPasswordData) => Promise<ApiMessageResponse>;
  handleOAuthSuccess: (token: string, refreshToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = useCallback(async (): Promise<User | null> => {
    try {
      const activeToken = tokenStorage.getToken();
      if (!activeToken) {
        setUser(null);
        setToken(null);
        return null;
      }
      setToken(activeToken);
      const profile = await authService.getMe();
      setUser(profile);
      return profile;
    } catch {
      // If fetching me fails and there's no valid session, clear
      const cachedUser = tokenStorage.getUser<User>();
      if (cachedUser) {
        setUser(cachedUser);
        return cachedUser;
      }
      setUser(null);
      setToken(null);
      return null;
    }
  }, []);

  // Hydrate on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const storedToken = tokenStorage.getToken();
      const storedUser = tokenStorage.getUser<User>();

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) setUser(storedUser);

        try {
          await refreshProfile();
        } catch {
          // Handled in refreshProfile
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshProfile]);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const activeToken = response.token || response.accessToken;
      if (activeToken) {
        setToken(activeToken);
      }
      if (response.user) {
        setUser(response.user);
      } else if (activeToken) {
        await refreshProfile();
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      const activeToken = response.token || response.accessToken;
      if (activeToken) {
        setToken(activeToken);
      }
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const verifyEmail = async (token: string): Promise<ApiMessageResponse> => {
    return authService.verifyEmail(token);
  };

  const resendVerification = async (email: string): Promise<ApiMessageResponse> => {
    return authService.resendVerification(email);
  };

  const forgotPassword = async (email: string): Promise<ApiMessageResponse> => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (data: ResetPasswordData): Promise<ApiMessageResponse> => {
    return authService.resetPassword(data);
  };

  const handleOAuthSuccess = async (oAuthToken: string, refreshToken?: string): Promise<void> => {
    authService.setSession(oAuthToken, refreshToken);
    setToken(oAuthToken);
    await refreshProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token || !!user,
        login,
        register,
        logout,
        refreshProfile,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        handleOAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
