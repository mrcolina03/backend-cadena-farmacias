import { axiosInventario } from '@api/clients/axiosInventario';
import {
  Sucursal,
  CreateSucursalDTO,
  UpdateSucursalDTO,
} from '../types/Sucursal';

const BASE_PATH = '/sucursales';

export const SucursalService = {
  // POST: Crear Sucursal
  createSucursal: (data: CreateSucursalDTO) => {
    return axiosInventario.post<Sucursal>(BASE_PATH, data);
  },

  // GET: Listar Todas las Sucursales (activas e inactivas)
  getAllSucursales: () => {
    return axiosInventario.get<Sucursal[]>(`${BASE_PATH}/todas`);
  },

  // GET: Listar Sucursales Inactivas
  getInactiveSucursales: () => {
    return axiosInventario.get<Sucursal[]>(`${BASE_PATH}/inactivas`);
  },

  // GET: Obtener Sucursal por ID
  getSucursalById: (id: number) => {
    return axiosInventario.get<Sucursal>(`${BASE_PATH}/${id}`);
  },

  // PUT: Actualizar Sucursal
  updateSucursal: (id: number, data: UpdateSucursalDTO) => {
    return axiosInventario.put<Sucursal>(`${BASE_PATH}/${id}`, data);
  },

  // DELETE: Desactivar Sucursal (Soft Delete)
  deactivateSucursal: (id: number) => {
    return axiosInventario.delete(`${BASE_PATH}/${id}`);
  },

  // PATCH: Activar Sucursal
  activateSucursal: (id: number) => {
    return axiosInventario.patch<Sucursal>(`${BASE_PATH}/${id}/activar`);
  },
};
