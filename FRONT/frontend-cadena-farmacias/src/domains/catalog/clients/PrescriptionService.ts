import { axiosClient } from '@api/clients/axiosClient';
import { Prescription, CreatePrescriptionDTO, UpdatePrescriptionDTO } from '../types/Prescription';

const BASE_PATH = '/prescripciones';

export const PrescriptionService = {
  // POST: Crear Prescripción
  createPrescription: (data: CreatePrescriptionDTO) => {
    return axiosClient.post<Prescription>(BASE_PATH, data);
  },

  // GET: Listar Todas las Prescripciones
  getAllPrescriptions: () => {
    return axiosClient.get<Prescription[]>(BASE_PATH);
  },

  // GET: Listar Prescripciones Activas
  getActivePrescriptions: () => {
    return axiosClient.get<Prescription[]>(`${BASE_PATH}/activas`);
  },

  // GET: Obtener Prescripción por ID
  getPrescriptionById: (id: number) => {
    return axiosClient.get<Prescription>(`${BASE_PATH}/${id}`);
  },

  // GET: Obtener Prescripciones por Cliente
  getPrescriptionsByClient: (clientId: number) => {
    return axiosClient.get<Prescription[]>(`${BASE_PATH}/cliente/${clientId}`);
  },

  // GET: Obtener Prescripciones por Medicamento
  getPrescriptionsByMedicine: (medicineId: number) => {
    return axiosClient.get<Prescription[]>(`${BASE_PATH}/medicamento/${medicineId}`);
  },

  // GET: Buscar Prescripciones por texto (doctor, diagnóstico, etc.)
  searchPrescriptions: (busqueda: string) => {
    return axiosClient.get<Prescription[]>(`${BASE_PATH}/buscar?busqueda=${encodeURIComponent(busqueda)}`);
  },

  // GET: Listar Prescripciones Vigentes
  getVigentesPrescriptions: () => {
    return axiosClient.get<Prescription[]>(`${BASE_PATH}/vigentes`);
  },
  
  // GET: Listar Prescripciones Vencidas
  getExpiredPrescriptions: () => {
    return axiosClient.get<Prescription[]>(`${BASE_PATH}/vencidas`);
  },

  // PUT: Actualizar Prescripción
  updatePrescription: (id: number, data: UpdatePrescriptionDTO) => {
    return axiosClient.put<Prescription>(`${BASE_PATH}/${id}`, data);
  },

  // PUT: Activar Prescripción
  activatePrescription: (id: number) => {
    return axiosClient.put(`${BASE_PATH}/${id}/activar`);
  },

  // DELETE: Desactivar Prescripción (Soft Delete)
  deactivatePrescription: (id: number) => {
    return axiosClient.delete(`${BASE_PATH}/${id}`);
  },

  // DELETE: Eliminar Prescripción (Hard Delete)
  deletePrescriptionPermanently: (id: number) => {
    return axiosClient.delete(`${BASE_PATH}/${id}/permanente`);
  }
};