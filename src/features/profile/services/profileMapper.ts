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

function mergeRecords(...values: unknown[]): Record<string, unknown> {
  return values.reduce<Record<string, unknown>>((accumulator, value) => {
    if (isRecord(value)) {
      return { ...accumulator, ...value };
    }
    return accumulator;
  }, {});
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
      if (['true', '1', 'si', 'sí', 'super', 'activo', 's'].includes(normalized)) return true;
      if (['false', '0', 'no', 'inactivo', 'n'].includes(normalized)) return false;
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
          const label = readString(item, [
            'codigo',
            'nombre',
            'descripcion',
            'modulo',
            'name',
            'permiso',
            'rol',
            'tipo_usuario',
          ]);
          if (label) result.push(label);
        }
      }
    }
  }

  return Array.from(new Set(result));
}

function buildFullName(person: Record<string, unknown>, user: Record<string, unknown>, fallbackSource: Record<string, unknown>): string {
  const explicit = readString(fallbackSource, ['nombre_completo', 'fullName', 'full_name']);
  const nombres = readString(fallbackSource, ['nombres', 'nombre', 'firstName', 'first_name']);
  const apellidos = readString(fallbackSource, ['apellidos', 'apellido', 'lastName', 'last_name']);
  const username = readString(user, ['nombre_usuario', 'username', 'userName', 'usuario', 'email']);
  const personExplicit = readString(person, ['nombre_completo', 'fullName', 'full_name']);
  const fullName = explicit || personExplicit || `${nombres} ${apellidos}`.trim();
  return fullName || username || 'Usuario CPA';
}

function pickNestedUser(data: Record<string, unknown>, root: Record<string, unknown>): Record<string, unknown> {
  const session = pickRecord(data.session, data.sesion, root.session, root.sesion);
  const auth = pickRecord(data.auth, root.auth);
  return pickRecord(
    data.user,
    data.usuario,
    data.persona_usuario,
    data.currentUser,
    data.current_user,
    session.user,
    session.usuario,
    auth.user,
    auth.usuario,
    root.user,
    root.usuario,
    data,
  );
}

function pickNestedPerson(data: Record<string, unknown>, user: Record<string, unknown>, root: Record<string, unknown>): Record<string, unknown> {
  const session = pickRecord(data.session, data.sesion, root.session, root.sesion);
  return pickRecord(
    data.persona,
    data.person,
    data.datos_persona,
    user.persona,
    user.person,
    user.datos_persona,
    session.persona,
    session.person,
    root.persona,
    root.person,
  );
}

export function mapProfileMeResponse(dto: ProfileMeResponseDto): UserProfile {
  const root = pickRecord(dto);
  const data = pickRecord(root.data, root);
  const user = pickNestedUser(data, root);
  const person = pickNestedPerson(data, user, root);
  const session = pickRecord(data.session, data.sesion, root.session, root.sesion);

  // El sistema puede devolver los datos de persona dentro de user, dentro de persona,
  // o mezclados en data. Se fusionan fuentes para no mostrar "No disponible" si el dato sí vino.
  const resolved = mergeRecords(data, person, user);

  const email = readString(resolved, ['email', 'correo', 'correo_electronico']);
  const username = readString(resolved, ['nombre_usuario', 'username', 'userName', 'usuario'], email ? email.split('@')[0] : '');
  const nombres = readString(resolved, ['nombres', 'nombre', 'firstName', 'first_name']);
  const apellidos = readString(resolved, ['apellidos', 'apellido', 'lastName', 'last_name']);
  const tipoUsuario = readString(resolved, ['tipo_usuario', 'tipoUsuario', 'role', 'rol', 'perfil']);
  const isSuperUser = readBoolean(resolved, ['es_super_usuario', 'esSuperUsuario', 'isSuperUser', 'super_user']);

  const roles = readStringArray(data.roles, data.userRoles, user.roles, user.roles_usuario, resolved.roles, resolved.roles_usuario);
  if (roles.length === 0 && tipoUsuario) {
    roles.push(tipoUsuario);
  }
  if (isSuperUser && !roles.some((role) => role.toLowerCase().includes('super'))) {
    roles.unshift('SUPER_ADMIN');
  }

  return {
    idPersona: readString(resolved, ['idPersona', 'id_persona', 'persona_id', 'idPersonaUsuario', 'id_persona_usuario', 'id']),
    username,
    email,
    nombres,
    apellidos,
    nombreCompleto: buildFullName(person, user, resolved),
    telefono: readString(resolved, ['telefono', 'celular', 'phone', 'numero_celular']),
    tipoUsuario,
    estado: readString(resolved, ['estado_registro', 'estado', 'status'], 'Activo'),
    esSuperUsuario: isSuperUser,
    roles,
    permisos: readStringArray(data.permisos, data.permissions, user.permisos, user.permissions, resolved.permisos, resolved.permissions),
    rawData: {
      data,
      user,
      person,
      session,
    },
  };
}
