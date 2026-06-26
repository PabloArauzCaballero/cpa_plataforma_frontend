import { httpClient } from '@/shared/api/httpClient';
import { normalizeListResponse } from './resourceMapper';

export interface VentaClaseLookupOption {
  value: string;
  label: string;
  payloadLabel: string;
  tema?: string;
  subtema?: string;
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

function readId(record: Record<string, unknown>, fields: string[]): string {
  return readText(record, fields);
}

function uniqueOptions(options: VentaClaseLookupOption[]): VentaClaseLookupOption[] {
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

function withPaging(endpoint: string, offset: number): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  const params = new URLSearchParams();
  params.set('page', String(Math.floor(offset / LOOKUP_PAGE_SIZE) + 1));
  params.set('limit', String(LOOKUP_PAGE_SIZE));
  params.set('offset', String(offset));
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

async function listAllRecords(endpoint: string): Promise<Record<string, unknown>[]> {
  const collected: Record<string, unknown>[] = [];
  let offset = 0;
  let total: number | null = null;

  while (collected.length < LOOKUP_MAX_RECORDS) {
    const response = await httpClient.get<unknown>(withPaging(endpoint, offset));
    const records = normalizeListResponse(response);
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
  const records = await listAllRecords('/api/personas/estudiante');
  return uniqueOptions(records.map((record) => {
    const id = readId(record, ['id_persona', 'id_estudiante']);
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
  const records = await listAllRecords('/api/personas/tutor');
  return uniqueOptions(records.map((record) => {
    const id = readId(record, ['id_tutor', 'id_persona']);
    const label = personLabel(record, id ? `Tutor ${id}` : 'Tutor disponible');
    const level = readText(record, ['nivel_experiencia']);
    return {
      value: id,
      label: level ? `${label} · ${level}` : label,
      payloadLabel: label,
    };
  }));
}

export async function listMateriaProductoOptions(): Promise<VentaClaseLookupOption[]> {
  const materiaRecords = await listAllRecords('/api/servicios_educativos/materia-tree');
  const productoRecords = await listAllRecords('/api/servicios_educativos/producto-educativo');

  const materias = materiaRecords.map((record) => {
    const id = readId(record, ['id_tree', 'id_materia_tree']);
    const nombre = readText(record, ['nombre']);
    const tema = readText(record, ['tema']);
    const subtema = readText(record, ['subtema']);
    const payloadLabel = [nombre, tema].filter(Boolean).join(' · ') || (id ? `Materia ${id}` : 'Materia disponible');
    return {
      value: `materia:${id}`,
      label: `Materia · ${payloadLabel}`,
      payloadLabel,
      tema,
      subtema,
    };
  });

  const productos = productoRecords.map((record) => {
    const id = readId(record, ['id_producto_educativo']);
    const nombre = readText(record, ['nombre', 'nombre_producto']);
    const tipo = readText(record, ['tipo_producto']);
    const payloadLabel = nombre || (id ? `Producto educativo ${id}` : 'Producto educativo disponible');
    return {
      value: `producto:${id}`,
      label: tipo ? `Producto · ${payloadLabel} · ${tipo}` : `Producto · ${payloadLabel}`,
      payloadLabel,
      tema: '',
      subtema: '',
    };
  });

  return uniqueOptions([...materias, ...productos]);
}
