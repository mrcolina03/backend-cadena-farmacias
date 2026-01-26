import React from "react";
import { userManager } from "../auth/oidc";

const LoginPage: React.FC = () => {

    const handleLogin = async () => {
        await userManager.signinRedirect();
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <button onClick={handleLogin}>
                Ingresar con OAuth
            </button>
        </div>
    );
};

export default LoginPage;
