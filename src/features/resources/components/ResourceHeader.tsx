import { Link } from 'react-router-dom';
import type { CrudResourceDefinition } from '../domain/CrudResource';
import styles from './ResourceHeader.module.css';

interface ResourceHeaderProps {
  resource: CrudResourceDefinition;
  total: number;
  visible: number;
  onHelpOpen?: () => void;
}

export function ResourceHeader({ resource, total, visible, onHelpOpen }: ResourceHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <span>{resource.moduleLabel}</span>
        <h2>{resource.label}</h2>
        <p>{visible} de {total} registros visibles · Gestiona esta información desde una vista segura y operativa.</p>
      </div>
      <div className={styles.actions}>
        {onHelpOpen ? (
          <button type="button" onClick={onHelpOpen}>
            <i className="fa-solid fa-circle-question" aria-hidden="true" />
            Ayuda
          </button>
        ) : null}
        <Link to={`/batch/${resource.module}/${resource.key}`}>Importar Excel</Link>
      </div>
    </div>
  );
}
