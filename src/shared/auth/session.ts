export interface StoredUserSession {
  sessionToken: string;
  idSesion?: string;
  email: string;
  nombreUsuario?: string;
  nombreCompleto?: string;
  tipoUsuario?: string;
  esSuperUsuario: boolean;
  roles: string[];
  permisos: string[];
  rawUser?: unknown;
}

const TOKEN_KEYS = ['cpa.sessionToken', 'cpa_session_token'];
const EMAIL_KEYS = ['cpa.userEmail', 'cpa_user_email'];
const SESSION_KEY = 'cpa.session';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readFirstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

/** Normaliza roles y permisos a un token comparable (`Super Admin` → `SUPER_ADMIN`). */
export function normalizeToken(value: string): string {
  return value.trim().toUpperCase().replace(/[\s-]+/g, '_');
}

function readStringArray(...values: unknown[]): string[] {
  const output = new Set<string>();

  for (const value of values) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === 'string' && item.trim()) output.add(normalizeToken(item));
        else if (isRecord(item)) {
          const text = readFirstString(item.codigo, item.nombre, item.name, item.rol, item.role, item.permiso, item.permission);
          if (text) output.add(normalizeToken(text));
        }
      });
    } else if (typeof value === 'string' && value.trim()) {
      value.split(',').map((item) => item.trim()).filter(Boolean).forEach((item) => output.add(normalizeToken(item)));
    }
  }

  return Array.from(output);
}

function readStoredJson(): StoredUserSession | null {
  const value = window.localStorage.getItem(SESSION_KEY);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as StoredUserSession;
    if (parsed?.sessionToken) return parsed;
  } catch {
    return null;
  }
  return null;
}

export function getSessionToken(): string | null {
  const tokenFromKeys = TOKEN_KEYS.map((key) => window.localStorage.getItem(key)).find((value): value is string => Boolean(value?.trim()));
  if (tokenFromKeys) return tokenFromKeys.trim();

  const session = readStoredJson();
  return session?.sessionToken?.trim() || session?.idSesion?.trim() || null;
}

export function getStoredSession(): StoredUserSession | null {
  const session = readStoredJson();
  if (session) return session;

  const token = getSessionToken();
  if (!token) return null;

  const email = EMAIL_KEYS.map((key) => window.localStorage.getItem(key)).find((value): value is string => Boolean(value?.trim())) ?? 'Usuario CPA';
  return {
    sessionToken: token,
    email,
    esSuperUsuario: false,
    roles: [],
    permisos: [],
  };
}

export function saveStoredSession(session: StoredUserSession): void {
  TOKEN_KEYS.forEach((key) => window.localStorage.setItem(key, session.sessionToken));
  EMAIL_KEYS.forEach((key) => window.localStorage.setItem(key, session.email));
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  [...TOKEN_KEYS, ...EMAIL_KEYS, SESSION_KEY].forEach((key) => window.localStorage.removeItem(key));
}

export function buildStoredSessionFromLoginResponse(response: unknown, fallbackLogin: string): StoredUserSession {
  const root = isRecord(response) ? response : {};
  const data = isRecord(root.data) ? root.data : root;
  const user = isRecord(data.user)
    ? data.user
    : isRecord(data.usuario)
      ? data.usuario
      : isRecord(root.user)
        ? root.user
        : {};

  const idSesion = readFirstString(data.idSesion, data.id_sesion, data.sessionId, data.session_id, root.idSesion, root.id_sesion, root.sessionId, root.session_id);
  const sessionToken = readFirstString(data.sessionToken, data.token, data.session_token, root.sessionToken, root.token, root.session_token, idSesion);
  if (!sessionToken) throw new Error('La respuesta de login no incluye data.sessionToken ni data.id_sesion.');

  const nombres = readFirstString(user.nombres, user.nombre, user.firstName);
  const apellidos = readFirstString(user.apellidos, user.apellido, user.lastName);
  const nombreCompleto = readFirstString(user.nombre_completo, user.nombreCompleto, [nombres, apellidos].filter(Boolean).join(' '));
  const email = readFirstString(user.email, data.email, root.email, fallbackLogin) ?? fallbackLogin;
  const nombreUsuario = readFirstString(user.nombre_usuario, user.usuario, user.username, data.nombre_usuario, root.nombre_usuario);
  const tipoUsuario = readFirstString(user.tipo_usuario, user.tipoUsuario, user.rol, user.role, data.tipo_usuario, root.tipo_usuario);
  const esSuperUsuario = Boolean(user.es_super_usuario ?? user.esSuperUsuario ?? data.es_super_usuario ?? data.esSuperUsuario)
    || normalizeToken(tipoUsuario ?? '').includes('SUPER_ADMIN');
  const roles = readStringArray(user.roles, user.rol, user.role, user.tipo_usuario, data.roles, root.roles, tipoUsuario);
  const permisos = readStringArray(user.permisos, user.permissions, data.permisos, data.permissions, root.permisos, root.permissions);

  return {
    sessionToken,
    idSesion,
    email,
    nombreUsuario,
    nombreCompleto,
    tipoUsuario,
    esSuperUsuario,
    roles,
    permisos,
    rawUser: user,
  };
}

function parsePermissionString(value: string): string[] {
  const clean = value.trim();
  if (!clean) return [];
  return clean
    .split(/[;,]/)
    .flatMap((chunk) => {
      const parts = chunk.split('=').map((item) => item.trim()).filter(Boolean);
      return parts.length > 1 ? [parts[1]] : parts;
    })
    .map(normalizeToken);
}

export function userHasAnyPermission(required: string | string[] | undefined): boolean {
  if (!required) return true;
  const session = getStoredSession();
  if (!session) return false;
  if (session.esSuperUsuario) return true;

  const requiredPermissions = Array.isArray(required)
    ? required.flatMap(parsePermissionString)
    : parsePermissionString(required);
  if (requiredPermissions.length === 0) return true;

  // Modo seguro práctico: si el sistema todavía no envía matriz de permisos,
  // el frontend no inventa bloqueos. Cuando sí llegan permisos, se respetan.
  if (session.permisos.length === 0) return true;

  const userPermissions = new Set(session.permisos.map(normalizeToken));
  const userRoles = new Set(session.roles.map(normalizeToken));

  return requiredPermissions.some((permission) => userPermissions.has(permission) || userRoles.has(permission));
}

export function getSessionDisplayName(): string {
  const session = getStoredSession();
  return session?.nombreCompleto || session?.nombreUsuario || session?.email || 'Usuario CPA';
}
