import { useEffect, useMemo, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition, ResourceFieldDefinition, SelectOption } from '../domain/CrudResource';
import { listLookupOptions } from '../services/lookupApi';
import { validateResourcePayload } from '@/shared/validation/formValidation';

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

  if (field.valueKind === 'number' || field.type === 'number') {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : value;
  }

  if (field.valueKind === 'boolean' || field.type === 'checkbox') {
    return Boolean(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
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

function mergeOptions(
  staticOptions: ResourceFieldDefinition['options'] = [],
  dynamicOptions: SelectOption[] = [],
): Array<string | SelectOption> {
  if (dynamicOptions.length) return dynamicOptions;
  return staticOptions;
}

export function useResourceFormViewModel(resource: CrudResourceDefinition, record: CrudRecord | null) {
  const initialPayload = useMemo(() => buildInitialPayload(resource, record), [resource, record]);
  const [payload, setPayload] = useState<CrudRecord>(initialPayload);
  const [jsonPayload, setJsonPayload] = useState(JSON.stringify(record ?? {}, null, 2));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [relationOptions, setRelationOptions] = useState<Record<string, SelectOption[]>>({});
  const [loadingRelationFields, setLoadingRelationFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPayload(buildInitialPayload(resource, record));
    setJsonPayload(JSON.stringify(record ?? {}, null, 2));
    setErrors({});
  }, [resource, record]);

  useEffect(() => {
    let isMounted = true;
    const fieldsWithRelation = resource.fields.filter((field) => field.relation);
    if (!fieldsWithRelation.length) {
      setRelationOptions({});
      setLoadingRelationFields({});
      return undefined;
    }

    setLoadingRelationFields(fieldsWithRelation.reduce<Record<string, boolean>>((acc, field) => ({ ...acc, [field.name]: true }), {}));

    Promise.allSettled(fieldsWithRelation.map(async (field) => {
      const options = field.relation ? await listLookupOptions(field.relation) : [];
      return [field.name, options] as const;
    })).then((results) => {
      if (!isMounted) return;
      const nextOptions: Record<string, SelectOption[]> = {};
      const nextLoading: Record<string, boolean> = {};

      results.forEach((result, index) => {
        const field = fieldsWithRelation[index];
        nextLoading[field.name] = false;
        if (result.status === 'fulfilled') {
          nextOptions[result.value[0]] = result.value[1];
        } else {
          nextOptions[field.name] = [];
        }
      });

      setRelationOptions(nextOptions);
      setLoadingRelationFields(nextLoading);
    });

    return () => {
      isMounted = false;
    };
  }, [resource]);

  function setField(name: string, value: unknown) {
    setPayload((current) => ({ ...current, [name]: value }));
  }

  function getFieldOptions(field: ResourceFieldDefinition): Array<string | SelectOption> {
    return mergeOptions(field.options, relationOptions[field.name]);
  }

  function isLoadingFieldOptions(field: ResourceFieldDefinition): boolean {
    return Boolean(loadingRelationFields[field.name]);
  }

  function getPayload(): CrudRecord | null {
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

    const nextErrors = validateResourcePayload(resource.fields, payload);
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
    getFieldOptions,
    isLoadingFieldOptions,
  };
}
