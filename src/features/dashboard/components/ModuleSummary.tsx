import { Link } from 'react-router-dom';
import { resourceModules } from '@/features/resources/domain/resourceDefinitions';
import { getModuleVisualMeta } from '../moduleMeta';
import styles from './ModuleSummary.module.css';

export function ModuleSummary() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <span>Módulos disponibles</span>
        <h3>Elige el área que quieres gestionar</h3>
        <p>Cada opción abre su primer recurso operativo y mantiene navegación lateral para cambiar de pantalla.</p>
      </div>

      <div className={styles.grid}>
        {resourceModules.map((module) => {
          const meta = getModuleVisualMeta(module.key);
          const firstResource = module.resources[0];

          return (
            <section className={styles.card} key={module.key}>
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <i className={meta.icon} aria-hidden="true" />
                </span>
                <span className={styles.tag}>{meta.accent}</span>
              </div>

              <div className={styles.cardBody}>
                <h4>{module.label}</h4>
                <p>{meta.description}</p>
              </div>

              <Link to={`/modulos/${module.key}/${firstResource?.key}`} className={styles.cardLink}>
                Abrir módulo
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
