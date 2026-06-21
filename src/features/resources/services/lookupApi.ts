import { httpClient } from '@/shared/api/httpClient';
import type { ResourceLookupRelation, SelectOption } from '../domain/CrudResource';
import { normalizeListResponse } from './resourceMapper';

function withPaging(path: string): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}limit=100&offset=0`;
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

export async function listLookupOptions(relation: ResourceLookupRelation): Promise<SelectOption[]> {
  const response = await httpClient.get<unknown>(withPaging(relation.endpoint));
  const records = normalizeListResponse(response);

  return records
    .map((record) => {
      const value = record[relation.valueField];
      if (value === undefined || value === null || String(value).trim() === '') return null;
      return {
        value: typeof value === 'number' ? value : String(value),
        label: toLabel(record, relation),
      } satisfies SelectOption;
    })
    .filter((option): option is SelectOption => option !== null);
}
