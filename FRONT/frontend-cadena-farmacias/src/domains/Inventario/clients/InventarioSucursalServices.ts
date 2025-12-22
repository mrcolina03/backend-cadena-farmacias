import { axiosInventario } from '@api/clients/axiosInventario';
import {
  InventarioSucursal,
  InventarioSucursalDetallado,
  CreateInventarioSucursalDTO,
} from '../../Inventario/types/InventarioSucursal';

const BASE_PATH = '/inventario-sucursal';

export const InventarioSucursalService = {
  // GET: Listar TODO el inventario (todas las sucursales)
  getAllInventario: () => {
    return axiosInventario.get<InventarioSucursal[]>(BASE_PATH);
  },

  // GET: Inventario por sucursal (detallado)
  getInventarioBySucursalDetallado: (sucursalId: number) => {
    return axiosInventario.get<InventarioSucursalDetallado[]>(
      `${BASE_PATH}/sucursal/${sucursalId}/detallado`
    );
  },

  // POST: Agregar medicamento a sucursal
  createInventario: (data: CreateInventarioSucursalDTO) => {
    return axiosInventario.post<InventarioSucursal>(BASE_PATH, data);
  },

  // PUT: Actualizar cantidad (query param)
  updateCantidad: (inventarioId: number, cantidad: number) => {
    return axiosInventario.put<InventarioSucursal>(
      `${BASE_PATH}/${inventarioId}?cantidad=${cantidad}`
    );
  },

  // DELETE: Eliminación lógica
  deleteLogico: (id: number) => {
    return axiosInventario.delete(`${BASE_PATH}/logico/${id}`);
  },

  // DELETE: Eliminación física
  deleteFisico: (id: number) => {
    return axiosInventario.delete(`${BASE_PATH}/fisico/${id}`);
  },

  // PATCH: Activar inventario
  activarInventario: (id: number) => {
    return axiosInventario.patch<InventarioSucursal>(
      `${BASE_PATH}/activar/${id}`
    );
  },
};
