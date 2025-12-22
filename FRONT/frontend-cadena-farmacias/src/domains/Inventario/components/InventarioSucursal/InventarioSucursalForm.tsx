import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Alert, Grid, Typography,
  Select, MenuItem, FormControl, InputLabel, CircularProgress, SelectChangeEvent
} from '@mui/material';

import { InventarioSucursalService } from '../../clients/InventarioSucursalServices';
import { MedicineService } from '@domains/catalog/clients/MedicineService';
import { Medicine } from '@domains/catalog/types/Medicine';

interface Props {
  sucursalId: number;
  onSuccess: () => void;
  onClose: () => void;
}

const InventarioSucursalForm: React.FC<Props> = ({
  sucursalId, onSuccess, onClose
}) => {
  const [idMedicamento, setIdMedicamento] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [stockMinimo, setStockMinimo] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loadingMedicines, setLoadingMedicines] = useState(true);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoadingMedicines(true);
        const response = await MedicineService.getAllMedicines();
        setMedicines(response.data);
      } catch (err) {
        setError('No se pudieron cargar los medicamentos.');
      } finally {
        setLoadingMedicines(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (idMedicamento === '' || !cantidad || !stockMinimo) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (cantidad < stockMinimo) {
      setError('La cantidad no puede ser menor que el stock mínimo.');
      return;
    }

    try {
      setLoading(true);
      await InventarioSucursalService.createInventario({
        idSucursal: sucursalId,
        idMedicamento: Number(idMedicamento),
        cantidad,
        stockMinimo,
      });
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Error al agregar medicamento al inventario.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Agregar Medicamento a Sucursal
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          {loadingMedicines ? (
            <CircularProgress />
          ) : (
            <FormControl fullWidth required>
              <InputLabel id="medicamento-select-label">Medicamento</InputLabel>
              <Select
                labelId="medicamento-select-label"
                value={idMedicamento}
                label="Medicamento"
                onChange={(e: SelectChangeEvent<number | ''>) => setIdMedicamento(e.target.value as number | '')}
              >
                <MenuItem value="" disabled>
                  <em>Seleccione un medicamento</em>
                </MenuItem>
                {medicines.map((med) => (
                  <MenuItem key={med.id} value={med.id}>
                    {med.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Stock mínimo"
            type="number"
            fullWidth
            value={stockMinimo}
            onChange={(e) => setStockMinimo(Number(e.target.value))}
            required
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Agregando...' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
};

export default InventarioSucursalForm;
