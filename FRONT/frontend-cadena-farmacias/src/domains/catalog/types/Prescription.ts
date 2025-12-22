export interface Prescription {
  id?: number;
  clienteId: number; // Foreign Key al Cliente
  medicamentoId: number; // Foreign Key al Medicamento
  nombreMedico: string;
  numeroLicenciaMedico?: string;
  diagnostico: string;
  indicaciones: string;
  cantidad: number;
  fechaEmision: string; // Formato YYYY-MM-DD
  fechaVencimiento: string; // Formato YYYY-MM-DD
  activo?: boolean;
}

export type CreatePrescriptionDTO = Omit<Prescription, 'id' | 'activo'>;
export type UpdatePrescriptionDTO = Prescription;