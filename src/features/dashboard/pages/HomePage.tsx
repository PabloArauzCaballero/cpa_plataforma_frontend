import { resourceDefinitions } from '@/features/resources/domain/resourceDefinitions';
import { ModuleSummary } from '../components/ModuleSummary';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <span>Panel principal</span>
          <h2>Centro de clases personalizadas CPA</h2>
          <p>
            Navega por personas, servicios educativos, deuda, pagos, contabilidad, infraestructura, inventario y seguridad.
          </p>
        </div>
        <div className={styles.kpiBox}>
          <strong>{resourceDefinitions.length}</strong>
          <span>endpoints CRUD registrados</span>
        </div>
      </div>
      <ModuleSummary />
    </section>
  );
}
