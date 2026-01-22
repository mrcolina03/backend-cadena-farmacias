import { useEffect } from "react";
import { userManager } from "../auth/oidc";

export default function Callback() {
    useEffect(() => {
        userManager.signinRedirectCallback().then(() => {
            window.location.href = "/";
        });
    }, []);

    return <p>Procesando autenticación...</p>;
}
