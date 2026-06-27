import { httpClient } from '@/shared/api/httpClient';
import type { ResourceLookupRelation, SelectOption } from '../domain/CrudResource';
import { normalizeListResponse } from './resourceMapper';

function withPaging(path: string, limit = 100, offset = 0): string {
  const separator = path.includes('?') ? '&' : '?';
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  params.set('onlyActivos', 'false');
  params.set('only_activos', 'false');
  params.set('includeInactive', 'true');
  params.set('include_inactive', 'true');
  return `${path}${separator}${params.toString()}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveTotal(response: unknown): number | null {
  if (!isRecord(response)) return null;

  const directCount = Number(response.count ?? response.total);
  if (Number.isFinite(directCount) && directCount >= 0) return directCount;

  if (isRecord(response.pagination)) {
    const paginationCount = Number(response.pagination.count ?? response.pagination.total);
    if (Number.isFinite(paginationCount) && paginationCount >= 0) return paginationCount;
  }

  if (isRecord(response.data)) {
    const dataCount = Number(response.data.count ?? response.data.total);
    if (Number.isFinite(dataCount) && dataCount >= 0) return dataCount;

    if (isRecord(response.data.paging)) {
      const pagingCount = Number(response.data.paging.count ?? response.data.paging.total);
      if (Number.isFinite(pagingCount) && pagingCount >= 0) return pagingCount;
    }
  }

  return null;
}

function toLabel(row: Record<string, unknown>, relation: ResourceLookupRelation): string {
  const parts = relation.labelFields
    .map((field) => row[field])
    .filter((value) => value !== undefined && value !== null && String(value).trim() !== '')
    .map((value) => String(value).trim());

  const uniqueParts = Array.from(new Set(parts));
  if (uniqueParts.length) return uniqueParts.slice(0, 3).join(' · ');

  const id = row[relation.valueField];
  return id === undefined || id === null ? 'Registro disponible' : `Registro ${String(id)}`;
}

function recordsToOptions(records: Record<string, unknown>[], relation: ResourceLookupRelation): SelectOption[] {
  const seen = new Set<string>();

  return records
    .map((record) => {
      const value = record[relation.valueField];
      if (value === undefined || value === null || String(value).trim() === '') return null;

      const normalizedValue = typeof value === 'number' ? value : String(value);
      const key = String(normalizedValue);
      if (seen.has(key)) return null;
      seen.add(key);

      return {
        value: normalizedValue,
        label: toLabel(record, relation),
      } satisfies SelectOption;
    })
    .filter((option): option is SelectOption => option !== null)
    .sort((a, b) => String(a.label).localeCompare(String(b.label), 'es'));
}

export async function listLookupOptions(relation: ResourceLookupRelation): Promise<SelectOption[]> {
  const response = await httpClient.get<unknown>(withPaging(relation.endpoint));
  const records = normalizeListResponse(response);
  return recordsToOptions(records, relation);
}

export async function listAllLookupOptions(relation: ResourceLookupRelation, pageSize = 500, maxRecords = 100000): Promise<SelectOption[]> {
  const collected: Record<string, unknown>[] = [];
  let offset = 0;
  let total: number | null = null;

  while (collected.length < maxRecords) {
    const response = await httpClient.get<unknown>(withPaging(relation.endpoint, pageSize, offset));
    const records = normalizeListResponse(response);
    total = total ?? resolveTotal(response);

    collected.push(...records);

    if (records.length === 0) break;
    if (total !== null && collected.length >= total) break;

    // El backend puede capar internamente el limit solicitado.
    // Avanzamos por la cantidad REAL recibida para no quedarnos solo con los primeros 100 registros.
    offset += records.length;
  }

  return recordsToOptions(collected.slice(0, maxRecords), relation);
}
