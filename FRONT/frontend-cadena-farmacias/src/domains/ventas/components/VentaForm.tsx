import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Autocomplete,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import { VentaService } from '../clients/VentaService';
import { ClientService } from '../../catalog/clients/ClientService';
import { MedicineService } from '../../catalog/clients/MedicineService';
import { SucursalService } from '../../Inventario/clients/SucursalServices';

import { Client } from '../../catalog/types/Client';
import { Medicine } from '../../catalog/types/Medicine';
import { CreateVentaDTO } from '../types/Venta';
import { extractErrorMessage } from '@api/clients/axiosClient';

interface CartItem {
  medicine: Medicine;
  quantity: number;
  precioUnitario: number;
}

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

const VentaForm: React.FC<Props> = ({ onSuccess, onClose }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSucursal, setSelectedSucursal] = useState<any | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoadingCatalog(true);
      try {
        const [resClients, resMedicines, resSucursales] = await Promise.all([
          ClientService.getAllClients(),
          MedicineService.getAllMedicines(),
          SucursalService.getAllSucursales()
        ]);

        setClients(resClients.data);
        setMedicines(resMedicines.data.filter((m: any) => m.activo));
        setSucursales(resSucursales.data);
      } catch {
        setError('Error al cargar datos iniciales');
      } finally {
        setLoadingCatalog(false);
      }
    };
    loadData();
  }, []);

  // ✅ CORREGIDO
  const addToCart = (medicine: Medicine | null) => {
    if (!medicine) return;

    const precioUnitario = Number(medicine.precio);

    const exists = cart.find(item => item.medicine.id === medicine.id);

    if (exists) {
      setCart(cart.map(item =>
        item.medicine.id === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([
        ...cart,
        { medicine, quantity: 1, precioUnitario }
      ]);
    }
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.medicine.id !== id));
  };

  // ✅ TOTAL REAL
  const calculateTotal = () =>
    cart.reduce(
      (acc, item) => acc + item.precioUnitario * item.quantity,
      0
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) return setError('Debe seleccionar un cliente');
    if (!selectedSucursal) return setError('Debe seleccionar una sucursal');
    if (cart.length === 0) return setError('El carrito está vacío');

    const ventaDTO: CreateVentaDTO = {
      clienteId: selectedClient.id!,
      sucursalId: selectedSucursal.id!,
      items: cart.map(item => ({
        medicamentoId: item.medicine.id!,
        cantidad: item.quantity
      }))
    };

    try {
      await VentaService.createVenta(ventaDTO);
      onSuccess();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  if (loadingCatalog) {
    return (
      <Box textAlign="center" p={3}>
        <CircularProgress />
        <Typography>Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={sucursales}
            getOptionLabel={(o) => o.nombre || `Sucursal ${o.id}`}
            onChange={(_, v) => setSelectedSucursal(v)}
            renderInput={(p) =>
              <TextField {...p} label="Sucursal" required />
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Autocomplete
            options={clients}
            getOptionLabel={(o) => `${o.cedula} - ${o.nombres}`}
            onChange={(_, v) => setSelectedClient(v)}
            renderInput={(p) =>
              <TextField {...p} label="Cliente" required />
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            options={medicines}
            getOptionLabel={(o) => `${o.nombre} - $${o.precio}`}
            onChange={(_, v) => addToCart(v)}
            renderInput={(p) =>
              <TextField {...p} label="Agregar medicamento" />
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="right">Precio</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>

              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.medicine.id}>
                    <TableCell>{item.medicine.nombre}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      ${item.precioUnitario.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ${(item.precioUnitario * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.medicine.id!)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {cart.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="right" >
                      TOTAL
                    </TableCell>
                    <TableCell align="right" >
                      ${calculateTotal().toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!selectedClient || !selectedSucursal || cart.length === 0}
        >
          Confirmar Venta
        </Button>
      </Box>
    </Box>
  );
};

export default VentaForm;
