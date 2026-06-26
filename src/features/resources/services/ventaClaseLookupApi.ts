import { httpClient } from '@/shared/api/httpClient';
import { normalizeListResponse } from './resourceMapper';

export interface VentaClaseLookupOption {
  value: string;
  label: string;
  payloadLabel: string;
}

export interface MateriaTreeOption {
  id: number;
  materia: string;
  tema: string;
  subtema: string;
  label: string;
}

export interface ProductoEducativoOption extends VentaClaseLookupOption {
  tipoProducto?: string;
}

const LOOKUP_PAGE_SIZE = 500;
const LOOKUP_MAX_RECORDS = 5000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readText(record: Record<string, unknown>, fields: string[]): string {
  for (const field of fields) {
    const value = record[field];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim();
    }
  }
  return '';
}

function readNumber(record: Record<string, unknown>, fields: string[]): number | undefined {
  for (const field of fields) {
    const value = record[field];
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return undefined;
}

function uniqueOptions<T extends { value: string; label: string }>(options: T[]): T[] {
  const seen = new Set<string>();
  return options
    .filter((option) => option.value.trim() && option.label.trim())
    .filter((option) => {
      const key = option.value;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

function withPaging(endpoint: string, offset: number, orderBy = 'nombre'): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  const params = new URLSearchParams();
  params.set('page', String(Math.floor(offset / LOOKUP_PAGE_SIZE) + 1));
  params.set('limit', String(LOOKUP_PAGE_SIZE));
  params.set('offset', String(offset));
  params.set('orderBy', orderBy);
  params.set('orderDir', 'ASC');
  params.set('onlyActivos', 'false');
  params.set('only_activos', 'false');
  params.set('includeInactive', 'true');
  params.set('include_inactive', 'true');
  return `${endpoint}${separator}${params.toString()}`;
}

function resolveTotal(response: unknown): number | null {
  if (!isRecord(response)) return null;

  if (isRecord(response.data)) {
    const count = Number(response.data.count ?? response.data.total);
    if (Number.isFinite(count) && count >= 0) return count;
  }

  if (isRecord(response.pagination)) {
    const count = Number(response.pagination.count ?? response.pagination.total);
    if (Number.isFinite(count) && count >= 0) return count;
  }

  const direct = Number(response.count ?? response.total);
  return Number.isFinite(direct) && direct >= 0 ? direct : null;
}

async function listAllRecords(endpoint: string, orderBy = 'nombre'): Promise<Record<string, unknown>[]> {
  const collected: Record<string, unknown>[] = [];
  let offset = 0;
  let total: number | null = null;

  while (collected.length < LOOKUP_MAX_RECORDS) {
    const response = await httpClient.get<unknown>(withPaging(endpoint, offset, orderBy));
    const records = normalizeListResponse(response).filter(isRecord);
    total = total ?? resolveTotal(response);
    collected.push(...records);

    if (records.length < LOOKUP_PAGE_SIZE) break;
    if (total !== null && collected.length >= total) break;
    offset += records.length;
  }

  return collected.slice(0, LOOKUP_MAX_RECORDS);
}

function personLabel(record: Record<string, unknown>, fallback: string): string {
  const fullName = readText(record, [
    'nombre_completo',
    'nombreCompleto',
    'full_name',
    'fullName',
    'nombre',
    'razon_social',
  ]);
  if (fullName) return fullName;

  const composed = [
    readText(record, ['nombres', 'primer_nombre']),
    readText(record, ['apellido_paterno', 'primer_apellido']),
    readText(record, ['apellido_materno', 'segundo_apellido']),
  ].filter(Boolean).join(' ').trim();
  if (composed) return composed;

  const code = readText(record, ['codigo_estudiante', 'codigo_tutor', 'codigo', 'nombre_usuario']);
  if (code) return code;

  return fallback;
}

export async function listEstudianteOptions(): Promise<VentaClaseLookupOption[]> {
  const records = await listAllRecords('/api/personas/estudiante', 'id_estudiante');
  return uniqueOptions(records.map((record) => {
    const id = readText(record, ['id_estudiante', 'id_persona']);
    const label = personLabel(record, id ? `Estudiante ${id}` : 'Estudiante disponible');
    const code = readText(record, ['codigo_estudiante']);
    return {
      value: id,
      label: code ? `${label} · ${code}` : label,
      payloadLabel: label,
    };
  }));
}

export async function listTutorOptions(): Promise<VentaClaseLookupOption[]> {
  const records = await listAllRecords('/api/personas/tutor', 'id_tutor');
  return uniqueOptions(records.map((record) => {
    const id = readText(record, ['id_tutor', 'id_persona']);
    const label = personLabel(record, id ? `Tutor ${id}` : 'Tutor disponible');
    const level = readText(record, ['nivel_experiencia']);
    return {
      value: id,
      label: level ? `${label} · ${level}` : label,
      payloadLabel: label,
    };
  }));
}

export async function listAulaOptions(): Promise<VentaClaseLookupOption[]> {
  const records = await listAllRecords('/api/infraestructura/aula', 'nombre');
  return uniqueOptions(records.map((record) => {
    const id = readText(record, ['id_aula']);
    const nombre = readText(record, ['nombre', 'codigo', 'descripcion']);
    const capacidad = readText(record, ['capacidad']);
    const label = nombre || (id ? `Aula ${id}` : 'Aula disponible');
    return {
      value: id,
      label: capacidad ? `${label} · cap. ${capacidad}` : label,
      payloadLabel: label,
    };
  }));
}

export async function listMateriaTreeOptions(): Promise<MateriaTreeOption[]> {
  const records = await listAllRecords('/api/servicios_educativos/materia-tree', 'nombre');
  const mapped = records.map((record) => {
    const id = readNumber(record, ['id_tree', 'id_materia_tree']);
    const materia = readText(record, ['nombre', 'materia']);
    const tema = readText(record, ['tema']);
    const subtema = readText(record, ['subtema']);
    const label = [materia, tema, subtema].filter(Boolean).join(' · ');
    return id && materia ? { id, materia, tema, subtema, label } : null;
  }).filter((item): item is MateriaTreeOption => Boolean(item));

  const seen = new Set<string>();
  return mapped.filter((item) => {
    const key = `${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

export async function listProductoEducativoOptions(): Promise<ProductoEducativoOption[]> {
  const records = await listAllRecords('/api/servicios_educativos/producto-educativo', 'nombre');
  return uniqueOptions(records.map((record) => {
    const id = readText(record, ['id_producto_educativo']);
    const nombre = readText(record, ['nombre', 'nombre_producto']);
    const tipo = readText(record, ['tipo_producto']);
    const label = nombre || (id ? `Producto educativo ${id}` : 'Producto educativo disponible');
    return {
      value: id,
      label: tipo ? `${label} · ${tipo}` : label,
      payloadLabel: label,
      tipoProducto: tipo,
    };
  }));
}
