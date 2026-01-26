import { authClient } from "../api/clients/authClient";

export const login = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);
    params.append("client_id", "client-react");
    params.append("client_secret", "secret");

    const response = await authClient.post("/oauth2/token", params);
    localStorage.setItem("access_token", response.data.access_token);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access_token");
};
