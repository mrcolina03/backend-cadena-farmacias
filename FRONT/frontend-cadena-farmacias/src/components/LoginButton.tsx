import { userManager } from "../auth/oidc";

export default function LoginButton() {
    return (
        <button onClick={() => userManager.signinRedirect()}>
            Iniciar sesión
        </button>
    );
}
