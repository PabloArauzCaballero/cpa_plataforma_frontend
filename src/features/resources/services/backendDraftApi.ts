import { httpClient } from '@/shared/api/httpClient';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { normalizeListResponse, normalizeRecordResponse } from './resourceMapper';
import { sanitizeDraftPayload } from '@/shared/services/localDraftStore';

export type DraftOperation = 'create' | 'update' | 'upsert';

export interface BackendDraftPayload<T = unknown> {
  modulo: string;
  recurso: string;
  operacion: DraftOperation;
  titulo?: string;
  descripcion?: string;
  payload_json: T;
  ids_json?: CrudRecord;
  metadata_json?: CrudRecord;
  estado_borrador: 'BORRADOR' | 'LISTO' | 'PUBLICADO' | 'DESCARTADO';
  clave_cliente: string;
}

export interface BackendDraft<T = unknown> extends BackendDraftPayload<T> {
  id_borrador?: string | number;
  fecha_registro?: string;
  fecha_modificacion?: string;
}

const DRAFT_ENDPOINT = '/api/administracion/registro-borrador';

function encodeQuery(params: Record<string, string | number | boolean | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') return;
    query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

function asRecord(value: unknown): CrudRecord {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as CrudRecord : {};
}

function asBackendDraft<T>(record: CrudRecord): BackendDraft<T> {
  return record as unknown as BackendDraft<T>;
}

export function buildBackendDraftKey(resource: CrudResourceDefinition, operation: DraftOperation, recordId?: string | number | null): string {
  return `frontend:${resource.module}:${resource.key}:${operation}:${recordId ? String(recordId) : 'new'}`;
}

export function buildBackendDraftPayload<T>(
  resource: CrudResourceDefinition,
  operation: DraftOperation,
  payload: T,
  options: { recordId?: string | number | null; titulo?: string; ids?: CrudRecord; metadata?: CrudRecord } = {},
): BackendDraftPayload<T> {
  const recordId = options.recordId ?? null;
  return {
    modulo: resource.module,
    recurso: resource.key,
    operacion: operation,
    titulo: options.titulo ?? `${operation === 'update' ? 'Edición' : 'Nuevo registro'} - ${resource.label}`,
    payload_json: sanitizeDraftPayload(payload),
    ids_json: options.ids ?? (recordId ? { [resource.primaryKey]: recordId } : undefined),
    metadata_json: {
      pantalla: 'frontend-react',
      recurso_label: resource.label,
      tabla: resource.table,
      version_frontend: '1.1.28',
      ...options.metadata,
    },
    estado_borrador: 'BORRADOR',
    clave_cliente: buildBackendDraftKey(resource, operation, recordId),
  };
}

export async function listBackendDrafts<T>(resource: CrudResourceDefinition, operation: DraftOperation, recordId?: string | number | null): Promise<Array<BackendDraft<T>>> {
  const claveCliente = buildBackendDraftKey(resource, operation, recordId ?? null);
  const response = await httpClient.get<unknown>(`${DRAFT_ENDPOINT}${encodeQuery({
    page: 1,
    limit: 50,
    orderBy: 'fecha_registro',
    orderDir: 'DESC',
    modulo: resource.module,
    recurso: resource.key,
    operacion: operation,
    estado_borrador: 'BORRADOR',
    clave_cliente: claveCliente,
  })}`);

  const rows = normalizeListResponse(response).map(asBackendDraft<T>);
  return rows
    .filter((draft) => String(draft.estado_borrador ?? '').toUpperCase() === 'BORRADOR')
    .filter((draft) => !draft.modulo || draft.modulo === resource.module)
    .filter((draft) => !draft.recurso || draft.recurso === resource.key)
    .filter((draft) => !draft.operacion || draft.operacion === operation)
    .filter((draft) => !draft.clave_cliente || draft.clave_cliente === claveCliente)
    .sort((a, b) => String(b.fecha_modificacion ?? b.fecha_registro ?? '').localeCompare(String(a.fecha_modificacion ?? a.fecha_registro ?? '')));
}

export async function getLatestBackendDraft<T>(resource: CrudResourceDefinition, operation: DraftOperation, recordId?: string | number | null): Promise<BackendDraft<T> | null> {
  const drafts = await listBackendDrafts<T>(resource, operation, recordId ?? null);
  return drafts[0] ?? null;
}

export async function saveBackendDraft<T>(
  resource: CrudResourceDefinition,
  operation: DraftOperation,
  payload: T,
  options: { recordId?: string | number | null; existingDraftId?: string | number | null; ids?: CrudRecord; metadata?: CrudRecord } = {},
): Promise<BackendDraft<T>> {
  const draftPayload = buildBackendDraftPayload(resource, operation, payload, {
    recordId: options.recordId ?? null,
    ids: options.ids,
    metadata: options.metadata,
  });

  const draftId = options.existingDraftId ?? (await getLatestBackendDraft<T>(resource, operation, options.recordId ?? null))?.id_borrador;
  const response = draftId
    ? await httpClient.patch<unknown, Partial<BackendDraftPayload<T>>>(`${DRAFT_ENDPOINT}/${draftId}`, draftPayload)
    : await httpClient.post<unknown, BackendDraftPayload<T>>(DRAFT_ENDPOINT, draftPayload);

  return asBackendDraft<T>(normalizeRecordResponse(response));
}

export async function discardBackendDraft(draftId: string | number): Promise<void> {
  await httpClient.patch<unknown, CrudRecord>(`${DRAFT_ENDPOINT}/${draftId}`, { estado_borrador: 'DESCARTADO' });
}

export function readDraftPayload<T>(draft: BackendDraft<T> | null): T | null {
  if (!draft) return null;
  const payload = draft.payload_json;
  if (payload === undefined || payload === null) return null;
  return payload as T;
}

export function readDraftIds(draft: BackendDraft | null): CrudRecord {
  return asRecord(draft?.ids_json);
}
