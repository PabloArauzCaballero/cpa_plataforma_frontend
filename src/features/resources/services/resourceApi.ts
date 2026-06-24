import { httpClient } from '@/shared/api/httpClient';
import type {
  BatchProcessResult,
  BatchValidationResult,
  BatchValidationRow,
  CrudRecord,
  CrudResourceDefinition,
  ResourceListQuery,
  ResourceListResult,
} from '../domain/CrudResource';
import { normalizeListResult, normalizeRecordResponse } from './resourceMapper';

function appendQuery(path: string, query: ResourceListQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  params.set('offset', String(query.offset));
  params.set('orderDir', query.orderDir);

  if (query.orderBy) params.set('orderBy', query.orderBy);
  if (query.search?.trim()) params.set('q', query.search.trim());

  Object.entries(query.filters).forEach(([key, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') return;
    params.set(key, String(value));
  });

  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}${params.toString()}`;
}

export async function listResource(resource: CrudResourceDefinition, query: ResourceListQuery): Promise<ResourceListResult> {
  const response = await httpClient.get<unknown>(appendQuery(resource.endpoints.list, query));
  return normalizeListResult(response, query.limit, query.offset);
}

export async function listAllResource(resource: CrudResourceDefinition, query: ResourceListQuery, maxRows = 10000): Promise<ResourceListResult> {
  const pageSize = 500;
  let offset = 0;
  let count = 0;
  const records: CrudRecord[] = [];

  do {
    const response = await listResource(resource, {
      ...query,
      page: Math.floor(offset / pageSize) + 1,
      limit: pageSize,
      offset,
    });

    records.push(...response.records);
    count = response.count;

    if (response.records.length === 0) break;
    offset += pageSize;
  } while (records.length < count && records.length < maxRows);

  return {
    records: records.slice(0, maxRows),
    count,
    limit: pageSize,
    offset: 0,
    page: 1,
  };
}

export async function createResource(resource: CrudResourceDefinition, payload: CrudRecord): Promise<CrudRecord> {
  const response = await httpClient.post<unknown, CrudRecord>(resource.endpoints.create, payload);
  return normalizeRecordResponse(response);
}

export async function updateResource(resource: CrudResourceDefinition, id: string, payload: CrudRecord): Promise<CrudRecord> {
  const response = await httpClient.patch<unknown, CrudRecord>(resource.endpoints.update(id), payload);
  return normalizeRecordResponse(response);
}

function batchValidateEndpoint(resource: CrudResourceDefinition): string {
  return resource.endpoints.batchValidate ?? `${resource.endpoints.list}/batch/validate`;
}

function batchProcessEndpoint(resource: CrudResourceDefinition): string {
  return resource.endpoints.batchProcess ?? `${resource.endpoints.list}/batch/process`;
}

function asNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeBatchRows(value: unknown): BatchValidationRow[] {
  const rows = Array.isArray(value)
    ? value
    : typeof value === 'object' && value !== null && Array.isArray((value as { rows?: unknown }).rows)
      ? (value as { rows: unknown[] }).rows
      : [];

  return rows.map((row, index) => {
    const source = typeof row === 'object' && row !== null ? (row as Record<string, unknown>) : {};
    const rawStatus = String(source.status ?? source.estado ?? source.validacion ?? '').toLowerCase();
    const status: BatchValidationRow['status'] = rawStatus.includes('error')
      ? 'error'
      : rawStatus.includes('warn') || rawStatus.includes('observ')
        ? 'warning'
        : 'valid';

    return {
      rowNumber: asNumber(source.rowNumber ?? source.row ?? source.fila, index + 1),
      operation: source.operation ? String(source.operation) : source.operacion ? String(source.operacion) : undefined,
      status,
      message: source.message ? String(source.message) : source.mensaje ? String(source.mensaje) : undefined,
      payload: (source.payload ?? source.data ?? source.registro) as CrudRecord | undefined,
      errors: source.errors as Record<string, string[]> | undefined,
    };
  });
}

export function normalizeBatchValidationResponse(response: unknown): BatchValidationResult {
  const source = typeof response === 'object' && response !== null ? (response as Record<string, unknown>) : {};
  const rows = normalizeBatchRows(source.rows ?? source.detalle ?? source.data ?? source);
  const errorRows = asNumber(source.errorRows ?? source.errores, rows.filter((row) => row.status === 'error').length);
  const warningRows = asNumber(source.warningRows ?? source.observados, rows.filter((row) => row.status === 'warning').length);
  const validRows = asNumber(source.validRows ?? source.validos, rows.filter((row) => row.status === 'valid').length);

  return {
    importId: source.importId ? String(source.importId) : source.loteId ? String(source.loteId) : undefined,
    totalRows: asNumber(source.totalRows ?? source.total ?? source.registros, rows.length),
    validRows,
    warningRows,
    errorRows,
    rows,
    raw: response,
  };
}

export function normalizeBatchProcessResponse(response: unknown): BatchProcessResult {
  const source = typeof response === 'object' && response !== null ? (response as Record<string, unknown>) : {};

  return {
    importId: source.importId ? String(source.importId) : source.loteId ? String(source.loteId) : undefined,
    totalRows: asNumber(source.totalRows ?? source.total ?? source.registros),
    createdRows: asNumber(source.createdRows ?? source.creados),
    updatedRows: asNumber(source.updatedRows ?? source.actualizados),
    errorRows: asNumber(source.errorRows ?? source.errores),
    message: source.message ? String(source.message) : source.mensaje ? String(source.mensaje) : 'Importación procesada.',
    raw: response,
  };
}

function buildBatchFormData(resource: CrudResourceDefinition, file: File, mode: string, importId?: string): FormData {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('archivo', file);
  formData.append('module', resource.module);
  formData.append('resource', resource.key);
  formData.append('mode', mode);

  if (importId) {
    formData.append('importId', importId);
  }

  return formData;
}

export async function validateBatchResource(
  resource: CrudResourceDefinition,
  file: File,
  mode: string,
): Promise<BatchValidationResult> {
  const response = await httpClient.upload<unknown>(batchValidateEndpoint(resource), buildBatchFormData(resource, file, mode));
  return normalizeBatchValidationResponse(response);
}

export async function processBatchResource(
  resource: CrudResourceDefinition,
  file: File,
  mode: string,
  importId?: string,
): Promise<BatchProcessResult> {
  const response = await httpClient.upload<unknown>(batchProcessEndpoint(resource), buildBatchFormData(resource, file, mode, importId));
  return normalizeBatchProcessResponse(response);
}
