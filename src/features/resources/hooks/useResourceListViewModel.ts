import { useEffect, useMemo, useState } from 'react';
import type { CrudRecord, CrudResourceDefinition } from '../domain/CrudResource';
import { createResource, listResource, updateResource } from '../services/resourceApi';

function detectStatus(record: CrudRecord): string {
  const statusKeys = Object.keys(record).filter((key) => key.toLowerCase().includes('estado') || key.toLowerCase() === 'activo');
  const key = statusKeys[0];
  return key ? String(record[key]) : '';
}

function includesSearch(record: CrudRecord, search: string): boolean {
  if (!search.trim()) return true;
  return JSON.stringify(record).toLowerCase().includes(search.trim().toLowerCase());
}

function resolveRecordId(resource: CrudResourceDefinition, record: CrudRecord): string | null {
  const candidates = [resource.primaryKey, 'id', ...Object.keys(record).filter((key) => key.startsWith('id_'))];
  for (const key of candidates) {
    const value = record[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
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

export function useResourceListViewModel(resource: CrudResourceDefinition) {
  const [records, setRecords] = useState<CrudRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [editingRecord, setEditingRecord] = useState<CrudRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function load() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await listResource(resource);
      setRecords(data);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : `No se pudo cargar ${resource.label}.`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [resource.key, resource.module]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(records.map(detectStatus).filter(Boolean))).sort();
  }, [records]);

  const visibleRecords = useMemo(() => {
    return records.filter((record) => includesSearch(record, search) && (!status || detectStatus(record) === status));
  }, [records, search, status]);

  const columns = useMemo(() => {
    const priority = [resource.primaryKey, 'id', 'nombre', 'codigo', 'concepto', 'fecha', 'estado', 'activo'];
    const keys = Array.from(new Set(records.slice(0, 8).flatMap((record) => Object.keys(record))));
    return keys
      .sort((a, b) => {
        const ai = priority.indexOf(a);
        const bi = priority.indexOf(b);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
      .slice(0, 8);
  }, [records, resource.primaryKey]);

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
      setMessage('Registro inhabilitado mediante PATCH.');
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
    status,
    statusOptions,
    isLoading,
    isSaving,
    error,
    message,
    editingRecord,
    isFormOpen,
    canDisableRecord: canDisable,
    setSearch,
    setStatus,
    setIsFormOpen,
    load,
    openCreate,
    openEdit,
    save,
    disable,
  };
}
