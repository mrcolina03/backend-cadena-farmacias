import axios, { AxiosError } from 'axios';
import { userManager } from "../../auth/oidc";

const API_REPORTES_URL = import.meta.env.VITE_API_REPORTES_URL || '/api/reportes';

export const axiosReportes = axios.create({
  baseURL: API_REPORTES_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosReportes.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();
  if (user?.access_token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

axiosReportes.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      const user = await userManager.getUser();
      if (!user || user.expired) {
        await userManager.signinRedirect();
      }
    }
    return Promise.reject(error);
  }
);