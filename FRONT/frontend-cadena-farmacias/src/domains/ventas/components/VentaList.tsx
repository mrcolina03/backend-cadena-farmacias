import React, { useState, useEffect } from 'react';
import { Venta } from '../types/Venta';
import { VentaService } from '../clients/VentaService';
import { extractErrorMessage } from '@api/clients/axiosClient';
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
  Tooltip,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VentaForm from '../components/VentaForm'; // Asumiendo que crearás este componente

const VentaListPage: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await VentaService.getAllVentas();
      // Verificación defensiva para asegurar que data sea un array
      setVentas(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error al obtener ventas:", err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleOpenCreate = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSuccess = () => {
    handleCloseForm();
    setSuccessMessage(`Venta registrada exitosamente.`);
    fetchVentas(); 
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`¿Está seguro de anular la venta #${id}?`)) return;
    try {
      await VentaService.deleteVenta(id);
      setSuccessMessage(`Venta #${id} anulada exitosamente.`);
      fetchVentas();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando historial de ventas...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Encabezado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestión de Ventas
        </Typography>
        <Box>
            <IconButton onClick={fetchVentas} sx={{ mr: 1 }} title="Refrescar">
                <RefreshIcon />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              color="primary"
            >
              Nueva Venta
            </Button>
        </Box>
      </Box>

      {/* Alertas */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}

      {/* Tabla de Datos */}
      {ventas.length === 0 ? (
        <Alert severity="info">No se han encontrado registros de ventas.</Alert>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table aria-label="ventas table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id} hover>
                  <TableCell>#{venta.id}</TableCell>
                  <TableCell>{new Date(venta.fecha).toLocaleString()}</TableCell>
                  <TableCell>{venta.clienteNombre || `ID: ${venta.clienteId}`}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    ${venta.total.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                        label="Completada" 
                        size="small" 
                        color="success" 
                        variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver Detalles">
                      <IconButton color="info">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Anular Venta">
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(venta.id)}
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

      {/* Dialog para Formulario */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #eee', mb: 2 }}>
            Registrar Nueva Venta
        </DialogTitle>
        <DialogContent>
          <VentaForm
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default VentaListPage;