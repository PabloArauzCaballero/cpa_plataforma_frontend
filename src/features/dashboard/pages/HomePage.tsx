import { TUTORIAL_ANCHORS, tutorialAnchor } from '@/features/tutorials/domain/tutorialAnchors';
import { ModuleSummary } from '../components/ModuleSummary';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero} {...tutorialAnchor(TUTORIAL_ANCHORS.homeHero)}>
        <div className={styles.heroCopy}>
          <span>Panel principal</span>
          <h2>Centro de clases personalizadas CPA</h2>
          <p>
            Accede a los módulos administrativos, académicos, financieros y de seguridad desde una experiencia más clara, ordenada y lista para operación diaria.
          </p>
        </div>
        <div className={styles.heroBadge} aria-label="Plataforma operativa CPA">
          <i className="fa-solid fa-compass-drafting" aria-hidden="true" />
          <strong>Operación interna</strong>
          <span>Gestión modular con formularios, tablas, búsqueda, filtros e importación masiva.</span>
        </div>
      </div>
      <ModuleSummary />
    </section>
  );
}
