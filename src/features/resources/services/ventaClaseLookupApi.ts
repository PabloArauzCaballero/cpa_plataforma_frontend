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
  raw?: Record<string, unknown>;
}

interface MateriaTreeDraft {
  id?: number;
  materia: string;
  tema: string;
  subtema: string;
  raw?: Record<string, unknown>;
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

function readFirstObject(record: Record<string, unknown>, fields: string[]): Record<string, unknown> | undefined {
  for (const field of fields) {
    const value = record[field];
    if (isRecord(value)) return value;
  }
  return undefined;
}

function readFirstArray(record: Record<string, unknown>, fields: string[]): Record<string, unknown>[] {
  for (const field of fields) {
    const value = record[field];
    if (Array.isArray(value)) return value.filter(isRecord);
  }
  return [];
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
    const id = readText(record, ['id_espacio', 'id_aula', 'id']);
    const nombre = readText(record, ['nombre', 'codigo', 'descripcion']);
    const capacidad = readText(record, ['capacidad']);
    const tipoAula = readText(record, ['tipo_aula']);
    const label = nombre || (id ? `Aula ${id}` : 'Aula disponible');
    const details = [tipoAula, capacidad ? `Cap. ${capacidad}` : 'Cap. N/D'].filter(Boolean).join(' · ');
    return {
      value: id,
      label: details ? `${label} - ${details}` : label,
      payloadLabel: label,
    };
  }));
}

function resolveMateriaParts(record: Record<string, unknown>, inherited: Partial<MateriaTreeDraft> = {}): MateriaTreeDraft {
  const materiaObject = readFirstObject(record, ['materia', 'materia_base', 'materiaBase']);
  const temaObject = readFirstObject(record, ['tema_ref', 'temaBase', 'tema_base']);
  const subtemaObject = readFirstObject(record, ['subtema_ref', 'subtemaBase', 'subtema_base']);

  const materia = readText(record, [
    'materia',
    'nombre_materia',
    'materia_nombre',
    'nombre_materia_tree',
    'asignatura',
    'nombre_asignatura',
    'nombre',
    'descripcion_materia',
  ]) || (materiaObject ? readText(materiaObject, ['nombre', 'materia', 'descripcion']) : '') || inherited.materia || '';

  const tema = readText(record, [
    'tema',
    'nombre_tema',
    'tema_nombre',
    'descripcion_tema',
    'unidad',
    'nombre_unidad',
  ]) || (temaObject ? readText(temaObject, ['nombre', 'tema', 'descripcion']) : '') || inherited.tema || '';

  const subtema = readText(record, [
    'subtema',
    'nombre_subtema',
    'subtema_nombre',
    'descripcion_subtema',
    'contenido',
    'nombre_contenido',
  ]) || (subtemaObject ? readText(subtemaObject, ['nombre', 'subtema', 'descripcion']) : '') || inherited.subtema || '';

  const id = readNumber(record, [
    'id_tree',
    'id_materia_tree',
    'id_materia_tema_subtema',
    'id_materia_subtema',
    'id_subtema',
    'id',
  ]);

  return { id, materia, tema, subtema, raw: record };
}

function collectMateriaTreeRecords(record: Record<string, unknown>, inherited: Partial<MateriaTreeDraft> = {}): MateriaTreeDraft[] {
  const current = resolveMateriaParts(record, inherited);
  const children = [
    ...readFirstArray(record, ['children', 'hijos', 'items']),
    ...readFirstArray(record, ['temas']),
    ...readFirstArray(record, ['subtemas']),
    ...readFirstArray(record, ['materias']),
  ];

  const nested = children.flatMap((child) => collectMateriaTreeRecords(child, current));
  const shouldKeepCurrent = Boolean(current.materia && (current.id || current.tema || current.subtema));
  return shouldKeepCurrent ? [current, ...nested] : nested;
}

export async function listMateriaTreeOptions(): Promise<MateriaTreeOption[]> {
  const records = await listAllRecords('/api/servicios_educativos/materia-tree', 'nombre');
  const flattened = records.flatMap((record) => collectMateriaTreeRecords(record));

  const mapped: MateriaTreeOption[] = [];
  flattened.forEach((item) => {
    const resolvedId = item.id ?? 0;
    const materia = item.materia.trim();
    const tema = item.tema.trim();
    const subtema = item.subtema.trim();
    const label = [materia, tema, subtema].filter(Boolean).join(' · ');
    if (materia) {
      mapped.push({ id: resolvedId, materia, tema, subtema, label, raw: item.raw });
    }
  });

  const seen = new Set<string>();
  return mapped.filter((item) => {
    const key = `${item.id}-${item.materia}-${item.tema}-${item.subtema}`;
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
