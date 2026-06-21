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
        <p>{visible} de {total} registros visibles · Gestiona esta información desde una vista segura y operativa.</p>
      </div>
      <Link to={`/batch/${resource.module}/${resource.key}`}>Importar Excel</Link>
    </div>
  );
}
