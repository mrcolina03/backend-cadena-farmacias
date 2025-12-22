import React, { useState, useEffect } from 'react';
import { Medicine } from '../types/Medicine';
import { MedicineService } from '../clients/MedicineService';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MedicineForm from '../components/medicine/MedicineForm'; // Importamos el formulario

const MedicineListPage: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false); // Controla el modal del formulario
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | undefined>(undefined); // Para edición
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await MedicineService.getAllMedicines();
      // Filtramos solo los activos si el backend lo permite (la ruta getAll devuelve todos)
      // Si el backend soporta soft delete, filtramos por 'activo' si lo devuelve en la respuesta.
      setMedicines(response.data); 
      
    } catch (err) {
      console.error("Error al obtener medicamentos:", err);
      setError('No se pudieron cargar los medicamentos. Verifique la conexión al backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleOpenCreate = () => {
    setSelectedMedicine(undefined); // Asegurarse de que sea modo creación
    setOpenForm(true);
  };

  const handleOpenEdit = (medicine: Medicine) => {
    setSelectedMedicine(medicine); // Establecer medicamento para edición
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedMedicine(undefined);
  };

  const handleSuccess = (medicine: Medicine) => {
    handleCloseForm();
    setSuccessMessage(`Medicamento "${medicine.nombre}" guardado exitosamente.`);
    fetchMedicines(); // Recargar la lista
    setTimeout(() => setSuccessMessage(null), 4000); // Ocultar mensaje de éxito
  };
  
  const handleDeactivate = async (id: number, nombre: string) => {
      if (!window.confirm(`¿Está seguro de desactivar (Soft Delete) el medicamento ${nombre}?`)) {
          return;
      }
      try {
          await MedicineService.deactivateMedicine(id);
          setSuccessMessage(`Medicamento "${nombre}" desactivado exitosamente.`);
          fetchMedicines(); // Recargar la lista
          setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
          setError(`Error al desactivar el medicamento ${nombre}.`);
      }
  };

  const handleActivate = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro de activar el medicamento ${nombre}?`)) return;
    try {
      await MedicineService.activateMedicine(id);
      setSuccessMessage(`Medicamento "${nombre}" activado exitosamente.`);
      fetchMedicines();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al activar el medicamento ${nombre}.`);
    }
  };

  const handleDeletePermanently = async (id: number, nombre: string) => {
    if (!window.confirm(`ADVERTENCIA: ¿Está seguro de ELIMINAR PERMANENTEMENTE el medicamento ${nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await MedicineService.deleteMedicinePermanently(id);
      setSuccessMessage(`Medicamento "${nombre}" eliminado permanentemente.`);
      fetchMedicines();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al eliminar permanentemente el medicamento ${nombre}.`);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando catálogo...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Listado de Medicamentos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenCreate}
        >
          Crear Medicamento
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      {medicines.length === 0 ? (
        <Alert severity="info">No hay medicamentos registrados en el catálogo.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="medicine table">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Laboratorio</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell>Receta Req.</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id} sx={{ backgroundColor: medicine.activo === false ? '#ffebee' : 'inherit' }}>
                  <TableCell>{medicine.codigo}</TableCell>
                  <TableCell>{medicine.nombre}</TableCell>
                  <TableCell>{medicine.laboratorio}</TableCell>
                  <TableCell align="right">${medicine.precio ? medicine.precio.toFixed(2) : 'N/A'}</TableCell>
                  <TableCell>{medicine.requiereReceta ? 'Sí' : 'No'}</TableCell>
                  <TableCell>{medicine.activo === false ? 'No' : 'Sí'}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEdit(medicine)}
                        disabled={medicine.activo === false}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {medicine.activo === false ? (
                      <Tooltip title="Activar Medicamento">
                        <IconButton color="success" onClick={() => handleActivate(medicine.id!, medicine.nombre)}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Desactivar (Soft Delete)">
                        <IconButton color="warning" onClick={() => handleDeactivate(medicine.id!, medicine.nombre)}>
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Eliminar Permanentemente (Hard Delete)">
                      <IconButton color="error" onClick={() => handleDeletePermanently(medicine.id!, medicine.nombre)}>
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
      
      {/* Modal/Dialog para el formulario de creación/edición */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMedicine ? 'Editar Medicamento' : 'Crear Nuevo Medicamento'}</DialogTitle>
        <DialogContent>
          <MedicineForm
            initialData={selectedMedicine}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MedicineListPage;