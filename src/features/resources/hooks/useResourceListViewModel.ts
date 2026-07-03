import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition, ResourceListQuery, ResourceTableFilter, SelectOption } from '../domain/CrudResource';
import { createResource, getResource, listAllResource, listResource, updateResource } from '../services/resourceApi';
import { listAllLookupOptions } from '../services/lookupApi';
import { exportRecords } from '../utils/exportRecords';
import { humanizeFieldLabel } from '@/shared/utils/humanize';

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];


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
  return stateKey ? { [stateKey]: 'Inactivo' } : {};
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

function inferFilterTypeFromValue(value: unknown): ResourceTableFilter['type'] {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  const text = String(value ?? '');
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) return 'datetime-local';
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return 'date';
  if (/^\d{2}:\d{2}/.test(text)) return 'time';
  return 'text';
}

function buildDynamicFilterOptions(records: CrudRecord[], name: string): Array<string> | undefined {
  const values = Array.from(new Set(
    records
      .map((record) => record[name])
      .filter((value) => value !== undefined && value !== null && String(value).trim() !== '')
      .map((value) => String(value).trim()),
  ));

  if (values.length === 0 || values.length > 30) return undefined;
  return values.sort((a, b) => a.localeCompare(b, 'es'));
}

function buildFilters(
  resource: CrudResourceDefinition,
  records: CrudRecord[] = [],
  lookupOptionsByField: Record<string, SelectOption[]> = {},
): ResourceTableFilter[] {
  const baseFilters = resource.fields
    .filter((field) => shouldShowFilter(field.name))
    .map((field) => {
      const lookupOptions = lookupOptionsByField[field.name];
      const options = lookupOptions?.length ? lookupOptions : field.options;
      return {
        name: field.name,
        label: humanizeFieldLabel(field.label, field.name),
        type: options?.length || field.relation ? 'select' : mapFilterType(field.type),
        options,
        relation: field.relation,
      } satisfies ResourceTableFilter;
    });

  const existing = new Set(baseFilters.map((filter) => filter.name));
  const statusFilters: ResourceTableFilter[] = [];
  if (!existing.has('estado_registro')) {
    statusFilters.push({
      name: 'estado_registro',
      label: 'Estado Registro',
      type: 'select',
      options: ['Activo', 'Inactivo', 'Eliminado'],
    });
  }

  const existingAfterStatus = new Set([...baseFilters, ...statusFilters].map((filter) => filter.name));
  const dynamicFilters: ResourceTableFilter[] = [];

  for (const key of Array.from(new Set(records.flatMap((record) => Object.keys(record))))) {
    if (existingAfterStatus.has(key) || !shouldShowFilter(key)) continue;
    const sample = records.find((record) => record[key] !== undefined && record[key] !== null)?.[key];
    const options = buildDynamicFilterOptions(records, key);
    dynamicFilters.push({
      name: key,
      label: humanizeFieldLabel(key),
      type: options ? 'select' : inferFilterTypeFromValue(sample),
      options,
    });
  }

  return [...baseFilters, ...dynamicFilters.slice(0, 12), ...statusFilters];
}

function sanitizeFilterValue(value: string): string | number | boolean | '' {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function hasActiveQuery(search: string | undefined, filters: Record<string, string | number | boolean>): boolean {
  return Boolean(search?.trim()) || Object.keys(filters).some((key) => String(filters[key] ?? '').trim() !== '');
}

function normalizeForCompare(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function isIdLikeField(name: string): boolean {
  return /^id_/i.test(name) || /^id[A-Z]/.test(name);
}

function recordMatchesFilters(record: CrudRecord, filters: Record<string, string | number | boolean>): boolean {
  return Object.entries(filters).every(([key, expected]) => {
    if (expected === undefined || expected === null || String(expected).trim() === '') return true;

    const actual = record[key];
    if (actual === undefined || actual === null) return false;

    if (typeof expected === 'boolean') return Boolean(actual) === expected || normalizeForCompare(actual) === normalizeForCompare(expected);

    const expectedText = normalizeForCompare(expected);
    const actualText = normalizeForCompare(actual);

    // Los FK y selects deben filtrar por valor exacto para evitar coincidencias accidentales.
    if (isIdLikeField(key) || typeof actual === 'number') return actualText === expectedText;

    return actualText.includes(expectedText);
  });
}

function recordMatchesSearch(record: CrudRecord, search: string | undefined): boolean {
  const cleanSearch = normalizeForCompare(search);
  if (!cleanSearch) return true;

  return Object.values(record).some((value) => {
    if (value === undefined || value === null) return false;
    return normalizeForCompare(value).includes(cleanSearch);
  });
}

function compareRecords(a: CrudRecord, b: CrudRecord, orderBy: string | undefined, orderDir: 'ASC' | 'DESC'): number {
  if (!orderBy) return 0;
  const left = a[orderBy];
  const right = b[orderBy];
  const direction = orderDir === 'DESC' ? -1 : 1;

  const leftNumber = Number(left);
  const rightNumber = Number(right);
  if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) return (leftNumber - rightNumber) * direction;

  return normalizeForCompare(left).localeCompare(normalizeForCompare(right), 'es') * direction;
}

function applyLocalQuery(
  allRecords: CrudRecord[],
  query: ResourceListQuery,
): { records: CrudRecord[]; count: number } {
  const filtered = allRecords
    .filter((record) => recordMatchesSearch(record, query.search))
    .filter((record) => recordMatchesFilters(record, query.filters))
    .sort((a, b) => compareRecords(a, b, query.orderBy, query.orderDir));

  return {
    records: filtered.slice(query.offset, query.offset + query.limit),
    count: filtered.length,
  };
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
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterInputs, setFilterInputs] = useState<Record<string, string | number | boolean>>({});
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>({});
  const [editingRecord, setEditingRecord] = useState<CrudRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [lookupOptionsByField, setLookupOptionsByField] = useState<Record<string, SelectOption[]>>({});

  const availableFilters = useMemo(() => buildFilters(resource, records, lookupOptionsByField), [resource, records, lookupOptionsByField]);

  const query = useMemo<ResourceListQuery>(() => ({
    page,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy,
    orderDir,
    search: debouncedSearch,
    filters,
  }), [page, pageSize, orderBy, orderDir, debouncedSearch, filters]);

  useEffect(() => {
    let isMounted = true;

    async function loadLookupFilters() {
      const fieldsWithRelations = resource.fields.filter((field) => field.relation);
      if (fieldsWithRelations.length === 0) {
        setLookupOptionsByField({});
        return;
      }

      const entries = await Promise.all(
        fieldsWithRelations.map(async (field) => {
          try {
            const options = await listAllLookupOptions(field.relation!, 300, 100000);
            return [field.name, options] as const;
          } catch {
            return [field.name, []] as const;
          }
        }),
      );

      if (!isMounted) return;
      setLookupOptionsByField(Object.fromEntries(entries));
    }

    void loadLookupFilters();

    return () => {
      isMounted = false;
    };
  }, [resource.fields, resource.key]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters(filterInputs);
      setPage(1);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [filterInputs]);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (hasActiveQuery(query.search, query.filters)) {
        // Fallback profesional: algunos endpoints genéricos no aplican todos los filtros FK en servidor.
        // Para que la tabla nunca mienta, cuando hay búsqueda/filtros cargamos el universo paginado
        // y aplicamos la consulta en frontend antes de paginar visualmente.
        const allData = await listAllResource(resource, {
          ...query,
          page: 1,
          offset: 0,
          search: '',
          filters: {},
        });
        const localResult = applyLocalQuery(allData.records, query);
        setRecords(localResult.records);
        setTotalRecords(localResult.count);
        return;
      }

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
    setFilterInputs({});
    setFilters({});
    setSearchInput('');
    setDebouncedSearch('');
    setLookupOptionsByField({});
  }, [resource.key, resource.module, resource.primaryKey]);

  const visibleRecords = useMemo(() => records, [records]);

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

  const columnLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    const fieldLabelByName = new Map(resource.fields.map((field) => [field.name, humanizeFieldLabel(field.label, field.name)]));
    columns.forEach((column) => {
      labels[column] = fieldLabelByName.get(column) ?? humanizeFieldLabel(column);
    });
    return labels;
  }, [columns, resource.fields]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  function setSearch(value: string) {
    setSearchInput(value);
  }

  function setFilterValue(name: string, value: string) {
    setFilterInputs((current) => {
      const next = { ...current };
      const cleanValue = sanitizeFilterValue(value);
      if (cleanValue === '') delete next[name];
      else next[name] = cleanValue;
      return next;
    });
  }

  function clearFilters() {
    setFilterInputs({});
    setFilters({});
    setSearchInput('');
    setDebouncedSearch('');
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

  async function openEdit(record: CrudRecord) {
    setIsFormOpen(true);
    setEditingRecord(record);
    setMessage(null);
    setError(null);

    const id = resolveRecordId(resource, record);
    if (!id) return;

    try {
      const fullRecord = await getResource(resource, id);
      setEditingRecord({ ...record, ...fullRecord });
    } catch {
      // Si el endpoint de detalle no devuelve datos enriquecidos, mantenemos la fila visible.
      setEditingRecord(record);
    }
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


  function openExportModal() {
    setExportError(null);
    setIsExportModalOpen(true);
  }

  function closeExportModal() {
    if (!isExporting) setIsExportModalOpen(false);
  }

  async function exportWithQuery(options: {
    format: 'csv' | 'excel' | 'json';
    search: string;
    filters: Record<string, string | number | boolean>;
  }) {
    try {
      setIsExporting(true);
      setExportError(null);
      const exportQuery: ResourceListQuery = {
        page: 1,
        limit: pageSize,
        offset: 0,
        orderBy,
        orderDir,
        search: options.search,
        filters: options.filters,
      };
      const rawResult = await listAllResource(resource, {
        ...exportQuery,
        search: '',
        filters: {},
      });
      const localExport = applyLocalQuery(
        rawResult.records,
        { ...exportQuery, limit: rawResult.records.length || 1, offset: 0 },
      );
      const result = { records: localExport.records, count: localExport.count };
      if (result.records.length === 0) {
        setExportError('No hay registros para exportar con la consulta seleccionada.');
        return;
      }
      exportRecords({
        records: result.records,
        preferredColumns: columns,
        columnLabels,
        resourceLabel: resource.label,
        format: options.format,
      });
      setMessage(`Exportación generada con ${result.records.length} registro(s).`);
      setIsExportModalOpen(false);
    } catch (currentError) {
      setExportError(currentError instanceof Error ? currentError.message : 'No se pudo exportar la consulta.');
    } finally {
      setIsExporting(false);
    }
  }

  return {
    records,
    visibleRecords,
    columns,
    columnLabels,
    search: searchInput,
    debouncedSearch,
    filters: filterInputs,
    activeFilters: filters,
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
    isExportModalOpen,
    isExporting,
    exportError,
    canDisableRecord: canDisable,
    setSearch,
    setFilterValue,
    clearFilters,
    openExportModal,
    closeExportModal,
    exportWithQuery,
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
