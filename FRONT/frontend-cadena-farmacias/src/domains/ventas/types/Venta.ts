export interface VentaDetalle {
  id?: number;
  medicamentoId: number;
  medicamentoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  clienteId: number;
  clienteNombre?: string;
  fecha: string;
  total: number;
  detalles: VentaDetalle[];
}

export interface DetalleVentaDTO {
  medicamentoId: number;
  cantidad: number;
}

export interface CreateVentaDTO {
  clienteId: number;
  sucursalId: number; // Requerido por tu DTO de Java
  items: DetalleVentaDTO[]; // Cambiado de 'detalles' a 'items'
}