import { Button } from '@/shared/components/Button';
import styles from './SearchFilterBar.module.css';

interface SearchFilterBarProps {
  search: string;
  status: string;
  statusOptions: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCreate: () => void;
  onReload: () => void;
}

export function SearchFilterBar({
  search,
  status,
  statusOptions,
  onSearchChange,
  onStatusChange,
  onCreate,
  onReload,
}: SearchFilterBarProps) {
  return (
    <div className={styles.bar}>
      <label>
        <span>Buscar</span>
        <input value={search} placeholder="Buscar por cualquier campo" onChange={(event) => onSearchChange(event.target.value)} />
      </label>
      <label>
        <span>Filtro</span>
        <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="">Todos</option>
          {statusOptions.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onReload}>Actualizar</Button>
        <Button type="button" onClick={onCreate}>Crear registro</Button>
      </div>
    </div>
  );
}
