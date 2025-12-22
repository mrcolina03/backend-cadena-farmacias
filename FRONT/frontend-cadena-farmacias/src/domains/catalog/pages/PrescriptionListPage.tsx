import React, { useState, useEffect } from 'react';
import { Prescription } from '../types/Prescription';
// Se eliminaron imports de Client/Medicine porque ya no se usan en estado
import { PrescriptionService } from '../clients/PrescriptionService';
import { ClientService } from '../clients/ClientService'; // Necesario para lookups
import { MedicineService } from '../clients/MedicineService'; // Necesario para lookups
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
import PrescriptionForm from '../components/prescription/PrescriptionForm';

// Definimos el tipo enriquecido para la lista, incluyendo nombres
interface EnrichedPrescription extends Prescription {
    clientName: string;
    medicineName: string;
}

const PrescriptionListPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<EnrichedPrescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // (No guardamos los mapas de lookup en estado porque no se leen fuera de la carga)

  // --- Función principal de carga y enriquecimiento ---
  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cargar datos maestros (Lookups)
      const [clientsRes, medicinesRes] = await Promise.all([
        ClientService.getAllClients(),
        MedicineService.getAllMedicines(),
      ]);
      
      const newClientMap = new Map(clientsRes.data.map(c => [c.id!, c]));
      const newMedicineMap = new Map(medicinesRes.data.map(m => [m.id!, m]));

      // 2. Cargar Prescripciones
      const prescriptionsRes = await PrescriptionService.getAllPrescriptions(); 
      
      // 3. Enriquecer las prescripciones con los nombres
      const enrichedList: EnrichedPrescription[] = prescriptionsRes.data.map(p => {
          const client = newClientMap.get(p.clienteId);
          const medicine = newMedicineMap.get(p.medicamentoId);
          
          return {
              ...p,
              // Usamos el nombre si existe, sino indicamos el ID o un marcador de error
              clientName: client ? `${client.nombres} ${client.apellidos}` : `Cliente ID ${p.clienteId} (No encontrado)`,
              medicineName: medicine ? medicine.nombre : `Medicamento ID ${p.medicamentoId} (No encontrado)`,
          }
      });
      
      setPrescriptions(enrichedList); 
      
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setError('No se pudieron cargar las prescripciones ni sus datos asociados. Verifique la conexión al backend.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // --- Handlers de UI (Iguales a la versión anterior) ---
  const handleOpenCreate = () => {
    setSelectedPrescription(undefined);
    setOpenForm(true);
  };

  const handleOpenEdit = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedPrescription(undefined);
  };

  const handleSuccess = (prescription: Prescription) => {
    handleCloseForm();
    setSuccessMessage(`Prescripción ID ${prescription.id} guardada exitosamente.`);
    fetchPrescriptions(); // Recargar la lista con los nuevos datos enriquecidos
    setTimeout(() => setSuccessMessage(null), 4000);
  };
  
  const handleDeactivate = async (id: number) => {
      if (!window.confirm(`¿Está seguro de desactivar (Soft Delete) la prescripción ID ${id}?`)) {
          return;
      }
      try {
          await PrescriptionService.deactivatePrescription(id);
          setSuccessMessage(`Prescripción ID ${id} desactivada exitosamente.`);
          fetchPrescriptions();
          setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
          setError(`Error al desactivar la prescripción ID ${id}.`);
      }
  };

  const handleActivate = async (id: number) => {
    if (!window.confirm(`¿Está seguro de activar la prescripción ID ${id}?`)) return;
    try {
      await PrescriptionService.activatePrescription(id);
      setSuccessMessage(`Prescripción ID ${id} activada exitosamente.`);
      fetchPrescriptions();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al activar la prescripción ID ${id}.`);
    }
  };

  const handleDeletePermanently = async (id: number) => {
    if (!window.confirm(`ADVERTENCIA: ¿Está seguro de ELIMINAR PERMANENTEMENTE la prescripción ID ${id}? Esta acción no se puede deshacer.`)) return;
    try {
      await PrescriptionService.deletePrescriptionPermanently(id);
      setSuccessMessage(`Prescripción ID ${id} eliminada permanentemente.`);
      fetchPrescriptions();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(`Error al eliminar permanentemente la prescripción ID ${id}.`);
    }
  };
  
  const isExpired = (fechaVencimiento: string | undefined) => {
    if (!fechaVencimiento) return false;
    return new Date(fechaVencimiento) < new Date();
  };

  // --- Renderizado ---
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando prescripciones y datos de catálogo...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Listado de Prescripciones
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpenCreate}
        >
          Crear Prescripción
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      {prescriptions.length === 0 ? (
        <Alert severity="info">No hay prescripciones registradas.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="prescription table">
            <TableHead>
              <TableRow>
                
                <TableCell>Cliente</TableCell> {/* ⬅️ CAMBIO */}
                <TableCell>Medicamento</TableCell> {/* ⬅️ CAMBIO */}
                <TableCell>Médico</TableCell>
                <TableCell>Emisión</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Vigente</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prescriptions.map((p) => (
                <TableRow 
                    key={p.id} 
                    sx={{ 
                        backgroundColor: p.activo === false ? '#ffebee' : isExpired(p.fechaVencimiento) ? '#fff8e1' : 'inherit' 
                    }}
                >
                  
                  <TableCell>{p.clientName}</TableCell> {/* ⬅️ CAMBIO */}
                  <TableCell>{p.medicineName}</TableCell> {/* ⬅️ CAMBIO */}
                  <TableCell>{p.nombreMedico}</TableCell>
                  <TableCell>{p.fechaEmision}</TableCell>
                  <TableCell>{p.fechaVencimiento}</TableCell>
                  <TableCell>{isExpired(p.fechaVencimiento) ? 'No' : 'Sí'}</TableCell>
                  <TableCell>{p.activo === false ? 'No' : 'Sí'}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Editar">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEdit(p)}
                        disabled={p.activo === false || isExpired(p.fechaVencimiento)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {p.activo === false ? (
                      <Tooltip title="Activar Prescripción">
                        <IconButton color="success" onClick={() => handleActivate(p.id!)}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Desactivar (Soft Delete)">
                        <IconButton color="warning" onClick={() => handleDeactivate(p.id!)}>
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Eliminar Permanentemente (Hard Delete)">
                      <IconButton color="error" onClick={() => handleDeletePermanently(p.id!)}>
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
        <DialogTitle>{selectedPrescription ? 'Editar Prescripción' : 'Crear Nueva Prescripción'}</DialogTitle>
        <DialogContent>
          {/* Le pasamos el objeto Prescription, no el objeto EnrichedPrescription */}
          <PrescriptionForm
            initialData={selectedPrescription}
            onSuccess={handleSuccess}
            onClose={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PrescriptionListPage;