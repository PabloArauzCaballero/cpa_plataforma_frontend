import type { CrudRecord } from '../domain/CrudResource';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCrudRecordArray(value: unknown): value is CrudRecord[] {
  return Array.isArray(value);
}

/**
 * Normaliza las respuestas reales del backend CPA.
 *
 * El backend puede devolver listas de varias formas según el recurso/función SQL:
 * - []
 * - { rows: [] }
 * - { items: [] }
 * - { results: [] }
 * - { data: [] }
 * - { data: { rows: [], count, limit, offset } }
 * - { data: { items: [], count, limit, offset } }
 *
 * El caso { success, message, data: { rows } } es el formato principal de los
 * endpoints CRUD del backend NestJS, por eso debe tener prioridad explícita.
 */
export function normalizeListResponse(response: unknown): CrudRecord[] {
  if (isCrudRecordArray(response)) return response;

  if (!isRecord(response)) return [];

  const directCandidates = [
    response.rows,
    response.items,
    response.results,
    response.records,
    response.data,
  ];

  for (const candidate of directCandidates) {
    if (isCrudRecordArray(candidate)) return candidate;
  }

  const data = response.data;
  if (isRecord(data)) {
    const nestedCandidates = [
      data.rows,
      data.items,
      data.results,
      data.records,
      data.detalle,
    ];

    for (const candidate of nestedCandidates) {
      if (isCrudRecordArray(candidate)) return candidate;
    }
  }

  return [];
}

export function normalizeRecordResponse(response: unknown): CrudRecord {
  if (isRecord(response) && isRecord(response.data)) return response.data as CrudRecord;
  if (isRecord(response)) return response as CrudRecord;
  return {};
}
