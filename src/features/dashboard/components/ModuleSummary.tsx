import { Link } from 'react-router-dom';
import { resourceModules } from '@/features/resources/domain/resourceDefinitions';
import { TUTORIAL_ANCHORS, tutorialAnchor, tutorialAnchorFor } from '@/features/tutorials/domain/tutorialAnchors';
import { getModuleVisualMeta } from '../moduleMeta';
import styles from './ModuleSummary.module.css';

export function ModuleSummary() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionHeader}>
        <span>Módulos disponibles</span>
        <h3>Elige el área que quieres gestionar</h3>
        <p>Cada opción abre un tablero propio para elegir la tabla exacta antes de cargar registros.</p>
      </div>

      <div className={styles.grid} {...tutorialAnchor(TUTORIAL_ANCHORS.homeModules)}>
        {resourceModules.map((module) => {
          const meta = getModuleVisualMeta(module.key);
          return (
            <section className={styles.card} key={module.key} {...tutorialAnchorFor(TUTORIAL_ANCHORS.homeModuleCard, module.key)}>
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

              <Link to={`/modulos/${module.key}`} className={styles.cardLink}>
                Ver tablas
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}
