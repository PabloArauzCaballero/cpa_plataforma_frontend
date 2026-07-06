export interface LoginResponseDto {
  success?: boolean;
  message?: string;
  data?: {
    sessionToken?: string;
    session_token?: string;
    idSesion?: string | number;
    id_sesion?: string | number;
    sessionId?: string | number;
    session_id?: string | number;
    token?: string;
    tokenType?: string;
    user?: Record<string, unknown>;
    usuario?: Record<string, unknown>;
    roles?: unknown[];
    permisos?: unknown[];
    permissions?: unknown[];
  };
  sessionToken?: string;
  session_token?: string;
  idSesion?: string | number;
  id_sesion?: string | number;
  sessionId?: string | number;
  session_id?: string | number;
  token?: string;
  user?: Record<string, unknown>;
  usuario?: Record<string, unknown>;
  roles?: unknown[];
  permisos?: unknown[];
  permissions?: unknown[];
}
