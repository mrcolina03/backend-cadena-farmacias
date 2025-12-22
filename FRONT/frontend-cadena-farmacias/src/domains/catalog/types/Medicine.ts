export interface Medicine {
  id?: number; // Asumimos que el ID lo genera el backend
  codigo: string;
  nombre: string;
  descripcion: string;
  laboratorio: string;
  principioActivo?: string; // Opcional en uno de los ejemplos de error, pero lo mantenemos
  presentacion: string;
  precio: number;
  requiereReceta: boolean;
  fechaVencimiento?: string; // Formato YYYY-MM-DD
  activo?: boolean; // Para soft delete
}

// Tipo para la creación (no requiere ID)
export type CreateMedicineDTO = Omit<Medicine, 'id' | 'activo'>;

// Tipo para la actualización (incluye todos los campos)
export type UpdateMedicineDTO = Medicine;