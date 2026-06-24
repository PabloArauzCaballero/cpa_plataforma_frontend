import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition, ResourceListQuery, ResourceTableFilter } from '../domain/CrudResource';
import { createResource, listResource, updateResource } from '../services/resourceApi';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function includesSearch(record: CrudRecord, search: string): boolean {
  if (!search.trim()) return true;
  return JSON.stringify(record).toLowerCase().includes(search.trim().toLowerCase());
}

function resolveRecordId(resource: CrudResourceDefinition, record: CrudRecord): string | null {
  if (resource.primaryKeys?.length) {
    const values = resource.primaryKeys.map((key) => record[key]);
    if (values.every((value) => value !== undefined && value !== null && String(value).trim())) {
      return values.map((value) => encodeURIComponent(String(value))).join('/');
    }
  }

  const candidates = [resource.primaryKey, 'id', ...Object.keys(record).filter((key) => key.startsWith('id_'))];
  for (const key of candidates) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return encodeURIComponent(String(value));
    }
  }
  return null;
}

function canDisable(record: CrudRecord): boolean {
  return Object.keys(record).some((key) => key.toLowerCase().includes('estado') || key.toLowerCase() === 'activo');
}

function buildDisablePayload(record: CrudRecord): CrudRecord {
  if ('activo' in record) return { activo: false };
  const stateKey = Object.keys(record).find((key) => key.toLowerCase().includes('estado'));
  return stateKey ? { [stateKey]: 'INACTIVO' } : {};
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function mapFilterType(fieldType: string): ResourceTableFilter['type'] {
  if (fieldType === 'checkbox') return 'boolean';
  if (fieldType === 'select') return 'select';
  if (fieldType === 'number') return 'number';
  if (fieldType === 'date') return 'date';
  if (fieldType === 'time') return 'time';
  if (fieldType === 'datetime-local') return 'datetime-local';
  return 'text';
}

function shouldShowFilter(name: string): boolean {
  const lower = name.toLowerCase();
  if (lower.includes('contrasena')) return false;
  if (lower.includes('password')) return false;
  if (lower.includes('hash')) return false;
  if (lower.includes('token')) return false;
  return true;
}

function buildFilters(resource: CrudResourceDefinition): ResourceTableFilter[] {
  const baseFilters = resource.fields
    .filter((field) => shouldShowFilter(field.name))
    .map((field) => ({
      name: field.name,
      label: field.label || formatLabel(field.name),
      type: mapFilterType(field.type),
      options: field.options,
    } satisfies ResourceTableFilter));

  const existing = new Set(baseFilters.map((filter) => filter.name));
  const statusFilters: ResourceTableFilter[] = [];
  if (!existing.has('estado_registro')) {
    statusFilters.push({
      name: 'estado_registro',
      label: 'Estado registro',
      type: 'select',
      options: ['Activo', 'Inactivo', 'Eliminado'],
    });
  }

  return [...baseFilters, ...statusFilters];
}

function sanitizeFilterValue(value: string): string | number | boolean | '' {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

export function useResourceListViewModel(resource: CrudResourceDefinition) {
  const [records, setRecords] = useState<CrudRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [orderBy, setOrderBy] = useState(resource.primaryKey);
  const [orderDir, setOrderDir] = useState<'ASC' | 'DESC'>('ASC');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearchState] = useState('');
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>({});
  const [editingRecord, setEditingRecord] = useState<CrudRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const availableFilters = useMemo(() => buildFilters(resource), [resource]);

  const query = useMemo<ResourceListQuery>(() => ({
    page,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy,
    orderDir,
    search,
    filters,
  }), [page, pageSize, orderBy, orderDir, search, filters]);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listResource(resource, query);
      setRecords(data.records);
      setTotalRecords(data.count);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : `No se pudo cargar ${resource.label}.`);
    } finally {
      setIsLoading(false);
    }
  }, [query, resource]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
    setOrderBy(resource.primaryKey);
    setOrderDir('ASC');
    setFilters({});
    setSearchState('');
  }, [resource.key, resource.module, resource.primaryKey]);

  const visibleRecords = useMemo(() => {
    // Filtro cliente como respaldo cuando el backend ignora q. Los filtros por campo
    // se envían siempre como query params al backend.
    return records.filter((record) => includesSearch(record, search));
  }, [records, search]);

  const columns = useMemo(() => {
    const priority = [resource.primaryKey, 'id', 'codigo', 'nombre', 'nombre_cuenta', 'concepto', 'fecha', 'estado', 'estado_registro', 'activo'];
    const keys = Array.from(new Set(records.slice(0, 8).flatMap((record) => Object.keys(record))));
    return keys
      .sort((a, b) => {
        const ai = priority.indexOf(a);
        const bi = priority.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
      .slice(0, 10);
  }, [records, resource.primaryKey]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }

  function setFilterValue(name: string, value: string) {
    setFilters((current) => {
      const next = { ...current };
      const cleanValue = sanitizeFilterValue(value);
      if (cleanValue === '') delete next[name];
      else next[name] = cleanValue;
      return next;
    });
    setPage(1);
  }

  function clearFilters() {
    setFilters({});
    setSearchState('');
    setPage(1);
  }

  function changePageSize(value: number) {
    setPageSize(value);
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  function openCreate() {
    setEditingRecord(null);
    setIsFormOpen(true);
    setMessage(null);
  }

  function openEdit(record: CrudRecord) {
    setEditingRecord(record);
    setIsFormOpen(true);
    setMessage(null);
  }

  async function save(payload: CrudRecord) {
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);
      if (editingRecord) {
        const id = resolveRecordId(resource, editingRecord);
        if (!id) throw new Error(`No se encontró identificador para actualizar ${resource.label}.`);
        await updateResource(resource, id, payload);
        setMessage('Registro actualizado correctamente.');
      } else {
        await createResource(resource, payload);
        setMessage('Registro creado correctamente.');
      }
      setIsFormOpen(false);
      setEditingRecord(null);
      await load();
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo guardar el registro.');
    } finally {
      setIsSaving(false);
    }
  }

  async function disable(record: CrudRecord) {
    const id = resolveRecordId(resource, record);
    if (!id || !canDisable(record)) return;

    try {
      setIsSaving(true);
      setError(null);
      await updateResource(resource, id, buildDisablePayload(record));
      setMessage('Registro inhabilitado correctamente.');
      await load();
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No se pudo inhabilitar el registro.');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    records,
    visibleRecords,
    columns,
    search,
    filters,
    availableFilters,
    totalRecords,
    page,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    orderBy,
    orderDir,
    isLoading,
    isSaving,
    error,
    message,
    editingRecord,
    isFormOpen,
    canDisableRecord: canDisable,
    setSearch,
    setFilterValue,
    clearFilters,
    setPage,
    changePageSize,
    setOrderBy,
    setOrderDir,
    setIsFormOpen,
    goToPreviousPage,
    goToNextPage,
    load,
    openCreate,
    openEdit,
    save,
    disable,
  };
}
