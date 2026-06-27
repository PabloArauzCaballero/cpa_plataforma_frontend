export interface AuthSession {
  sessionToken: string;
  email: string;
  nombreUsuario?: string;
  nombreCompleto?: string;
  tipoUsuario?: string;
  esSuperUsuario: boolean;
  roles: string[];
  permisos: string[];
  rawUser?: unknown;
}
