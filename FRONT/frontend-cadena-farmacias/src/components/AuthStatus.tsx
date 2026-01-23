import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { userManager } from "../auth/oidc";

type AuthInfo = {
    name?: string;
    username?: string;
    roles?: string[];
};

export default function AuthStatus() {
    const [info, setInfo] = useState<AuthInfo | null>(null);

    useEffect(() => {
        userManager.getUser().then((user) => {
            if (!user || user.expired) {
                setInfo(null);
                return;
            }

            // id_token / profile (OIDC)
            const profile: any = user.profile || {};
            const name = profile.name || profile.preferred_username;
            const username = profile.preferred_username || profile.sub;

            // roles: depende de si los estás poniendo en el token
            // oidc-client-ts NO decodifica access_token automáticamente, así que aquí mostramos profile básico
            setInfo({
                name,
                username,
                roles: profile.roles || profile.authorities || [],
            });
        });
    }, []);

    if (!info) {
        return (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Typography variant="body2">No autenticado</Typography>
                <Button variant="contained" onClick={() => userManager.signinRedirect()}>
                    Iniciar sesión
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2">
                Autenticado: {info.name || info.username}
            </Typography>

            <Button variant="outlined" color="error" onClick={() => userManager.signoutRedirect()}>
                Cerrar sesión
            </Button>
        </Box>
    );
}
