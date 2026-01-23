import axios from "axios";
import { userManager } from "../auth/oidc";

export const http = axios.create({
    baseURL: "http://localhost:8085",
});

http.interceptors.request.use(async (config) => {
    const user = await userManager.getUser();

    if (user?.access_token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${user.access_token}`;
    }

    return config;
});
