import React, { useState } from 'react';
import { Medicine, CreateMedicineDTO, UpdateMedicineDTO } from '../../types/Medicine';
import { MedicineService } from '../../clients/MedicineService';
import { extractErrorMessage } from '@api/clients/axiosClient';
import { 
  Box, 
  Button, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Grid, 
  Typography,
  Alert 
} from '@mui/material';

// Definimos las props del formulario
interface MedicineFormProps {
  initialData?: Medicine; // Opcional para el modo edición
  onSuccess: (medicine: Medicine) => void; // Callback al completar
  onClose: () => void; // Callback para cerrar el formulario (ej. Modal)
}

const initialFormState: CreateMedicineDTO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  laboratorio: '',
  principioActivo: '',
  presentacion: '',
  precio: 0,
  requiereReceta: false,
  fechaVencimiento: new Date().toISOString().split('T')[0], // Default a hoy
};

const MedicineForm: React.FC<MedicineFormProps> = ({ initialData, onSuccess, onClose }) => {
  // Inicializa el estado con los datos iniciales o con el estado vacío
  const [formData, setFormData] = useState<CreateMedicineDTO | UpdateMedicineDTO>(
    initialData ? initialData : initialFormState
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Manejo de checkbox/switch
    if (type === 'checkbox') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: (e.target as HTMLInputElement).checked 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'precio' ? parseFloat(value) : value 
      }));
    }
    setError(null); // Limpiar errores al cambiar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (isEditing && initialData?.id) {
        // Modo Edición (PUT)
        response = await MedicineService.updateMedicine(initialData.id, formData as UpdateMedicineDTO);
      } else {
        // Modo Creación (POST)
        // Aseguramos que el precio sea válido
        if (typeof formData.precio !== 'number' || formData.precio <= 0) {
            setError("El precio debe ser un número positivo.");
            setLoading(false);
            return;
        }
        response = await MedicineService.createMedicine(formData as CreateMedicineDTO);
      }
      
      onSuccess(response.data);
      onClose(); // Cierra el formulario tras el éxito
      
    } catch (err: any) {
      console.error("Error al guardar medicamento:", err);
      // Intentamos obtener un mensaje de error más específico del backend
      const errorMessage = extractErrorMessage(err) || 'Error desconocido al guardar.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? `Editar Medicamento ID: ${initialData?.id}` : 'Crear Nuevo Medicamento'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Código (Único)"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
            disabled={isEditing} // No permitir cambiar el código en edición para evitar inconsistencias
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Laboratorio"
            name="laboratorio"
            value={formData.laboratorio}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Principio Activo"
            name="principioActivo"
            value={formData.principioActivo}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Presentación"
            name="presentacion"
            value={formData.presentacion}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Precio"
            name="precio"
            type="number"
            value={formData.precio}
            onChange={handleChange}
            inputProps={{ step: "0.01", min: "0.01" }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Fecha Vencimiento"
            name="fechaVencimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.fechaVencimiento}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.requiereReceta}
                onChange={handleChange}
                name="requiereReceta"
              />
            }
            label="Requiere Receta Médica"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar Medicamento' : 'Crear Medicamento')}
        </Button>
      </Box>
    </Box>
  );
};

export default MedicineForm;