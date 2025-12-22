export interface ReporteVenta {
  id: number;
  fecha: string;
  clienteId: number;
  sucursalId: number;
  total: number;
}

export interface ProductoMasVendido {
  nombre: string;
  cantidad: number;
  ingresos: number;
}

export interface ResumenReporte {
  totalVentas: number;
  totalIngresos: number;
  periodo: string;
  datosGrafico: ReporteVenta[];
  productosTop: ProductoMasVendido[];
}