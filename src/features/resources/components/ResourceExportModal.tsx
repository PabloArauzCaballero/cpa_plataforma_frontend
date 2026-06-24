import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import type { ResourceTableFilter } from '../domain/CrudResource';
import styles from './ResourceExportModal.module.css';

type ExportFormat = 'csv' | 'excel' | 'json';

type FilterValue = string | number | boolean;

interface ResourceExportModalProps {
  title: string;
  isOpen: boolean;
  filterFields: ResourceTableFilter[];
  initialSearch: string;
  initialFilters: Record<string, FilterValue>;
  isExporting: boolean;
  error: string | null;
  onClose: () => void;
  onExport: (options: { format: ExportFormat; search: string; filters: Record<string, FilterValue> }) => Promise<void>;
}

function normalizeOption(option: string | { value: string | number; label: string }) {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

function toInputValue(value: FilterValue | undefined): string {
  return value === undefined || value === null ? '' : String(value);
}

function sanitizeFilterValue(value: string): FilterValue | '' {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}

function renderFilterInput(
  filter: ResourceTableFilter,
  value: FilterValue | undefined,
  onChange: (name: string, value: string) => void,
) {
  const stringValue = toInputValue(value);

  if (filter.type === 'select') {
    const options = (filter.options ?? []).map(normalizeOption);
    return (
      <select value={stringValue} onChange={(event) => onChange(filter.name, event.target.value)}>
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (filter.type === 'boolean') {
    return (
      <select value={stringValue} onChange={(event) => onChange(filter.name, event.target.value)}>
        <option value="">Todos</option>
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>
    );
  }

  return (
    <input
      type={filter.type}
      value={stringValue}
      placeholder={`Filtrar ${filter.label}`}
      onChange={(event) => onChange(filter.name, event.target.value)}
    />
  );
}

export function ResourceExportModal({
  title,
  isOpen,
  filterFields,
  initialSearch,
  initialFilters,
  isExporting,
  error,
  onClose,
  onExport,
}: ResourceExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<Record<string, FilterValue>>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setSearch(initialSearch);
      setFilters(initialFilters);
    }
  }, [isOpen, initialSearch, initialFilters]);

  function setFilterValue(name: string, rawValue: string) {
    setFilters((current) => {
      const next = { ...current };
      const cleanValue = sanitizeFilterValue(rawValue);
      if (cleanValue === '') delete next[name];
      else next[name] = cleanValue;
      return next;
    });
  }

  function clearModalFilters() {
    setSearch('');
    setFilters({});
  }

  async function submit() {
    await onExport({ format, search, filters });
  }

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div className={styles.form}>
        <p className={styles.help}>
          Selecciona los filtros de consulta y el formato. La exportación usará estos filtros, no solo la página visible.
        </p>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>Formato</span>
            <select value={format} onChange={(event) => setFormat(event.target.value as ExportFormat)}>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="json">JSON</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Búsqueda global</span>
            <input value={search} placeholder="Buscar en los registros" onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>

        <div className={styles.grid}>
          {filterFields.map((filter) => (
            <label key={filter.name} className={styles.field}>
              <span>{filter.label}</span>
              {renderFilterInput(filter, filters[filter.name], setFilterValue)}
            </label>
          ))}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={clearModalFilters} disabled={isExporting}>Limpiar consulta</Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isExporting}>Cancelar</Button>
          <Button type="button" onClick={() => void submit()} disabled={isExporting}>
            {isExporting ? 'Exportando...' : 'Exportar registros'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
