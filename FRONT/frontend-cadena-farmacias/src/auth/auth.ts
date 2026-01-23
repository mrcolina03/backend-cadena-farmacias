import { userManager } from "./oidc";

export async function getAuthUser() {
    return userManager.getUser();
}

export async function isAuthenticated() {
    const user = await userManager.getUser();
    return !!user && !user.expired;
}

export async function login() {
    return userManager.signinRedirect();
}

export async function logout() {
    // Cierra sesión en el cliente (borra tokens) y redirige al issuer para logout OIDC
    return userManager.signoutRedirect();
}
