import { axiosReportes } from '@api/clients/axiosReportes';
import { ResumenReporte, ReporteVenta } from '../types/Reporte';

const BASE_PATH = '/ventas';

export const ReporteService = {
  // GET: Obtener reporte de ventas por rango de fechas
  getVentasPorPeriodo: (desde: string, hasta: string) => {
    return axiosReportes.get<ReporteVenta[]>(BASE_PATH, {
      params: { desde, hasta }
    });
  },

};