// src/pages/LogoutCallback.tsx
import { useEffect } from "react";
import { userManager } from "../auth/oidc";

export default function LogoutCallback() {
    useEffect(() => {
        userManager
            .signoutRedirectCallback()
            .then(() => {
                window.location.replace("/login");
            })
            .catch((err) => {
                console.error("Error logout callback", err);
                window.location.replace("/login");
            });
    }, []);

    return <p>Cerrando sesión...</p>;
}
