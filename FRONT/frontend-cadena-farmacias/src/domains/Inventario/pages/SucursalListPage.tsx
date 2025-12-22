import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sucursal } from '../types/Sucursal';
import { SucursalService } from '../clients/SucursalServices';
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
import InventoryIcon from '@mui/icons-material/Inventory';

import SucursalForm from '../components/Sucursal/SucursalForm';

const SucursalListPage: React.FC = () => {
  const navigate = useNavigate();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSucursales = async () => {
    try {
      setLoading(true);
      const response = await SucursalService.getAllSucursales();
      setSucursales(response.data);
    } catch (err) {
      console.error('Error al obtener sucursales:', err);
      setError('No se pudieron cargar las sucursales. Verifique la conexión al backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleOpenCreate = () => {
    setSelectedSucursal(undefined);
    setOpenForm(true);
  };

  const handleOpenEdit = (sucursal: Sucursal) => {
    setSelectedSucursal(sucursal);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedSucursal(undefined);
  };

  const handleSuccess = (sucursal: Sucursal) => {
    handleCloseForm();
    setSuccessMessage(`Sucursal "${sucursal.nombre}" guardada exitosamente.`);
    fetchSucursales();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDeactivate = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro de desactivar la sucursal "${nombre}"?`)) {
      return;
    }
    try {
      await SucursalService.deactivateSucursal(id);
      setSuccessMessage(`Sucursal "${nombre}" desactivada exitosamente.`);
      fetchSucursales();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al desactivar la sucursal "${nombre}".`);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando sucursales...</Typography>
      </Box>
    );
  }

  // 👇 SOLO SUCURSALES ACTIVAS (sin modificar funcionamiento)
  const sucursalesActivas = sucursales.filter(
    (sucursal) => sucursal.estado === 'ACTIVO'
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Listado de Sucursales
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Crear Sucursal
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      {sucursalesActivas.length === 0 ? (
        <Alert severity="info">No hay sucursales activas.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="sucursal table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Inventario</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sucursalesActivas.map((sucursal) => (
                <TableRow key={sucursal.id}>
                  <TableCell>{sucursal.nombre}</TableCell>
                  <TableCell>{sucursal.direccion || '—'}</TableCell>
                  <TableCell>{sucursal.ciudad || '—'}</TableCell>
                  <TableCell>{sucursal.estado}</TableCell>

                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<InventoryIcon />}
                      onClick={() => navigate(`/inventario/sucursal/${sucursal.id}`)}
                    >
                      Gestionar
                    </Button>
                  </TableCell>

                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(sucursal)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Desactivar">
                      <IconButton
                        color="error"
                        onClick={() => handleDeactivate(sucursal.id, sucursal.nombre)}
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

      {/* Modal Formulario */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSucursal ? 'Editar Sucursal' : 'Crear Nueva Sucursal'}
        </DialogTitle>
        <DialogContent>
          <SucursalForm
            initialData={selectedSucursal}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SucursalListPage;
