import { usuarioClient } from "./axiosUsuarios";
import { Role } from "../../types/Role";

export const roleClient = {
    getAll: () => usuarioClient.get<Role[]>("/roles"),
    create: (data: Partial<Role>) => usuarioClient.post("/roles", data),
};
