import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SucursalListPageInactivas: React.FC = () => {
  const navigate = useNavigate();
  const [inactiveSucursales, setInactiveSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSucursales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await SucursalService.getAllSucursales();
      setInactiveSucursales(response.data.filter(s => s.estado === 'INACTIVO'));
    } catch (err) {
      console.error('Error al obtener sucursales:', err);
      setError('No se pudieron cargar las sucursales inactivas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);

  const handleActivate = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Desea activar nuevamente la sucursal "${nombre}"?`)) {
      return;
    }
    try {
      await SucursalService.activateSucursal(id);
      setSuccessMessage(`Sucursal "${nombre}" activada exitosamente.`);
      fetchSucursales();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al activar la sucursal "${nombre}".`);
    }
  };

  const handleDeletePermanently = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está SEGURO de eliminar permanentemente la sucursal "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    if (!window.confirm(`CONFIRMACIÓN FINAL: Eliminar "${nombre}" para siempre.`)) {
      return;
    }

    try {
      await SucursalService.deactivateSucursal(id);
      setSuccessMessage(`Sucursal "${nombre}" eliminada permanentemente.`);
      fetchSucursales();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al eliminar la sucursal "${nombre}".`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando sucursales inactivas...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Tooltip title="Volver al listado principal">
          <IconButton onClick={() => navigate('/inventario/sucursal')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">
          Sucursales Inactivas
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      {inactiveSucursales.length === 0 ? (
        <Alert severity="info">No hay sucursales inactivas.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="inactive sucursal table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inactiveSucursales.map((sucursal) => (
                <TableRow
                  key={sucursal.id}
                  sx={{ backgroundColor: '#ffebee' }}
                >
                  <TableCell>{sucursal.nombre}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Activar">
                      <IconButton
                        color="success"
                        onClick={() => handleActivate(sucursal.id, sucursal.nombre)}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar Permanentemente">
                      <IconButton
                        color="warning"
                        onClick={() => handleDeletePermanently(sucursal.id, sucursal.nombre)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SucursalListPageInactivas;