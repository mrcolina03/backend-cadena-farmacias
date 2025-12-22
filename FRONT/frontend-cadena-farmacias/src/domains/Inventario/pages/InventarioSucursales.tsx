import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Alert, CircularProgress, Dialog, IconButton, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { InventarioSucursalDetallado } from '../types/InventarioSucursal';
import { InventarioSucursalService } from '../clients/InventarioSucursalServices';
import { SucursalService } from '../clients/SucursalServices'; // Importar servicio de sucursal
import InventarioSucursalList from '../components/InventarioSucursal/InventarioSucursalList';
import InventarioSucursalForm from '../components/InventarioSucursal/InventarioSucursalForm';

const InventarioSucursalPage: React.FC = () => {
  const { sucursalId } = useParams<{ sucursalId: string }>();
  const navigate = useNavigate();
  const [inventario, setInventario] = useState<InventarioSucursalDetallado[]>([]);
  const [nombreSucursal, setNombreSucursal] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const fetchData = useCallback(async () => {
    const id = Number(sucursalId);
    if (isNaN(id)) {
      setError('El ID de la sucursal no es válido.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cargar datos de la sucursal y el inventario en paralelo
      const [sucursalRes, inventarioRes] = await Promise.all([
        SucursalService.getSucursalById(id),
        InventarioSucursalService.getInventarioBySucursalDetallado(id),
      ]);

      setNombreSucursal(sucursalRes.data.nombre);
      setInventario(inventarioRes.data);

    } catch (err: any) {
      console.error('Error al cargar los datos:', err);
      setError(
        err.response?.data?.message ||
        'No se pudo cargar la información de la sucursal y su inventario.'
      );
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando datos de la sucursal...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Volver al listado de sucursales">
            <IconButton onClick={() => navigate('/inventario/sucursal')}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {nombreSucursal ? `Inventario: ${nombreSucursal}` : `Inventario de la Sucursal #${sucursalId}`}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Agregar Medicamento
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <InventarioSucursalList
        inventario={inventario}
        onRefresh={fetchData}
      />

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <InventarioSucursalForm
          sucursalId={Number(sucursalId)}
          onSuccess={() => {
            setOpenForm(false);
            fetchData();
          }}
          onClose={() => setOpenForm(false)}
        />
      </Dialog>
    </Container>
  );
};

export default InventarioSucursalPage;
