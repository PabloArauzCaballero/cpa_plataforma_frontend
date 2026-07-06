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

function normalizeResourceSpecificPayload(resource: CrudResourceDefinition, payload: CrudRecord): CrudRecord {
  if (resource.key === 'estudiante') return normalizeStudentPayload(payload);
  if (resource.key !== 'archivos-transaccion') return payload;

  const link = payload.link_achivo ?? payload.link_archivo;
  if (!link) return payload;

  return {
    ...payload,
    link_achivo: link,
    link_archivo: link,
  };
}

function normalizeComparableValue(value: unknown): string {
  return String(value ?? '').trim().toUpperCase();
}

function conditionMatches(payload: CrudRecord, condition: Record<string, string | number | boolean>): boolean {
  return Object.entries(condition).every(([name, expected]) => normalizeComparableValue(payload[name]) === normalizeComparableValue(expected));
}

function normalizeStudentPayload(payload: CrudRecord): CrudRecord {
  const tipo = normalizeComparableValue(payload.tipo);
  const nextPayload = { ...payload };

  if (tipo === 'UNIVERSITARIO') {
    nextPayload.nivel_actual = undefined;
    nextPayload.curso_actual = undefined;
    nextPayload.turno_actual = undefined;
  } else if (tipo === 'COLEGIAL') {
    nextPayload.carrera = undefined;
    nextPayload.anio_ingreso = undefined;
  } else {
    nextPayload.nivel_actual = undefined;
    nextPayload.curso_actual = undefined;
    nextPayload.turno_actual = undefined;
    nextPayload.carrera = undefined;
    nextPayload.anio_ingreso = undefined;
  }

  return nextPayload;
}

function resetStudentDependentFields(name: string, value: unknown, current: CrudRecord): CrudRecord {
  if (name !== 'tipo') return { ...current, [name]: value };

  const tipo = normalizeComparableValue(value);
  const nextPayload: CrudRecord = { ...current, tipo };
  if (tipo === 'UNIVERSITARIO') {
    nextPayload.nivel_actual = '';
    nextPayload.curso_actual = '';
    nextPayload.turno_actual = '';
  } else if (tipo === 'COLEGIAL') {
    nextPayload.carrera = '';
    nextPayload.anio_ingreso = '';
  } else {
    nextPayload.nivel_actual = '';
    nextPayload.curso_actual = '';
    nextPayload.turno_actual = '';
    nextPayload.carrera = '';
    nextPayload.anio_ingreso = '';
  }
  return nextPayload;
}

function buildCleanPayload(resource: CrudResourceDefinition, payload: CrudRecord): CrudRecord {
  const normalizedPayload = normalizeResourceSpecificPayload(resource, payload);

  return resource.fields.reduce<CrudRecord>((clean, field) => {
    const sourcePayload = normalizedPayload;
    const normalized = normalizeFieldValue(field, sourcePayload[field.name]);
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

function resolveConditionalOptions(field: ResourceFieldDefinition, payload: CrudRecord): Array<string | SelectOption> | undefined {
  if (!field.conditionalOptions) return undefined;
  const controllerValue = String(payload[field.conditionalOptions.dependsOn] ?? '');
  return field.conditionalOptions.valuesByControllerValue[controllerValue];
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
    setPayload((current) => (resource.key === 'estudiante' ? resetStudentDependentFields(name, value, current) : { ...current, [name]: value }));
  }

  function replacePayload(nextPayload: CrudRecord) {
    setPayload(nextPayload);
    setJsonPayload(JSON.stringify(nextPayload, null, 2));
    setErrors({});
  }

  function getFieldOptions(field: ResourceFieldDefinition): Array<string | SelectOption> {
    const conditionalOptions = resolveConditionalOptions(field, payload);
    return mergeOptions(conditionalOptions ?? field.options, relationOptions[field.name]);
  }

  function isLoadingFieldOptions(field: ResourceFieldDefinition): boolean {
    return Boolean(loadingRelationFields[field.name]);
  }

  function isFieldVisible(field: ResourceFieldDefinition): boolean {
    if (!field.visibleWhen) return true;
    return conditionMatches(payload, field.visibleWhen);
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

    const normalizedPayload = normalizeResourceSpecificPayload(resource, payload);
    const nextErrors = validateResourcePayload(resource.fields, normalizedPayload, resource.key);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length ? null : buildCleanPayload(resource, normalizedPayload);
  }

  return {
    payload,
    jsonPayload,
    errors,
    setField,
    replacePayload,
    setJsonPayload,
    getPayload,
    getFieldOptions,
    isLoadingFieldOptions,
    isFieldVisible,
  };
}
