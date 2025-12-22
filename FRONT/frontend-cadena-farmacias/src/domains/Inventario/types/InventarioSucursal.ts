export interface InventarioSucursal {
  id: number;
  idSucursal: number;
  idMedicamento: number;
  cantidad: number;
  stockMinimo: number;
  fechaActualizacion: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface InventarioSucursalDetallado {
  idInventario: number;

  // Medicamento (desde catálogo)
  idMedicamento: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  laboratorio: string;
  principioActivo: string;
  presentacion: string;
  precio: number;
  requiereReceta: boolean;
  fechaVencimiento: string;

  // Inventario
  cantidad: number;
  stockMinimo: number;
  estadoInventario: 'ACTIVO' | 'INACTIVO';
  fechaActualizacion: string;
}

export interface CreateInventarioSucursalDTO {
  idSucursal: number;
  idMedicamento: number;
  cantidad: number;
  stockMinimo: number;
}
