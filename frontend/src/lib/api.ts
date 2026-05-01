import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    if (error.response?.status !== 401 || !original || original._retried) {
      return Promise.reject(error);
    }

    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    original._retried = true;
    refreshing ??= axios
      .post(`${baseURL}/api/v1/auth/refresh`, { refresh_token: refreshToken })
      .then((res) => {
        setTokens(res.data.access_token, res.data.refresh_token);
        return res.data.access_token as string;
      })
      .catch(() => {
        logout();
        return null;
      })
      .finally(() => {
        refreshing = null;
      });

    const newToken = await refreshing;
    if (!newToken) return Promise.reject(error);

    original.headers.set('Authorization', `Bearer ${newToken}`);
    return api.request(original);
  },
);

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};
