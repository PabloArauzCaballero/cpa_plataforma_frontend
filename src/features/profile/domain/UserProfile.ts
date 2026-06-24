export interface UserProfile {
  idPersona: string;
  username: string;
  email: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  telefono: string;
  tipoUsuario: string;
  estado: string;
  esSuperUsuario: boolean;
  roles: string[];
  permisos: string[];
  rawData: Record<string, unknown>;
}
