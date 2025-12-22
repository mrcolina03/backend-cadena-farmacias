import React, { useState } from 'react';
import { Sucursal, CreateSucursalDTO, UpdateSucursalDTO } from '../../types/Sucursal';
import { SucursalService } from '../../clients/SucursalServices';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Alert
} from '@mui/material';

// Props del formulario
interface SucursalFormProps {
  initialData?: Sucursal; // modo edición
  onSuccess: (sucursal: Sucursal) => void;
  onClose: () => void;
}

const initialFormState: CreateSucursalDTO = {
  nombre: '',
  direccion: '',
  ciudad: '',
};

const SucursalForm: React.FC<SucursalFormProps> = ({
  initialData,
  onSuccess,
  onClose,
}) => {
  
  const [formData, setFormData] = useState<CreateSucursalDTO | UpdateSucursalDTO>(
    initialData ? {
      nombre: initialData.nombre,
      direccion: initialData.direccion,
      ciudad: initialData.ciudad,
    } : initialFormState
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (isEditing && initialData?.id) {
        // PUT – edición
        response = await SucursalService.updateSucursal(
          initialData.id,
          formData as UpdateSucursalDTO
        );
      } else {
        // POST – creación
        response = await SucursalService.createSucursal(
          formData as CreateSucursalDTO
        );
      }

      onSuccess(response.data);
      onClose();
    } catch (err: any) {
      console.error('Error al guardar sucursal:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error desconocido al guardar la sucursal.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing
          ? `Editar Sucursal ID: ${initialData?.id}`
          : 'Crear Nueva Sucursal'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            inputProps={{ maxLength: 250 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            inputProps={{ maxLength: 250 }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading
            ? 'Guardando...'
            : isEditing
              ? 'Actualizar Sucursal'
              : 'Crear Sucursal'}
        </Button>
      </Box>
    </Box>
  );
};

export default SucursalForm;
