import axios from 'axios';

const API_REPORTES_URL = import.meta.env.VITE_API_REPORTES_URL || '/api/reportes';

export const axiosReportes = axios.create({
  baseURL: API_REPORTES_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});