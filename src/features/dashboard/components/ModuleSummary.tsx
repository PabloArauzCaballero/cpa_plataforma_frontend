import { Link } from 'react-router-dom';
import { resourceModules } from '@/features/resources/domain/resourceDefinitions';
import styles from './ModuleSummary.module.css';

export function ModuleSummary() {
  return (
    <div className={styles.grid}>
      {resourceModules.map((module) => (
        <section className={styles.card} key={module.key}>
          <span>{module.resources.length} recursos</span>
          <h3>{module.label}</h3>
          <p>Gestión de registros del módulo {module.label.toLowerCase()} según endpoints documentados.</p>
          <Link to={`/modulos/${module.key}/${module.resources[0]?.key}`}>Abrir módulo</Link>
        </section>
      ))}
    </div>
  );
}
