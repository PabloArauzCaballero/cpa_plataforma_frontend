import type { CrudRecord } from '../domain/CrudResource';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeListResponse(response: unknown): CrudRecord[] {
  if (Array.isArray(response)) return response as CrudRecord[];

  if (isRecord(response)) {
    const data = response.data;
    if (Array.isArray(data)) return data as CrudRecord[];
    if (isRecord(data) && Array.isArray(data.items)) return data.items as CrudRecord[];
    if (Array.isArray(response.items)) return response.items as CrudRecord[];
    if (Array.isArray(response.rows)) return response.rows as CrudRecord[];
    if (Array.isArray(response.results)) return response.results as CrudRecord[];
  }

  return [];
}

export function normalizeRecordResponse(response: unknown): CrudRecord {
  if (isRecord(response) && isRecord(response.data)) return response.data as CrudRecord;
  if (isRecord(response)) return response as CrudRecord;
  return {};
}
