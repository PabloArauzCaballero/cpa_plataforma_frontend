import { useMemo, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition, ResourceFieldDefinition } from '../domain/CrudResource';

function stringifyInitialValue(value: unknown): string | number | boolean {
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
}

function buildInitialPayload(resource: CrudResourceDefinition, record: CrudRecord | null): CrudRecord {
  if (resource.fields.length === 0) return record ?? {};

  return resource.fields.reduce<CrudRecord>((payload, field) => {
    payload[field.name] = stringifyInitialValue(record?.[field.name]);
    return payload;
  }, {});
}

function normalizeFieldValue(field: ResourceFieldDefinition, value: unknown): unknown {
  if (value === '') return undefined;

  if (field.type === 'number') {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : value;
  }

  return value;
}

function buildCleanPayload(resource: CrudResourceDefinition, payload: CrudRecord): CrudRecord {
  return resource.fields.reduce<CrudRecord>((clean, field) => {
    const normalized = normalizeFieldValue(field, payload[field.name]);
    if (normalized === undefined || normalized === null) return clean;
    clean[field.name] = normalized;
    return clean;
  }, {});
}

export function useResourceFormViewModel(resource: CrudResourceDefinition, record: CrudRecord | null) {
  const initialPayload = useMemo(() => buildInitialPayload(resource, record), [resource, record]);
  const [payload, setPayload] = useState<CrudRecord>(initialPayload);
  const [jsonPayload, setJsonPayload] = useState(JSON.stringify(record ?? {}, null, 2));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(name: string, value: unknown) {
    setPayload((current) => ({ ...current, [name]: value }));
  }

  function getPayload(): CrudRecord | null {
    const nextErrors: Record<string, string> = {};

    if (resource.fields.length === 0) {
      try {
        const parsed = JSON.parse(jsonPayload) as CrudRecord;
        setErrors({});
        return parsed;
      } catch {
        setErrors({ json: 'El JSON no es válido.' });
        return null;
      }
    }

    for (const field of resource.fields) {
      const value = payload[field.name];
      if (field.required && (value === undefined || value === null || String(value).trim() === '')) {
        nextErrors[field.name] = 'Campo obligatorio.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length ? null : buildCleanPayload(resource, payload);
  }

  return {
    payload,
    jsonPayload,
    errors,
    setField,
    setJsonPayload,
    getPayload,
  };
}
