export interface Sucursal {
  id: number;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface CreateSucursalDTO {
  nombre: string;
  direccion?: string;
  ciudad?: string;
}

export interface UpdateSucursalDTO {
  nombre: string;
  direccion?: string;
  ciudad?: string;
}

export {};