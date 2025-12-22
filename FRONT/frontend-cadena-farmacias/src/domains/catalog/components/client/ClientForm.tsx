import React, { useState } from 'react';
import { Client, CreateClientDTO, UpdateClientDTO } from '../../types/Client';
import { ClientService } from '../../clients/ClientService';
import { extractErrorMessage } from '@api/clients/axiosClient';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Typography,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

interface ClientFormProps {
  initialData?: Client; // Opcional para el modo edición
  onSuccess: (client: Client) => void;
  onClose: () => void;
}

const initialFormState: CreateClientDTO = {
  cedula: '',
  nombres: '',
  apellidos: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: new Date(1990, 0, 1).toISOString().split('T')[0], // Default a una fecha genérica
  genero: undefined,
};

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<CreateClientDTO | UpdateClientDTO>(
    initialData ? initialData : initialFormState
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setError(null);
  };
  
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación simple del lado del cliente
    if (!formData.cedula || !formData.nombres || !formData.apellidos || !formData.email) {
        setError("Los campos Cédula, Nombres, Apellidos y Email son obligatorios.");
        setLoading(false);
        return;
    }

    try {
      let response;
      
      if (isEditing && initialData?.id) {
        // Modo Edición (PUT)
        response = await ClientService.updateClient(initialData.id, formData as UpdateClientDTO);
      } else {
        // Modo Creación (POST)
        response = await ClientService.createClient(formData as CreateClientDTO);
      }
      
      onSuccess(response.data);
      
    } catch (err: any) {
      console.error("Error al guardar cliente:", err);
      // Asume que el backend devuelve un mensaje de error útil (ej. Cédula duplicada)
      const errorMessage = extractErrorMessage(err) || 'Error al guardar el cliente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? `Editar Cliente ID: ${initialData?.id}` : 'Crear Nuevo Cliente'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cédula (Única)"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            required
            inputProps={{ maxLength: 10 }}
            disabled={isEditing} // Generalmente, la cédula no se edita
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            name="fechaNacimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
                <InputLabel>Género</InputLabel>
                <Select
                    label="Género"
                    name="genero"
                    value={formData.genero || ''}
                    onChange={handleSelectChange}
                >
                    <MenuItem value=""><em>Seleccione</em></MenuItem>
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                </Select>
            </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar Cliente' : 'Crear Cliente')}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientForm;