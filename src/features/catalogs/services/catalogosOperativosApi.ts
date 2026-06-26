import { httpClient } from '@/shared/api/httpClient';
import { normalizeListResponse } from '@/features/resources/services/resourceMapper';

export interface CuentaOption {
  id: string;
  label: string;
  codigo: string;
  nombre: string;
}

export interface ConfiguracionCuentaOperativa {
  id_configuracion_cuenta?: number | string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  id_cuenta?: number | string;
  cuenta_label?: string;
}

export interface MateriaTreeCatalogItem {
  id_tree?: number | string;
  nombre: string;
  tema: string;
  subtema: string;
  estado_registro?: boolean | string;
}

export interface ProductoEducativoCatalogItem {
  id_producto_educativo?: number | string;
  nombre: string;
  descripcion?: string;
  tipo_producto?: string;
  precio_base?: number | string;
  estado_registro?: boolean | string;
}

export interface UnidadEducativaCatalogItem {
  id_unidad_educativa?: number | string;
  nombre: string;
  categoria?: string;
  latitud?: number | string;
  longitud?: number | string;
  estado_registro?: boolean | string;
}

export const REQUIRED_ACCOUNT_CONFIGS = [
  {
    codigo: 'CANAL_COBRO_EFECTIVO',
    nombre: 'Canal de cobro efectivo',
    descripcion: 'Cuenta contable usada por el backend para cobros en efectivo en parte de clases pasadas.',
  },
  {
    codigo: 'CANAL_COBRO_QR',
    nombre: 'Canal de cobro QR',
    descripcion: 'Cuenta contable usada por el backend para cobros por QR en parte de clases pasadas.',
  },
  {
    codigo: 'IVA_DEBITO_FISCAL',
    nombre: 'IVA débito fiscal',
    descripcion: 'Cuenta contable para registrar el impuesto cuando aplique.',
  },
  {
    codigo: 'INGRESO_CLASE_POR_HORA',
    nombre: 'Ingreso clases por hora',
    descripcion: 'Cuenta de ingreso que usa el backend al generar la venta de clases por hora.',
  },
] as const;

const PAGE_SIZE = 500;
const MAX_RECORDS = 5000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readText(record: Record<string, unknown>, fields: string[]): string {
  for (const field of fields) {
    const value = record[field];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}

function resolveTotal(response: unknown): number | null {
  if (!isRecord(response)) return null;
  const data = isRecord(response.data) ? response.data : {};
  const pagination = isRecord(response.pagination) ? response.pagination : {};
  const total = Number(data.count ?? data.total ?? pagination.count ?? pagination.total ?? response.count ?? response.total);
  return Number.isFinite(total) && total >= 0 ? total : null;
}

function buildPagedPath(endpoint: string, offset: number, orderBy = 'nombre'): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  const params = new URLSearchParams();
  params.set('page', String(Math.floor(offset / PAGE_SIZE) + 1));
  params.set('limit', String(PAGE_SIZE));
  params.set('offset', String(offset));
  params.set('orderBy', orderBy);
  params.set('orderDir', 'ASC');
  params.set('onlyActivos', 'false');
  params.set('only_activos', 'false');
  params.set('includeInactive', 'true');
  params.set('include_inactive', 'true');
  return `${endpoint}${separator}${params.toString()}`;
}

async function listAll(endpoint: string, orderBy = 'nombre'): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  let offset = 0;
  let total: number | null = null;

  while (rows.length < MAX_RECORDS) {
    const response = await httpClient.get<unknown>(buildPagedPath(endpoint, offset, orderBy));
    const page = normalizeListResponse(response).filter(isRecord);
    total = total ?? resolveTotal(response);
    rows.push(...page);

    if (page.length < PAGE_SIZE) break;
    if (total !== null && rows.length >= total) break;
    offset += page.length;
  }

  return rows.slice(0, MAX_RECORDS);
}

export async function listCuentaOptions(): Promise<CuentaOption[]> {
  const records = await listAll('/api/contabilidad/cuenta', 'codigo');
  return records.map((record) => {
    const id = readText(record, ['id_cuenta']);
    const codigo = readText(record, ['codigo', 'codigo_cuenta']);
    const nombre = readText(record, ['nombre_cuenta', 'nombre']);
    const label = [codigo, nombre].filter(Boolean).join(' · ') || `Cuenta ${id}`;
    return { id, codigo, nombre, label };
  }).filter((option) => option.id && option.label)
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));
}

export async function listConfiguracionCuentaOperativa(): Promise<ConfiguracionCuentaOperativa[]> {
  const records = await listAll('/api/contabilidad/configuracion-cuenta-operativa', 'codigo');
  return records.map((record) => ({
    id_configuracion_cuenta: readText(record, ['id_configuracion_cuenta', 'id_configuracion', 'id']),
    codigo: readText(record, ['codigo']),
    nombre: readText(record, ['nombre']),
    descripcion: readText(record, ['descripcion']),
    id_cuenta: readText(record, ['id_cuenta']),
    cuenta_label: readText(record, ['cuenta_label', 'nombre_cuenta']),
  })).filter((item) => item.codigo);
}

export async function upsertConfiguracionCuentaOperativa(config: ConfiguracionCuentaOperativa) {
  const body = {
    codigo: config.codigo,
    nombre: config.nombre,
    descripcion: config.descripcion ?? '',
    id_cuenta: Number(config.id_cuenta),
  };

  if (config.id_configuracion_cuenta) {
    return httpClient.patch<unknown, typeof body>(`/api/contabilidad/configuracion-cuenta-operativa/${config.id_configuracion_cuenta}`, body);
  }

  return httpClient.post<unknown, typeof body>('/api/contabilidad/configuracion-cuenta-operativa', body);
}

export async function listMateriaTreeCatalog(): Promise<MateriaTreeCatalogItem[]> {
  const records = await listAll('/api/servicios_educativos/materia-tree', 'nombre');
  return records.map((record) => ({
    id_tree: readText(record, ['id_tree', 'id_materia_tree']),
    nombre: readText(record, ['nombre', 'materia']),
    tema: readText(record, ['tema']),
    subtema: readText(record, ['subtema']),
    estado_registro: readText(record, ['estado_registro']),
  })).filter((item) => item.nombre);
}

export async function listProductosEducativosCatalog(): Promise<ProductoEducativoCatalogItem[]> {
  const records = await listAll('/api/servicios_educativos/producto-educativo', 'nombre');
  return records.map((record) => ({
    id_producto_educativo: readText(record, ['id_producto_educativo']),
    nombre: readText(record, ['nombre', 'nombre_producto']),
    descripcion: readText(record, ['descripcion']),
    tipo_producto: readText(record, ['tipo_producto']),
    precio_base: readText(record, ['precio_base']),
    estado_registro: readText(record, ['estado_registro']),
  })).filter((item) => item.nombre);
}

export async function listUnidadesEducativasCatalog(): Promise<UnidadEducativaCatalogItem[]> {
  const records = await listAll('/api/personas/unidad-educativa', 'nombre');
  return records.map((record) => ({
    id_unidad_educativa: readText(record, ['id_unidad_educativa']),
    nombre: readText(record, ['nombre']),
    categoria: readText(record, ['categoria']),
    latitud: readText(record, ['latitud']),
    longitud: readText(record, ['longitud']),
    estado_registro: readText(record, ['estado_registro']),
  })).filter((item) => item.nombre);
}
