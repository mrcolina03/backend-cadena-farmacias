import React, { useEffect, useState } from "react";
import { usuarioClient } from "../api/clients/axiosUsuarios";
import { roleClient } from "../api/clients/roleClient";
import { Usuario } from "../types/Usuario";

import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox,
    FormControlLabel,
    Stack,
    Alert,
} from "@mui/material";

/* ========================
   Tipos auxiliares
   ======================== */
type ApiResponse<T> = { data: T };

// Ajustado a lo que realmente llega / se envía
interface UsuarioForm {
    username: string;
    password?: string; // solo en crear (si tu backend lo requiere)
    enabled: boolean;
    roles: string[];
}

const UsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Usuario | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<UsuarioForm>({
        username: "",
        password: "",
        enabled: true,
        roles: [],
    });

    /* ========================
       Cargar datos
       ======================== */
    const loadUsuarios = async () => {
        try {
            setError(null);
            const res = await usuarioClient.get<ApiResponse<Usuario[]>>("/");
            const list = res.data?.data ?? [];
            setUsuarios(Array.isArray(list) ? list : []);
        } catch (e) {
            console.error(e);
            setUsuarios([]);
            setError("No se pudieron cargar los usuarios.");
        }
    };

    const loadRoles = async () => {
        try {
            setError(null);

            const res = await roleClient.getAll();

            // Soporta: res.data = Role[]  OR  res.data = { data: Role[] }
            const raw = (res as any).data;
            const list = Array.isArray(raw) ? raw : raw?.data ?? [];

            setRoles(list.map((r: { nombre: string }) => r.nombre));
        } catch (e) {
            console.error(e);
            setRoles([]);
            setError("No se pudieron cargar los roles.");
        }
    };


    useEffect(() => {
        loadUsuarios();
        loadRoles();
    }, []);

    /* ========================
       Acciones
       ======================== */
    const handleOpenCreate = () => {
        setEditing(null);
        setForm({
            username: "",
            password: "",
            enabled: true,
            roles: [],
        });
        setOpen(true);
    };

    const handleEdit = (u: Usuario) => {
        setEditing(u);
        setForm({
            username: u.username,
            enabled: u.enabled,
            roles: u.roles ?? [],
        });
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            setError(null);

            // Si estás editando, normalmente NO se envía password
            const payload: UsuarioForm = { ...form };
            if (editing) delete payload.password;

            if (editing?.id) {
                await usuarioClient.put<ApiResponse<Usuario>>(`/${editing.id}`, payload);
            } else {
                await usuarioClient.post<ApiResponse<Usuario>>("/", payload);
            }

            setOpen(false);
            await loadUsuarios();
        } catch (e) {
            console.error(e);
            setError("No se pudo guardar el usuario. Revisa los datos.");
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("¿Eliminar usuario?")) return;

        try {
            setError(null);
            await usuarioClient.delete(`/${id}`); // backend retorna 204
            await loadUsuarios();
        } catch (e) {
            console.error(e);
            setError("No se pudo eliminar el usuario.");
        }
    };

    const toggleRole = (role: string) => {
        setForm((prev) => ({
            ...prev,
            roles: prev.roles.includes(role)
                ? prev.roles.filter((r) => r !== role)
                : [...prev.roles, role],
        }));
    };

    /* ========================
       Render
       ======================== */
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography variant="h4">Gestión de Usuarios</Typography>
                <Button variant="contained" onClick={handleOpenCreate}>
                    Nuevo Usuario
                </Button>
            </Stack>

            {error && (
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Apellido</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Roles</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {usuarios.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.id}</TableCell>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>{u.enabled}</TableCell>
                            <TableCell>{u.apellido}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                                <Chip
                                    label={u.enabled ? "Activo" : "Inactivo"}
                                    color={u.enabled ? "success" : "default"}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                {(u.roles ?? []).length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        —
                                    </Typography>
                                ) : (
                                    (u.roles ?? []).map((r) => (
                                        <Chip key={r} label={r} size="small" sx={{ mr: 0.5 }} />
                                    ))
                                )}
                            </TableCell>
                            <TableCell>
                                <Button size="small" onClick={() => handleEdit(u)}>
                                    Editar
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(u.id)}
                                >
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}

                    {usuarios.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay usuarios registrados.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* ========================
         Dialog
         ======================== */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editing ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Usuario"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            disabled={!!editing}
                        />

                        {!editing && (
                            <TextField
                                label="Password"
                                type="password"
                                value={form.password ?? ""}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        )}

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={form.enabled}
                                    onChange={(e) =>
                                        setForm({ ...form, enabled: e.target.checked })
                                    }
                                />
                            }
                            label="Activo"
                        />

                        <Typography variant="subtitle2">Roles</Typography>
                        <Stack direction="row" flexWrap="wrap">
                            {roles.map((r) => (
                                <FormControlLabel
                                    key={r}
                                    control={
                                        <Checkbox
                                            checked={form.roles.includes(r)}
                                            onChange={() => toggleRole(r)}
                                        />
                                    }
                                    label={r}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsuariosPage;
