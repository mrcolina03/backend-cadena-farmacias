import axios, { AxiosError } from "axios";
import { userManager } from "../../auth/oidc";

const API_USUARIOS_URL =
    import.meta.env.VITE_API_USUARIOS_URL || "/api/usuarios";

export const usuarioClient = axios.create({
    baseURL: API_USUARIOS_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 Token interceptor
usuarioClient.interceptors.request.use(async (config) => {
    const user = await userManager.getUser();
    if (user?.access_token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
});

// 🚨 401 interceptor
usuarioClient.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            const user = await userManager.getUser();
            if (!user || user.expired) {
                await userManager.signinRedirect();
            }
        }
        return Promise.reject(error);
    }
);
