import { axiosClient } from '@api/clients/axiosClient';
import { Client, CreateClientDTO, UpdateClientDTO } from '../types/Client';

const BASE_PATH = '/clientes';

export const ClientService = {
  // POST: Crear Cliente
  createClient: (data: CreateClientDTO) => {
    return axiosClient.post<Client>(BASE_PATH, data);
  },

  // GET: Listar Todos los Clientes
  getAllClients: () => {
    return axiosClient.get<Client[]>(BASE_PATH);
  },

  // GET: Obtener Cliente por ID
  getClientById: (id: number) => {
    return axiosClient.get<Client>(`${BASE_PATH}/${id}`);
  },

  // GET: Obtener Cliente por Cédula
  getClientByCedula: (cedula: string) => {
    return axiosClient.get<Client>(`${BASE_PATH}/cedula/${cedula}`);
  },

  // GET: Buscar Clientes por Nombre o Apellido (usando query parameter)
  searchClients: (busqueda: string) => {
    return axiosClient.get<Client[]>(`${BASE_PATH}/buscar?busqueda=${busqueda}`);
  },

  // PUT: Actualizar Cliente
  updateClient: (id: number, data: UpdateClientDTO) => {
    return axiosClient.put<Client>(`${BASE_PATH}/${id}`, data);
  },

  // DESACTIVAR (Soft Delete)
  deactivateClient: (id: number) => {
    return axiosClient.delete(`${BASE_PATH}/${id}`);
  },

  // ELIMINAR Cliente (Hard Delete) - Opcional
  deleteClientPermanently: (id: number) => {
    return axiosClient.delete(`${BASE_PATH}/${id}/permanente`);
  },

  // PUT: Activar Cliente (Nuevo Endpoint)
  activateClient: (id: number) => {
    return axiosClient.put(`${BASE_PATH}/${id}/activar`);
  },



};