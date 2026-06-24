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
  totalRecords: number;
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

function hasActiveQuery(search: string, filters: Record<string, FilterValue>): boolean {
  if (search.trim()) return true;
  return Object.values(filters).some((value) => value !== undefined && value !== null && String(value).trim() !== '');
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
      placeholder={`Filtrar por ${filter.label}`}
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
  totalRecords,
  isExporting,
  error,
  onClose,
  onExport,
}: ResourceExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<Record<string, FilterValue>>(initialFilters);
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearch(initialSearch);
      setFilters(initialFilters);
      setIsConfirmingAll(false);
    }
  }, [isOpen, initialSearch, initialFilters]);

  function setSearchValue(value: string) {
    setSearch(value);
    setIsConfirmingAll(false);
  }

  function setFilterValue(name: string, rawValue: string) {
    setIsConfirmingAll(false);
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
    setIsConfirmingAll(false);
  }

  async function submit() {
    const willExportEverything = !hasActiveQuery(search, filters);
    if (willExportEverything && !isConfirmingAll) {
      setIsConfirmingAll(true);
      return;
    }

    await onExport({ format, search, filters });
  }

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div className={styles.form}>
        <p className={styles.help}>
          Selecciona los filtros de consulta y el formato. La exportación usará estos filtros, no solo la página visible.
        </p>

        {isConfirmingAll ? (
          <section className={styles.warning} aria-live="polite">
            <h3>Confirmar exportación completa</h3>
            <p>
              No seleccionaste ningún filtro ni búsqueda. Esto descargará todos los registros encontrados para esta tabla
              {totalRecords > 0 ? `: ${totalRecords} registro(s).` : '.'}
            </p>
            <p>
              Usa filtros si solo necesitas una parte de la información. Confirma únicamente si realmente quieres descargar todo.
            </p>
          </section>
        ) : null}

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
            <input value={search} placeholder="Buscar en los registros" onChange={(event) => setSearchValue(event.target.value)} />
          </label>
        </div>

        <div className={styles.filtersGrid}>
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
          {isConfirmingAll ? (
            <Button type="button" variant="ghost" onClick={() => setIsConfirmingAll(false)} disabled={isExporting}>Volver a filtros</Button>
          ) : null}
          <Button type="button" onClick={() => void submit()} disabled={isExporting}>
            {isExporting ? 'Exportando...' : isConfirmingAll ? 'Sí, exportar todo' : 'Exportar registros'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
