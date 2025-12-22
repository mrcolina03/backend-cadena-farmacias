import React, { useState, useEffect } from 'react';
import { Client } from '../types/Client';
import { ClientService } from '../clients/ClientService';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCicleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ClientForm from '../components/client/ClientForm'; // Importamos el formulario

const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await ClientService.getAllClients();
      // Asume que getAllClients trae todos, incluyendo inactivos, si el backend está siguiendo el patrón
      setClients(response.data);

    } catch (err) {
      console.error("Error al obtener clientes:", err);
      setError('No se pudieron cargar los clientes. Verifique la conexión al backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenCreate = () => {
    setSelectedClient(undefined);
    setOpenForm(true);
  };

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedClient(undefined);
  };

  const handleSuccess = (client: Client) => {
    handleCloseForm();
    setSuccessMessage(`Cliente "${client.nombres} ${client.apellidos}" guardado exitosamente.`);
    fetchClients(); // Recargar la lista
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleActivate = async (id: number, name: string) => {
    if (!window.confirm(`¿Está seguro de activar al cliente ${name}?`)) return;
    try {
      await ClientService.activateClient(id);
      setSuccessMessage(`Cliente "${name}" activado exitosamente.`);
      fetchClients();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al activar el cliente ${name}.`);
    }
  };

  const handleDeactivate = async (id: number, name: string) => {
    if (!window.confirm(`¿Está seguro de desactivar al cliente ${name}?`)) return;
    try {
      await ClientService.deactivateClient(id);
      setSuccessMessage(`Cliente "${name}" desactivado exitosamente.`);
      fetchClients();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al desactivar el cliente ${name}.`);
    }
  };

  const handleDeletePermanently = async (id: number, name: string) => {
    if (!window.confirm(`ADVERTENCIA: ¿Está seguro de ELIMINAR PERMANENTEMENTE al cliente ${name}? Esta acción no se puede deshacer.`)) return;
    try {
      await ClientService.deleteClientPermanently(id); // Llamada al Hard Delete
      setSuccessMessage(`Cliente "${name}" eliminado permanentemente.`);
      fetchClients();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al eliminar permanentemente el cliente ${name}.`);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando clientes...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Listado de Clientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Crear Cliente
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      {clients.length === 0 ? (
        <Alert severity="info">No hay clientes registrados.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="client table">
            <TableHead>
              <TableRow>
                <TableCell>Cédula</TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} sx={{ backgroundColor: client.activo === false ? '#ffebee' : 'inherit' }}>
                  <TableCell>{client.cedula}</TableCell>
                  <TableCell>{client.nombres} {client.apellidos}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.telefono || 'N/A'}</TableCell>
                  <TableCell>{client.activo === false ? 'No' : 'Sí'}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    
                    {/* BOTÓN 1: EDITAR */}
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEdit(client)}
                        disabled={client.activo === false}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {/* BOTÓN 2: ACTIVAR/DESACTIVAR (Soft Delete) */}
                    {client.activo === false ? (
                        // Botón Activar
                        <Tooltip title="Activar Cliente">
                          <IconButton 
                            color="success" 
                            onClick={() => handleActivate(client.id!, `${client.nombres} ${client.apellidos}`)}
                          >
                            <CheckCicleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                    ) : (
                        // Botón Desactivar
                        <Tooltip title="Desactivar (Soft Delete)">
                          <IconButton 
                            color="warning" 
                            onClick={() => handleDeactivate(client.id!, `${client.nombres} ${client.apellidos}`)}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                    )}

                    {/* BOTÓN 3: ELIMINAR PERMANENTEMENTE (Hard Delete) */}
                    <Tooltip title="Eliminar Permanentemente (Hard Delete)">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeletePermanently(client.id!, `${client.nombres} ${client.apellidos}`)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal/Dialog para el formulario de creación/edición */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{selectedClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
        <DialogContent>
          <ClientForm
            initialData={selectedClient}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ClientListPage;