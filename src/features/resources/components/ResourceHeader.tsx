import { Link } from 'react-router-dom';
import type { CrudResourceDefinition } from '../domain/CrudResource';
import styles from './ResourceHeader.module.css';

interface ResourceHeaderProps {
  resource: CrudResourceDefinition;
  total: number;
  visible: number;
}

export function ResourceHeader({ resource, total, visible }: ResourceHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <span>{resource.moduleLabel}</span>
        <h2>{resource.label}</h2>
        <p>Tabla: {resource.table} · PK: {resource.primaryKey} · {visible} de {total} registros visibles</p>
      </div>
      <Link to={`/batch/${resource.module}/${resource.key}`}>Importar Excel</Link>
    </div>
  );
}
