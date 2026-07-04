import type { CrudRecord, ResourceListResult } from '../domain/CrudResource';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCrudRecordArray(value: unknown): value is CrudRecord[] {
  return Array.isArray(value);
}

function asNumber(value: unknown, fallback: number): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
}

function firstNumber(source: Record<string, unknown>, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = source[key];
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 0) return numeric;
  }
  return fallback;
}

function pickRowsAndMeta(response: unknown): { rows: CrudRecord[]; meta: Record<string, unknown> } {
  if (isCrudRecordArray(response)) return { rows: response, meta: {} };
  if (!isRecord(response)) return { rows: [], meta: {} };

  const directCandidates = [response.rows, response.items, response.results, response.records, response.data];
  for (const candidate of directCandidates) {
    if (isCrudRecordArray(candidate)) return { rows: candidate, meta: response };
  }

  const data = response.data;
  if (isRecord(data)) {
    const nestedCandidates = [data.rows, data.items, data.results, data.records, data.detalle];
    for (const candidate of nestedCandidates) {
      if (isCrudRecordArray(candidate)) return { rows: candidate, meta: data };
    }
  }

  return { rows: [], meta: response };
}

/**
 * Normaliza las respuestas reales del sistema CPA.
 *
 * El formato principal del sistema NestJS es:
 * { success, message, data: { rows, count, limit, offset }, pagination }
 */
export function normalizeListResponse(response: unknown): CrudRecord[] {
  return pickRowsAndMeta(response).rows;
}

export function normalizeListResult(response: unknown, fallbackLimit = 20, fallbackOffset = 0): ResourceListResult {
  const { rows, meta } = pickRowsAndMeta(response);
  const root = isRecord(response) ? response : {};
  const pagination = isRecord(root.pagination) ? root.pagination : {};
  const paging = isRecord(meta.paging) ? meta.paging : {};

  const limit = firstNumber(meta, ['limit', 'pageSize'], firstNumber(pagination, ['limit', 'pageSize'], firstNumber(paging, ['limit', 'pageSize'], fallbackLimit)));
  const offset = firstNumber(meta, ['offset'], firstNumber(pagination, ['offset'], firstNumber(paging, ['offset'], fallbackOffset)));
  const count = firstNumber(meta, ['count', 'total'], firstNumber(pagination, ['count', 'total'], firstNumber(paging, ['count', 'total'], rows.length)));
  const pageFromResponse = firstNumber(meta, ['page'], firstNumber(pagination, ['page'], 0));
  const page = pageFromResponse > 0 ? pageFromResponse : Math.floor(offset / Math.max(limit, 1)) + 1;

  return {
    records: rows,
    count: Math.max(count, rows.length),
    limit: Math.max(asNumber(limit, fallbackLimit), 1),
    offset: asNumber(offset, fallbackOffset),
    page,
  };
}

export function normalizeRecordResponse(response: unknown): CrudRecord {
  if (isRecord(response) && isRecord(response.data)) return response.data as CrudRecord;
  if (isRecord(response)) return response as CrudRecord;
  return {};
}
