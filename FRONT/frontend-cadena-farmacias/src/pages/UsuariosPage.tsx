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
} from "@mui/material";

/* ========================
   Tipos auxiliares
   ======================== */
interface UsuarioForm {
    username: string;
    password?: string;
    nombre: string;
    apellido: string;
    email: string;
    enabled: boolean;
    roles: string[];
}

const UsuariosPage: React.FC = () => {



    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Usuario | null>(null);

    const [form, setForm] = useState<UsuarioForm>({
        username: "",
        password: "",
        nombre: "",
        apellido: "",
        email: "",
        enabled: true,
        roles: [],
    });

    /* ========================
       Cargar datos
       ======================== */
    const loadUsuarios = async () => {
        const res = await usuarioClient.get("/");
        console.log("USUARIOS RESPONSE:", res.data);
        console.log("ES ARRAY?", Array.isArray(res.data));

        setUsuarios(res.data.content);
    };

    const loadRoles = async () => {
        const res = await roleClient.getAll();
        setRoles(res.data.map((r: { nombre: string }) => r.nombre));
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
            nombre: "",
            apellido: "",
            email: "",
            enabled: true,
            roles: [],
        });
        setOpen(true);
    };

    const handleEdit = (u: Usuario) => {
        setEditing(u);
        setForm({
            username: u.username,
            nombre: u.nombre,
            apellido: u.apellido,
            email: u.email,
            enabled: u.enabled,
            roles: u.roles,
        });
        setOpen(true);
    };

    const handleSave = async () => {
        if (editing?.id) {
            await usuarioClient.put(`/${editing.id}`, form);
        } else {
            await usuarioClient.post("/", form);
        }
        setOpen(false);
        loadUsuarios();
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (window.confirm("¿Eliminar usuario?")) {
            await usuarioClient.delete(`/${id}`);
            loadUsuarios();
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

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Roles</TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usuarios.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>
                                {u.nombre} {u.apellido}
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                                <Chip
                                    label={u.enabled ? "Activo" : "Inactivo"}
                                    color={u.enabled ? "success" : "default"}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                {u.roles.map((r) => (
                                    <Chip key={r} label={r} size="small" sx={{ mr: 0.5 }} />
                                ))}
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
                </TableBody>
            </Table>

            {/* ========================
         Dialog
         ======================== */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editing ? "Editar Usuario" : "Nuevo Usuario"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Usuario"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            disabled={!!editing}
                        />

                        {!editing && (
                            <TextField
                                label="Password"
                                type="password"
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                            />
                        )}

                        <TextField
                            label="Nombre"
                            value={form.nombre}
                            onChange={(e) =>
                                setForm({ ...form, nombre: e.target.value })
                            }
                        />
                        <TextField
                            label="Apellido"
                            value={form.apellido}
                            onChange={(e) =>
                                setForm({ ...form, apellido: e.target.value })
                            }
                        />
                        <TextField
                            label="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

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
