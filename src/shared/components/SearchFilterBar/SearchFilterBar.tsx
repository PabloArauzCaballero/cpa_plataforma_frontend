import type { ResourceTableFilter } from '@/features/resources/domain/CrudResource';
import { Button } from '@/shared/components/Button';
import styles from './SearchFilterBar.module.css';

interface SearchFilterBarProps {
  search: string;
  filters: Record<string, string | number | boolean>;
  filterFields: ResourceTableFilter[];
  onSearchChange: (value: string) => void;
  onFilterChange: (name: string, value: string) => void;
  onClearFilters: () => void;
  onCreate?: () => void;
  onReload: () => void;
  onExportOpen?: () => void;
  isSearchPending?: boolean;
  canCreate?: boolean;
  canExport?: boolean;
}

function normalizeOption(option: string | { value: string | number; label: string }) {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

function renderFilterInput(
  filter: ResourceTableFilter,
  value: string | number | boolean | undefined,
  onFilterChange: (name: string, value: string) => void,
) {
  const stringValue = value === undefined || value === null ? '' : String(value);

  if (filter.type === 'select') {
    const options = (filter.options ?? []).map(normalizeOption);
    return (
      <select value={stringValue} onChange={(event) => onFilterChange(filter.name, event.target.value)}>
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
      <select value={stringValue} onChange={(event) => onFilterChange(filter.name, event.target.value)}>
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
      onChange={(event) => onFilterChange(filter.name, event.target.value)}
    />
  );
}

export function SearchFilterBar({
  search,
  filters,
  filterFields,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onCreate,
  onReload,
  onExportOpen,
  isSearchPending = false,
  canCreate = true,
  canExport = true,
}: SearchFilterBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.topRow}>
        <label className={styles.searchBox}>
          <span>Buscar</span>
          <input value={search} placeholder="Buscar por cualquier campo" onChange={(event) => onSearchChange(event.target.value)} />
          {isSearchPending ? <small>Buscando cuando termines de escribir...</small> : null}
        </label>
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onReload}>Actualizar</Button>
          <Button type="button" variant="secondary" onClick={onClearFilters}>Limpiar filtros</Button>
          {canExport && onExportOpen ? <Button type="button" variant="secondary" onClick={onExportOpen}>Exportar</Button> : null}
          {canCreate && onCreate ? <Button type="button" onClick={onCreate}>Crear registro</Button> : null}
        </div>
      </div>

      <details className={styles.filtersPanel} open>
        <summary>Filtros por campo de la tabla</summary>
        <div className={styles.filtersGrid}>
          {filterFields.map((filter) => (
            <label key={filter.name}>
              <span>{filter.label}</span>
              {renderFilterInput(filter, filters[filter.name], onFilterChange)}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
