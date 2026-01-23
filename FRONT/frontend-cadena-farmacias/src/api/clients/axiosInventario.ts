import axios, { AxiosError } from 'axios';
import { userManager } from "../../auth/oidc";

const INVENTARIO_BASE_URL =
  import.meta.env.VITE_API_INVENTARIO_URL || '/api/inventario';

export const axiosInventario = axios.create({
  baseURL: INVENTARIO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInventario.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();
  if (user?.access_token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

axiosInventario.interceptors.response.use(
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
