import axios from 'axios';

const API_VENTAS_URL = import.meta.env.VITE_API_VENTAS_URL || '/api/ventas';

export const axiosVentas = axios.create({
  baseURL: API_VENTAS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});