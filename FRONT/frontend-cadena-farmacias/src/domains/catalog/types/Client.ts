export interface Client {
  id?: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string; // Formato YYYY-MM-DD
  genero?: 'Masculino' | 'Femenino' | 'Otro';
  activo?: boolean;
}

export type CreateClientDTO = Omit<Client, 'id' | 'activo'>;
export type UpdateClientDTO = Client;