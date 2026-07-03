import { httpClient } from '@/shared/api/httpClient';
import { normalizeListResult, normalizeRecordResponse } from '@/features/resources/services/resourceMapper';
import type { ResourceListResult } from '@/features/resources/domain/CrudResource';
import type { FileListFilters, FileUploadPayload, ServerFileRecord, TransactionFilePayload } from '../domain/ServerFile';

function buildQuery(filters: FileListFilters): string {
  const params = new URLSearchParams();
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 24));
  params.set('orderBy', 'fecha_registro');
  params.set('orderDir', 'DESC');

  if (filters.q?.trim()) {
    const query = filters.q.trim();
    params.set('q', query);
    params.set('search', query);
    params.set('term', query);
  }

  if (filters.provider?.trim()) params.set('storage_provider', filters.provider.trim());
  if (filters.mime?.trim()) params.set('tipo_mime', filters.mime.trim());

  return params.toString();
}

export async function listServerFiles(filters: FileListFilters = {}): Promise<ResourceListResult> {
  const query = buildQuery(filters);
  const response = await httpClient.get<unknown>(`/api/contabilidad/archivo?${query}`);
  return normalizeListResult(response, filters.limit ?? 24, ((filters.page ?? 1) - 1) * (filters.limit ?? 24));
}

export async function registerServerFile(payload: FileUploadPayload): Promise<ServerFileRecord> {
  const response = await httpClient.post<unknown, FileUploadPayload>('/api/contabilidad/archivo/registrar', payload);
  return normalizeRecordResponse(response) as ServerFileRecord;
}

export async function registerTransactionFile(payload: TransactionFilePayload): Promise<ServerFileRecord> {
  const { id_transaccion, tipo_asociacion, observacion, ...archivo } = payload;
  const response = await httpClient.post<unknown, Record<string, unknown>>('/api/contabilidad/archivo-transaccion/registrar', {
    id_transaccion,
    tipo_asociacion: tipo_asociacion || 'SOPORTE',
    observacion,
    archivo,
  });
  const record = normalizeRecordResponse(response) as Record<string, unknown>;
  const nested = record.archivo;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) return nested as ServerFileRecord;
  return record as ServerFileRecord;
}
