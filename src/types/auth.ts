export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified?: boolean;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface RefreshTokenData {
  refreshToken: string;
}

export interface ApiMessageResponse {
  message?: string;
  success?: boolean;
  error?: string;
}
