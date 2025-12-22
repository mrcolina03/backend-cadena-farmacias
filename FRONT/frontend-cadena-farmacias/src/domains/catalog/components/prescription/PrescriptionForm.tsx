import React, { useState, useEffect } from 'react';
import { Prescription, CreatePrescriptionDTO, UpdatePrescriptionDTO } from '../../types/Prescription';
import { Client } from '../../types/Client';
import { Medicine } from '../../types/Medicine';
import { PrescriptionService } from '../../clients/PrescriptionService';
import { ClientService } from '../../clients/ClientService';
import { MedicineService } from '../../clients/MedicineService';
import { extractErrorMessage } from '@api/clients/axiosClient';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface PrescriptionFormProps {
  initialData?: Prescription;
  onSuccess: (prescription: Prescription) => void;
  onClose: () => void;
}

const initialFormState: CreatePrescriptionDTO = {
  clienteId: 0,
  medicamentoId: 0,
  nombreMedico: '',
  numeroLicenciaMedico: '',
  diagnostico: '',
  indicaciones: '',
  cantidad: 1,
  fechaEmision: new Date().toISOString().split('T')[0],
  fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
};

const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ initialData, onSuccess, onClose }) => {
  const [formData, setFormData] = useState<CreatePrescriptionDTO | UpdatePrescriptionDTO>(
    initialData ? initialData : initialFormState
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para datos maestros (Lookups)
  const [clients, setClients] = useState<Client[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const isEditing = !!initialData;

  // --- Lógica para cargar Clientes y Medicamentos ---
  useEffect(() => {
    const fetchLookups = async () => {
        try {
            // Asumimos que los servicios devuelven solo activos o filtramos en el cliente
            const [clientsRes, medicinesRes] = await Promise.all([
                ClientService.getAllClients(),
                MedicineService.getAllMedicines(),
            ]);
            
            // Filtramos solo clientes y medicamentos activos/no eliminados
            const activeClients = clientsRes.data.filter(c => c.activo !== false);
            const activeMedicines = medicinesRes.data.filter(m => m.activo !== false);
            
            setClients(activeClients);
            setMedicines(activeMedicines);

        } catch (err) {
            console.error("Error fetching lookups:", err);
            setError("No se pudieron cargar la lista de clientes o medicamentos.");
        }
    };
    fetchLookups();
  }, []);
  // ---------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'clienteId' || name === 'medicamentoId' || name === 'cantidad' ? parseInt(value) : value 
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación de IDs
    if (!formData.clienteId || !formData.medicamentoId || formData.cantidad <= 0) {
        setError("Debe seleccionar un cliente, un medicamento y la cantidad debe ser positiva.");
        setLoading(false);
        return;
    }

    try {
      let response;
      
      if (isEditing && initialData?.id) {
        // Modo Edición (PUT)
        response = await PrescriptionService.updatePrescription(initialData.id, formData as UpdatePrescriptionDTO);
      } else {
        // Modo Creación (POST)
        response = await PrescriptionService.createPrescription(formData as CreatePrescriptionDTO);
      }
      
      onSuccess(response.data);
      onClose();
      
    } catch (err: any) {
      console.error("Error al guardar prescripción:", err);
      const errorMessage = extractErrorMessage(err) || 'Error desconocido al guardar la prescripción.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? `Editar Prescripción ID: ${initialData?.id}` : 'Crear Nueva Prescripción'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {/* Seleccionar Cliente */}
        <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
                <InputLabel>Cliente</InputLabel>
                <Select
                    label="Cliente"
                    name="clienteId"
                    value={formData.clienteId || ''}
                    onChange={handleChange}
                    disabled={isEditing} // No permitir cambiar cliente/medicamento en edición simple
                >
                    <MenuItem value={0} disabled>Seleccione un cliente</MenuItem>
                    {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                            {client.nombres} {client.apellidos} ({client.cedula})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>

        {/* Seleccionar Medicamento */}
        <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
                <InputLabel>Medicamento</InputLabel>
                <Select
                    label="Medicamento"
                    name="medicamentoId"
                    value={formData.medicamentoId || ''}
                    onChange={handleChange}
                    disabled={isEditing}
                >
                    <MenuItem value={0} disabled>Seleccione un medicamento</MenuItem>
                    {medicines.map((med) => (
                        <MenuItem key={med.id} value={med.id}>
                            {med.nombre} ({med.codigo})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Nombre del Médico"
            name="nombreMedico"
            value={formData.nombreMedico}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Licencia Médica"
            name="numeroLicenciaMedico"
            value={formData.numeroLicenciaMedico}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Diagnóstico"
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Indicaciones de Uso"
            name="indicaciones"
            value={formData.indicaciones}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Cantidad Recetada"
            name="cantidad"
            type="number"
            value={formData.cantidad}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Fecha de Emisión"
            name="fechaEmision"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.fechaEmision}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Fecha de Vencimiento"
            name="fechaVencimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.fechaVencimiento}
            onChange={handleChange}
            required
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar Prescripción' : 'Crear Prescripción')}
        </Button>
      </Box>
    </Box>
  );
};

export default PrescriptionForm;