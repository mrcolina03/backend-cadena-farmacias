import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { userManager } from "../../auth/oidc"; // <-- AJUSTA ESTA RUTA

// Base URL: si usas Nginx proxy /api/catalogo, deja así.
// Si llamas directo al gateway: http://localhost:8085/api/catalogo
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/catalogo";

export const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ===============================
// 🔐 Interceptor: Bearer Token
// ===============================
axiosClient.interceptors.request.use(async (config) => {
    const user = await userManager.getUser();

    // Si hay token, lo añadimos
    if (user?.access_token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }

    return config;
});

// ============================================
// 🚨 Interceptor: Manejo global de 401
// ============================================
axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;

        // Si el backend responde 401, intentamos relanzar login (SPA)
        if (status === 401) {
            const user = await userManager.getUser();

            // Si no hay sesión o expiró, redirige al oauth-server
            if (!user || user.expired) {
                await userManager.signinRedirect();
            }
        }

        return Promise.reject(error);
    }
);

// --- Helper para extracción de mensajes de error ---
export interface BackendErrorResponse {
    message?: string;
    error?: string;
    status?: number;
    details?: string[];
}

export const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // ✅ Si hay respuesta del backend
        if (axiosError.response) {
            const data = axiosError.response.data as BackendErrorResponse | string | undefined;

            // Si el backend devuelve JSON con message
            if (data && typeof data === "object") {
                const message = data.message || data.error || `Error HTTP ${axiosError.response.status}`;
                const details = data.details;

                if (details && Array.isArray(details) && details.length > 0) {
                    return `${message}\nDetalles:\n- ${details.join("\n- ")}`;
                }

                return message;
            }

            // Si el backend devuelve string/plain text
            if (typeof data === "string" && data.trim().length > 0) {
                return data;
            }

            return `Error HTTP ${axiosError.response.status}`;
        }

        // ✅ Errores de red / CORS / servidor caído
        if (axiosError.request) {
            return `Error de red o conexión: ${axiosError.message}`;
        }

        // ✅ Errores de configuración Axios
        return axiosError.message;
    }

    // Error desconocido
    return (error as Error)?.message || "Error desconocido del sistema.";
};
