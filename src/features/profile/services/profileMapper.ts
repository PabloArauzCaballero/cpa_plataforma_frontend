import type { UserProfile } from '../domain/UserProfile';
import type { ProfileMeResponseDto } from './dto/ProfileMeResponseDto';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickRecord(...values: unknown[]): Record<string, unknown> {
  for (const value of values) {
    if (isRecord(value)) return value;
  }
  return {};
}

function readString(source: Record<string, unknown>, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' || typeof value === 'bigint') return String(value);
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  }
  return fallback;
}

function readBoolean(source: Record<string, unknown>, keys: string[], fallback = false): boolean {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (['true', '1', 'si', 'sí', 'super', 'activo'].includes(normalized)) return true;
      if (['false', '0', 'no', 'inactivo'].includes(normalized)) return false;
    }
    if (typeof value === 'number') return value === 1;
  }
  return fallback;
}

function readStringArray(...values: unknown[]): string[] {
  const result: string[] = [];

  for (const value of values) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && item.trim()) {
          result.push(item.trim());
        } else if (isRecord(item)) {
          const label = readString(item, ['codigo', 'nombre', 'descripcion', 'modulo', 'name']);
          if (label) result.push(label);
        }
      }
    }
  }

  return Array.from(new Set(result));
}

function buildFullName(person: Record<string, unknown>, user: Record<string, unknown>): string {
  const nombres = readString(person, ['nombres', 'nombre', 'firstName', 'first_name']);
  const apellidos = readString(person, ['apellidos', 'apellido', 'lastName', 'last_name']);
  const explicit = readString(person, ['nombre_completo', 'fullName', 'full_name']);
  const username = readString(user, ['nombre_usuario', 'username', 'userName', 'email']);
  const fullName = explicit || `${nombres} ${apellidos}`.trim();
  return fullName || username || 'Usuario CPA';
}

export function mapProfileMeResponse(dto: ProfileMeResponseDto): UserProfile {
  const root = pickRecord(dto);
  const data = pickRecord(root.data, root);
  const user = pickRecord(data.user, data.usuario, data.persona_usuario, data);
  const person = pickRecord(data.persona, data.person, user.persona, user.person, data);
  const session = pickRecord(data.session, data.sesion, root.session, root.sesion);

  const email = readString(user, ['email', 'correo', 'correo_electronico'], readString(person, ['email', 'correo', 'correo_electronico']));
  const username = readString(user, ['nombre_usuario', 'username', 'userName'], email ? email.split('@')[0] : '');
  const nombres = readString(person, ['nombres', 'nombre', 'firstName', 'first_name']);
  const apellidos = readString(person, ['apellidos', 'apellido', 'lastName', 'last_name']);
  const nombreCompleto = buildFullName(person, user);

  return {
    idPersona: readString(user, ['id_persona', 'persona_id'], readString(person, ['id_persona', 'id'])),
    username,
    email,
    nombres,
    apellidos,
    nombreCompleto,
    telefono: readString(person, ['telefono', 'celular', 'phone'], readString(user, ['telefono', 'celular', 'phone'])),
    tipoUsuario: readString(user, ['tipo_usuario', 'tipoUsuario', 'role', 'rol'], readString(data, ['tipo_usuario', 'role', 'rol'])),
    estado: readString(user, ['estado_registro', 'estado', 'status'], readString(data, ['estado_registro', 'estado', 'status'], 'Activo')),
    esSuperUsuario: readBoolean(user, ['es_super_usuario', 'isSuperUser', 'super_user'], readBoolean(data, ['es_super_usuario', 'isSuperUser'])),
    roles: readStringArray(data.roles, data.userRoles, user.roles, user.roles_usuario),
    permisos: readStringArray(data.permisos, data.permissions, user.permisos, user.permissions),
    rawData: {
      data,
      user,
      person,
      session,
    },
  };
}
