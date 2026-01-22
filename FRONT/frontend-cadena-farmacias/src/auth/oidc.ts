import { UserManager } from "oidc-client-ts";

export const userManager = new UserManager({
    authority: "http://localhost:9000",      // http://localhost:9000
    client_id: "react-client",   // react-client
    redirect_uri: "http://localhost:5173/callback", // http://localhost:5173/callback
    response_type: "code",
    scope: "openid profile inventory.read sales.read",
    post_logout_redirect_uri: "http://localhost:5173/",
});
