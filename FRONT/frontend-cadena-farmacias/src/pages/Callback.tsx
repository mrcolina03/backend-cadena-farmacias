import { useEffect } from "react";
import { userManager } from "../auth/oidc";

export default function Callback() {
    useEffect(() => {
        userManager
            .signinRedirectCallback()
            .then(() => {
                window.location.replace("/");
            })
            .catch((err) => {
                console.error("Error en callback OIDC", err);
                window.location.replace("/login");
            });
    }, []);

    return <p>Procesando autenticación...</p>;
}
