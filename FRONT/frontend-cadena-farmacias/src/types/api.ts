// src/types/api.ts

export interface DetalleVentaDTO {
  medicamentoId: number;
  cantidad: number;
}

export interface VentaRequestDTO {
  clienteId: number;
  sucursalId: number;
  items: DetalleVentaDTO[];
}

// Suponiendo una estructura básica para la entidad Venta
export interface Venta {
  id: number;
  clienteId: number;
  sucursalId: number;
  fecha: string; // ISO date string
  total: number;
  // Añade otros campos que pueda tener la entidad Venta
}