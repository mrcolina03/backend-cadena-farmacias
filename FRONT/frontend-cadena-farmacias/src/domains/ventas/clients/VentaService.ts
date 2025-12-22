import axios from 'axios';
import { Venta, CreateVentaDTO } from '../types/Venta';

// Creamos una instancia específica para Ventas usando la variable de entorno
const VENTA_API_URL = import.meta.env.VITE_API_VENTAS_URL || '/api/ventas';

const ventaAxios = axios.create({
  baseURL: VENTA_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const VentaService = {
  // GET: Obtener todas las ventas
  getAllVentas: () => {
    return ventaAxios.get<Venta[]>('');
  },

  // GET: Obtener una venta por ID
  getVentaById: (id: number) => {
    return ventaAxios.get<Venta>(`/${id}`);
  },

  // POST: Registrar una nueva venta
  createVenta: (data: CreateVentaDTO) => {
    return ventaAxios.post<Venta>('', data);
  },

  // DELETE: Anular una venta (si tu backend lo permite)
  deleteVenta: (id: number) => {
    return ventaAxios.delete(`/${id}`);
  }
};