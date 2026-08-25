export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://vifems-backend.onrender.com';

const TOKEN_KEY = 'vifems_token';
const REFRESH_TOKEN_KEY = 'vifems_refresh_token';
const USER_KEY = 'vifems_user';

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  getUser: <T = unknown>(): T | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setUser: (user: unknown): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export class ApiError extends Error {
  statusCode: number;
  data: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  timeoutMs?: number;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { requiresAuth = false, timeoutMs = 30000, headers = {}, ...rest } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = tokenStorage.getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: requestHeaders,
      signal: controller.signal,
      ...rest,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. The server may be waking up, please try again.', 408);
    }
    throw new ApiError(err.message || 'Network error. Please check your connection and try again.', 0);
  } finally {
    clearTimeout(timeoutId);
  }

  // If unauthorized and we have a refresh token, try refreshing once
  if (response.status === 401 && requiresAuth) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newToken = refreshData.accessToken || refreshData.token;
          if (newToken) {
            tokenStorage.setToken(newToken);
            requestHeaders['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, {
              headers: requestHeaders,
              ...rest,
            });
          }
        } else {
          tokenStorage.clear();
        }
      } catch {
        tokenStorage.clear();
      }
    }
  }

  let responseData: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json().catch(() => null);
  } else {
    responseData = await response.text().catch(() => null);
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred. Please try again.';
    if (typeof responseData === 'object' && responseData !== null) {
      errorMessage = responseData.error || responseData.message || errorMessage;
    } else if (typeof responseData === 'string' && responseData.trim()) {
      errorMessage = responseData;
    }
    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}
