export interface LoginResponseDto {
  success?: boolean;
  message?: string;
  data?: {
    sessionToken?: string;
    token?: string;
    tokenType?: string;
    user?: Record<string, unknown>;
    usuario?: Record<string, unknown>;
    roles?: unknown[];
    permisos?: unknown[];
    permissions?: unknown[];
  };
  sessionToken?: string;
  token?: string;
  user?: Record<string, unknown>;
  usuario?: Record<string, unknown>;
  roles?: unknown[];
  permisos?: unknown[];
  permissions?: unknown[];
}
