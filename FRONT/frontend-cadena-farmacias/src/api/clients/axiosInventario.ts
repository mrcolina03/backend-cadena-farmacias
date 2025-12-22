import axios from 'axios';

const INVENTARIO_BASE_URL =
  import.meta.env.VITE_API_INVENTARIO_URL || '/api/inventario';

export const axiosInventario = axios.create({
  baseURL: INVENTARIO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
